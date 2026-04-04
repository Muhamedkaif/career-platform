from fastapi import FastAPI, UploadFile, File, Form
from PyPDF2 import PdfReader
import requests
import tempfile
import json
import re
from typing import List, Dict

app = FastAPI(title="AI Career Recommendation Engine")

# -----------------------------
# CONFIG (switch later to API LLM)
# -----------------------------
USE_OLLAMA = True
OLLAMA_URL = "http://localhost:11434/api/generate"

# -----------------------------
# PDF TEXT EXTRACTION
# -----------------------------
def extract_text_from_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        content = page.extract_text()
        if content:
            text += content
    return text


# -----------------------------
# GITHUB FUNCTIONS
# -----------------------------
def get_github_repos(username: str):
    url = f"https://api.github.com/users/{username}/repos"
    res = requests.get(url)
    return res.json() if res.status_code == 200 else []


def get_repo_tech_stack(username: str, repo_name: str):
    url = f"https://api.github.com/repos/{username}/{repo_name}/languages"
    res = requests.get(url)
    return list(res.json().keys()) if res.status_code == 200 else []


def extract_skills_from_github(username: str) -> List[str]:
    repos = get_github_repos(username)
    skills = set()

    for repo in repos:
        tech = get_repo_tech_stack(username, repo["name"])
        for t in tech:
            skills.add(t.lower())

    return list(skills)


# -----------------------------
# SKILL NORMALIZATION
# -----------------------------
def normalize_skills(skills: List[str]) -> List[str]:
    mapping = {
        "js": "javascript",
        "py": "python",
        "html5": "html",
        "css3": "css",
        "node": "nodejs"
    }
    return list(set([mapping.get(s, s) for s in skills]))


# -----------------------------
# SIMPLE SKILL EXTRACTION
# -----------------------------
def extract_skills_from_resume(text: str) -> List[str]:
    words = re.findall(r"\b[a-zA-Z]+\b", text.lower())
    return list(set(words))


# -----------------------------
# LLM CALL
# -----------------------------
def call_llm(prompt: str) -> str:
    if USE_OLLAMA:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": "phi3",
                "prompt": prompt,
                "stream": False
            }
        )
        return response.json().get("response", "")
    else:
        # Replace with OpenAI / Gemini later
        return ""


# -----------------------------
# CLEAN LLM OUTPUT
# -----------------------------
def clean_llm_output(text: str):
    text = re.sub(r"```.*?```", "", text, flags=re.DOTALL)
    match = re.search(r"\{.*\}", text, re.DOTALL)

    if not match:
        return None

    try:
        data = json.loads(match.group())
    except:
        return None

    if "jobs" not in data or "internships" not in data:
        return None

    return data


# -----------------------------
# SCORING ENGINE
# -----------------------------
def weighted_score(user_skills: List[str], role_skills: List[str]) -> int:
    weights = {"python": 2, "react": 2}

    total = 0
    score = 0

    for skill in role_skills:
        w = weights.get(skill, 1)
        total += w
        if skill in user_skills:
            score += w

    return int((score / total) * 100)


def generate_explanation(score: int, missing: List[str]) -> str:
    if score == 100:
        return "You meet all required skills."
    elif score >= 60:
        return f"Good fit. Improve: {', '.join(missing)}."
    else:
        return f"You need to learn: {', '.join(missing)}."


def suggest_learning(missing: List[str]) -> List[str]:
    return [f"Learn {skill}" for skill in missing]


# -----------------------------
# NORMALIZE DB INPUT
# -----------------------------
def normalize_roles(items: List[Dict], role_key: str = "role") -> List[Dict]:
    normalized = []

    for item in items:
        role = item.get(role_key) or item.get("title") or ""
        skills = item.get("skills") or []

        if isinstance(skills, str):
            skills = [s.strip().lower() for s in skills.split(",") if s.strip()]
        else:
            skills = [str(s).strip().lower() for s in skills if str(s).strip()]

        normalized.append({
            "role": role,
            "skills": normalize_skills(skills)
        })

    return normalized


# -----------------------------
# FALLBACK SYSTEM (CORE)
# -----------------------------
def fallback_recommendation(skills: List[str], jobs: List[Dict], internships: List[Dict]) -> Dict:
    result = {"current_skills": skills, "jobs": [], "internships": []}

    for job in jobs:
        score = weighted_score(skills, job["skills"])
        missing = list(set(job["skills"]) - set(skills))

        result["jobs"].append({
            "role": job["role"],
            "score": score,
            "missing_skills": missing,
            "explanation": generate_explanation(score, missing),
            "recommended_courses": suggest_learning(missing)
        })

    for intern in internships:
        score = weighted_score(skills, intern["skills"])
        missing = list(set(intern["skills"]) - set(skills))

        result["internships"].append({
            "role": intern["role"],
            "score": score,
            "missing_skills": missing,
            "explanation": generate_explanation(score, missing),
            "recommended_courses": suggest_learning(missing)
        })

    # sort
    result["jobs"].sort(key=lambda x: x["score"], reverse=True)
    result["internships"].sort(key=lambda x: x["score"], reverse=True)

    return result


# -----------------------------
# MAIN API
# -----------------------------
@app.post("/analyze")
async def analyze(
    github_username: str = Form(...),
    file: UploadFile = File(...),
    jobs: str = Form(...),
    internships: str = Form(...)
):

    # Save resume
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(await file.read())
        temp_path = temp_file.name

    resume_text = extract_text_from_pdf(temp_path)

    github_skills = extract_skills_from_github(github_username)

    resume_skills = extract_skills_from_resume(resume_text)

    combined_skills = normalize_skills(resume_skills + github_skills)
    parsed_jobs = normalize_roles(json.loads(jobs), "role")
    parsed_internships = normalize_roles(json.loads(internships), "role")

    # -----------------------------
    # STRICT PROMPT
    # -----------------------------
    prompt = f"""
You are a career recommendation engine.

RULES:
- Return ONLY valid JSON
- No extra text
- No code
- Max 2 line explanation

Skills:
{combined_skills}

Jobs:
{parsed_jobs}

Internships:
{parsed_internships}

FORMAT:
{{
 "current_skills": [],
 "jobs": [{{"role":"","score":0,"missing_skills":[],"explanation":""}}],
 "internships": [{{"role":"","score":0,"missing_skills":[],"explanation":""}}]
}}
"""

    llm_output = call_llm(prompt)
    cleaned = clean_llm_output(llm_output)

    if cleaned is None:
        return fallback_recommendation(combined_skills, parsed_jobs, parsed_internships)

    if "current_skills" not in cleaned:
        cleaned["current_skills"] = combined_skills

    return cleaned
