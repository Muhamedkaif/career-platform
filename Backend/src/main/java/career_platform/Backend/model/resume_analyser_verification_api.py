from fastapi import FastAPI, UploadFile, File, Form
from PyPDF2 import PdfReader
import requests
import tempfile
import json
import re

app = FastAPI()

OLLAMA_URL = "http://localhost:11434/api/generate"

# -----------------------------
# Extract text from PDF
# -----------------------------
def extract_text_from_pdf(file_path):

    reader = PdfReader(file_path)
    text = ""

    for page in reader.pages:
        content = page.extract_text()
        if content:
            text += content

    return text


# -----------------------------
# Get GitHub repositories
# -----------------------------
def get_github_repos(username):

    url = f"https://api.github.com/users/{username}/repos"

    response = requests.get(url)

    if response.status_code != 200:
        return []

    repos = response.json()

    repo_list = []

    for repo in repos:

        repo_list.append({
            "name": repo.get("name"),
            "description": repo.get("description") or "No description",
            "language": repo.get("language")
        })

    return repo_list


# -----------------------------
# Get tech stack of repository
# -----------------------------
def get_repo_tech_stack(username, repo_name):

    url = f"https://api.github.com/repos/{username}/{repo_name}/languages"

    response = requests.get(url)

    if response.status_code != 200:
        return []

    languages = response.json()

    return list(languages.keys())


# -----------------------------
# Build repo analysis text
# -----------------------------
def build_repo_context(username, repos):

    repo_context = ""

    for repo in repos:

        tech_stack = get_repo_tech_stack(username, repo["name"])

        repo_context += f"""
Repository: {repo['name']}
Description: {repo['description']}
Primary Language: {repo['language']}
Tech Stack: {', '.join(tech_stack)}
"""

    return repo_context


# -----------------------------
# Clean LLM Output
# -----------------------------
def clean_llm_output(text):

    text = re.sub(r"```json|```", "", text)

    match = re.search(r"\{.*\}", text, re.DOTALL)

    if match:
        return json.loads(match.group())

    return {
        "resume_skills": [],
        "verified_skills": [],
        "missing_skills": []
    }


# -----------------------------
# Calculate confidence score
# -----------------------------
def calculate_confidence(resume_skills, verified_skills):

    if len(resume_skills) == 0:
        return 0

    score = (len(verified_skills) / len(resume_skills)) * 100

    return round(score)


# -----------------------------
# Resume Verification Endpoint
# -----------------------------
@app.post("/verify-resume")
async def verify_resume(
    github_username: str = Form(...),
    file: UploadFile = File(...)
):

    # Save uploaded resume
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(await file.read())
        temp_path = temp_file.name


    # Extract resume text
    resume_text = extract_text_from_pdf(temp_path)


    # Fetch GitHub repositories
    repos = get_github_repos(github_username)


    # Build repo tech stack summary
    repo_context = build_repo_context(github_username, repos)


    # Prompt for LLM
    prompt = f"""
You are a technical recruiter AI.

Task:
Extract skills from the resume and check if they appear in GitHub projects.

Resume:
{resume_text}

GitHub Projects:
{repo_context}

Return ONLY valid JSON.

Output format:

{{
 "resume_skills": [],
 "verified_skills": [],
 "missing_skills": [],
 "adherence_to_best_practices": "",
 "experience_with_modern_stacks": ""
}}
"""


    # Send to Ollama
    response = requests.post(
        OLLAMA_URL,
        json={
            "model": "phi3",
            "prompt": prompt,
            "stream": False
        }
    )

    result = response.json()

    llm_text = result.get("response", "")

    clean_json = clean_llm_output(llm_text)


    resume_skills = clean_json.get("resume_skills", [])
    verified_skills = clean_json.get("verified_skills", [])
    missing_skills = clean_json.get("missing_skills", [])


    # Calculate confidence score
    confidence_score = calculate_confidence(resume_skills, verified_skills)


    return {
        "resume_skills": resume_skills,
        "verified_skills": verified_skills,
        "missing_skills": missing_skills,
        "confidence_score": confidence_score,
        "adherence_to_best_practices": clean_json.get("adherence_to_best_practices", ""),
        "experience_with_modern_stacks": clean_json.get("experience_with_modern_stacks", "")
    }