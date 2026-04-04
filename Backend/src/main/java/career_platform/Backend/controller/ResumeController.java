package career_platform.Backend.controller;

import career_platform.Backend.Util.JwtUtil;
import career_platform.Backend.entity.student;
import career_platform.Backend.repositories.StudentRepository;
import career_platform.Backend.service.ResumeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/resume")
public class ResumeController {

    private final ResumeService resumeService;
    private final JwtUtil jwtUtil;
    private final StudentRepository studentRepository;

    public ResumeController(ResumeService resumeService, StudentRepository studentRepository, JwtUtil jwtUtil) {
        this.resumeService = resumeService;
        this.jwtUtil = jwtUtil;
        this.studentRepository = studentRepository;
    }

    @PostMapping("/upload")
    public String uploadResume(
            @RequestHeader("Authorization") String token,
            @RequestParam("file") MultipartFile file) throws Exception {

        String jwt = token.substring(7);
        String email = jwtUtil.extractEmail(jwt);

        studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return resumeService.uploadResume(file, email);
    }

    @GetMapping("/get")
    public ResponseEntity<?> getResume(@RequestHeader("Authorization") String token) {
        String jwt = token.substring(7);
        String email = jwtUtil.extractEmail(jwt);

        student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String resumeUrl = student.getResumeUrl();

        if (resumeUrl == null || resumeUrl.isBlank()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Resume not found");
        }

        return ResponseEntity.ok(resumeUrl);
    }
}
