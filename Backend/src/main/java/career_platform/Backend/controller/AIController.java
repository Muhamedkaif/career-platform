package career_platform.Backend.controller;


import career_platform.Backend.dto.*;
import career_platform.Backend.entity.Internship;
import career_platform.Backend.entity.student;
import career_platform.Backend.entity.job;
import career_platform.Backend.repositories.InternshipRepository;
import career_platform.Backend.repositories.JobRepository;
import career_platform.Backend.service.AIService;
import career_platform.Backend.repositories.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import career_platform.Backend.Util.JwtUtil;

import java.util.List;

@RestController
@RequestMapping("/ai")
public class AIController {

    @Autowired
    private AIService aiService;
    private StudentRepository studentRepository;
    private JobRepository jobRepository;
    private InternshipRepository internshipRepository;
    private JwtUtil jwtUtil;

    public AIController(
            StudentRepository studentRepository,
            JobRepository jobRepository,
            InternshipRepository internshipRepository,
            JwtUtil jwtUtil,
            AIService aiService
    ) {
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
        this.internshipRepository = internshipRepository;
        this.jwtUtil = jwtUtil;
        this.aiService = aiService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyze(@RequestHeader("Authorization") String token) {
        try {

            String email = jwtUtil.extractEmail(token.substring(7));
            // 1. Fetch student from DB
            student student = studentRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            // 2. Get stored values
            String github = student.getGithubLink();
            String resume = student.getResumeUrl();
            String studentSkills = student.getSkills();
            List<job> jobs = jobRepository.findAll();
            List<Internship> internships = internshipRepository.findAll();

            // 3. Call AI
            AIResponse response = aiService.callAI(github, resume, jobs, internships, studentSkills);

            // 4. Save result
            aiService.saveResults(response, email);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }
}
