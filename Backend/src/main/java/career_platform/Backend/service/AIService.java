package career_platform.Backend.service;

import career_platform.Backend.dto.AIResponse;
import career_platform.Backend.dto.RoleResult;
import career_platform.Backend.entity.CareerRecommendation;
import career_platform.Backend.entity.Internship;
import career_platform.Backend.entity.job;
import career_platform.Backend.entity.student;
import career_platform.Backend.repositories.CareerRecommendationRepository;
import career_platform.Backend.repositories.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AIService {

    @Autowired
    private CareerRecommendationRepository repository;

    @Autowired
    private StudentRepository userRepository;

    private final String AI_URL = "http://localhost:11434/api/generate";

    public List<String> getCurrentSkills(String email) {
        student user = userRepository.findByEmail(email).orElseThrow();

        if (user.getSkills() == null || user.getSkills().isBlank()) {
            return Collections.emptyList();
        }

        return Arrays.stream(user.getSkills().split(","))
                .map(String::trim)
                .filter(skill -> !skill.isBlank())
                .collect(Collectors.toList());
    }

    public AIResponse callAI(
            String githubUsername,
            String resumeUrl,
            List<job> jobs,
            List<Internship> internships,
            String studentSkills
    ) throws IOException {
        RestTemplate restTemplate = new RestTemplate();

        String prompt = buildPrompt(githubUsername, resumeUrl, jobs, internships, studentSkills);

        String requestBody = "{"
                + "\"model\":\"phi3\","
                + "\"prompt\":" + quoteJson(prompt) + ","
                + "\"stream\":false"
                + "}";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response;

        try {
            response = restTemplate.postForEntity(AI_URL, request, String.class);
        } catch (ResourceAccessException e) {
            throw new IOException("Ollama is not running on http://localhost:11434/api/generate", e);
        }

        return parseOllamaResponse(response.getBody(), studentSkills);
    }

    public void saveResults(AIResponse response, String email) {
        student user = userRepository.findByEmail(email).orElseThrow();

        if (response.getCurrent_skills() != null && !response.getCurrent_skills().isEmpty()) {
            user.setSkills(String.join(", ", response.getCurrent_skills()));
            userRepository.save(user);
        }

        if (response.jobs != null) {
            for (RoleResult job : response.jobs) {
                CareerRecommendation rec = new CareerRecommendation();

                rec.setRole(job.getRole());
                rec.setScore(job.getScore());
                rec.setType("JOB");
                rec.setMissingSkills(job.getMissing_skills());
                rec.setExplanation(job.getExplanation());
                rec.setUser(user);

                repository.save(rec);
            }
        }

        if (response.internships != null) {
            for (RoleResult intern : response.internships) {
                CareerRecommendation rec = new CareerRecommendation();

                rec.setRole(intern.getRole());
                rec.setScore(intern.getScore());
                rec.setType("INTERNSHIP");
                rec.setMissingSkills(intern.getMissing_skills());
                rec.setExplanation(intern.getExplanation());
                rec.setUser(user);

                repository.save(rec);
            }
        }
    }

    private String buildPrompt(
            String githubUsername,
            String resumeUrl,
            List<job> jobs,
            List<Internship> internships,
            String studentSkills
    ) {
        String currentSkills = (studentSkills == null || studentSkills.isBlank()) ? "" : studentSkills;

        return "You are a career recommendation engine.\n"
                + "Return ONLY valid JSON.\n"
                + "No markdown. No extra text.\n"
                + "Use this exact format:\n"
                + "{"
                + "\"current_skills\":[\"skill1\"],"
                + "\"jobs\":[{\"role\":\"\",\"score\":0,\"missing_skills\":[],\"explanation\":\"\",\"recommended_courses\":[]}],"
                + "\"internships\":[{\"role\":\"\",\"score\":0,\"missing_skills\":[],\"explanation\":\"\",\"recommended_courses\":[]}]"
                + "}\n\n"
                + "Student current skills: " + currentSkills + "\n"
                + "Student github username: " + (githubUsername == null ? "" : githubUsername) + "\n"
                + "Student resume url: " + (resumeUrl == null ? "" : resumeUrl) + "\n"
                + "Posted jobs: " + buildJobsPayload(jobs) + "\n"
                + "Posted internships: " + buildInternshipsPayload(internships) + "\n"
                + "Recommend the best matches and include missing skills and suggested learning.";
    }

    private String buildJobsPayload(List<job> jobs) {
        return jobs.stream()
                .map(job -> buildRoleJson(job.getTitle(), job.getSkills()))
                .collect(Collectors.joining(",", "[", "]"));
    }

    private String buildInternshipsPayload(List<Internship> internships) {
        return internships.stream()
                .map(internship -> buildRoleJson(internship.getTitle(), internship.getSkills()))
                .collect(Collectors.joining(",", "[", "]"));
    }

    private AIResponse parseOllamaResponse(String ollamaBody, String studentSkills) {
        String modelResponse = extractFieldValue(ollamaBody, "response");
        String jsonPayload = extractJsonObject(modelResponse);

        AIResponse response = new AIResponse();
        response.setCurrent_skills(parseStringArray(extractArray(jsonPayload, "current_skills"), studentSkills));
        response.setJobs(parseRoleResults(extractObjectsArray(jsonPayload, "jobs")));
        response.setInternships(parseRoleResults(extractObjectsArray(jsonPayload, "internships")));
        return response;
    }

    private List<RoleResult> parseRoleResults(String arrayContent) {
        List<RoleResult> results = new ArrayList<>();
        if (arrayContent == null || arrayContent.isBlank()) {
            return results;
        }

        Matcher matcher = Pattern.compile("\\{(.*?)\\}", Pattern.DOTALL).matcher(arrayContent);
        while (matcher.find()) {
            String block = matcher.group();
            RoleResult result = new RoleResult();
            result.setRole(extractStringValue(block, "role"));
            result.setScore(extractIntValue(block, "score"));
            result.setMissing_skills(parseStringArray(extractArray(block, "missing_skills"), ""));
            result.setExplanation(extractStringValue(block, "explanation"));
            result.setRecommended_courses(parseStringArray(extractArray(block, "recommended_courses"), ""));
            results.add(result);
        }

        return results;
    }

    private List<String> parseStringArray(String rawArray, String fallbackCsv) {
        if (rawArray == null || rawArray.isBlank()) {
            if (fallbackCsv == null || fallbackCsv.isBlank()) {
                return new ArrayList<>();
            }

            return Arrays.stream(fallbackCsv.split(","))
                    .map(String::trim)
                    .filter(item -> !item.isBlank())
                    .collect(Collectors.toList());
        }

        Matcher matcher = Pattern.compile("\"(.*?)\"").matcher(rawArray);
        List<String> items = new ArrayList<>();
        while (matcher.find()) {
            items.add(unescapeJson(matcher.group(1)).trim());
        }
        return items;
    }

    private String extractObjectsArray(String json, String key) {
        return extractArray(json, key);
    }

    private String extractArray(String json, String key) {
        if (json == null) return "";

        int keyIndex = json.indexOf("\"" + key + "\"");
        if (keyIndex < 0) return "";

        int start = json.indexOf('[', keyIndex);
        if (start < 0) return "";

        int depth = 0;
        for (int i = start; i < json.length(); i++) {
            char ch = json.charAt(i);
            if (ch == '[') depth++;
            if (ch == ']') {
                depth--;
                if (depth == 0) {
                    return json.substring(start, i + 1);
                }
            }
        }

        return "";
    }

    private String extractJsonObject(String text) {
        if (text == null) return "{}";

        int start = text.indexOf('{');
        int end = text.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return text.substring(start, end + 1);
        }
        return "{}";
    }

    private String extractFieldValue(String json, String key) {
        if (json == null) return "";

        Pattern pattern = Pattern.compile("\"" + key + "\"\\s*:\\s*\"((?:\\\\.|[^\"])*)\"", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(json);
        if (matcher.find()) {
            return unescapeJson(matcher.group(1));
        }
        return "";
    }

    private String extractStringValue(String json, String key) {
        return extractFieldValue(json, key);
    }

    private int extractIntValue(String json, String key) {
        if (json == null) return 0;

        Pattern pattern = Pattern.compile("\"" + key + "\"\\s*:\\s*(\\d+)");
        Matcher matcher = pattern.matcher(json);
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }
        return 0;
    }

    private String buildRoleJson(String role, List<String> skills) {
        String safeRole = quoteJson(role == null ? "" : role);
        String skillsJson = (skills == null ? Collections.<String>emptyList() : skills).stream()
                .map(skill -> quoteJson(skill == null ? "" : skill))
                .collect(Collectors.joining(",", "[", "]"));

        return "{\"role\":" + safeRole + ",\"skills\":" + skillsJson + "}";
    }

    private String quoteJson(String value) {
        String escaped = value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");

        return "\"" + escaped + "\"";
    }

    private String unescapeJson(String value) {
        return value
                .replace("\\\"", "\"")
                .replace("\\\\", "\\")
                .replace("\\n", "\n")
                .replace("\\r", "\r")
                .replace("\\t", "\t")
                .replace("\\b", "\b")
                .replace("\\f", "\f");
    }
}
