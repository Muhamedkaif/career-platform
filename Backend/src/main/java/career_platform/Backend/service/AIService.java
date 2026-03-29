package career_platform.Backend.service;


import career_platform.Backend.dto.*;
import career_platform.Backend.entity.*;
import career_platform.Backend.repositories.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.*;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

@Service
public class AIService {

    @Autowired
    private CareerRecommendationRepository repository;

    @Autowired
    private
    StudentRepository userRepository;

    private final String AI_URL = "http://localhost:8000/analyze";

    // 🔽 STEP 1: Download resume from Cloudinary
    public File downloadResume(String fileUrl) throws IOException {
        URL url = new URL(fileUrl);
        InputStream in = url.openStream();

        File tempFile = File.createTempFile("resume", ".pdf");
        Files.copy(in, tempFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

        return tempFile;
    }

    // 🔽 STEP 2: Call FastAPI
    public AIResponse callAI(String githubUsername, String resumeUrl) throws IOException {

        File file = downloadResume(resumeUrl);

        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("github_username", githubUsername);
        body.add("file", new FileSystemResource(file));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> request =
                new HttpEntity<>(body, headers);

        ResponseEntity<AIResponse> response =
                restTemplate.postForEntity(AI_URL, request, AIResponse.class);

        return response.getBody();
    }

    // 🔽 STEP 3: Save to DB
    public void saveResults(AIResponse response, String email) {

        student user = userRepository.findByEmail(email).orElseThrow();

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