package career_platform.Backend.controller;

import career_platform.Backend.entity.student;
import career_platform.Backend.service.ResumeService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import career_platform.Backend.Util.JwtUtil;
import career_platform.Backend.repositories.StudentRepository;

@RestController
@RequestMapping("/resume")
public class ResumeController {

    private final ResumeService resumeService;
    private final JwtUtil jwtUtil;
    private final StudentRepository studentRepository;

    public ResumeController(ResumeService resumeService , StudentRepository studentRepository , JwtUtil jwtUtil) {
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

        student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Now user is authenticated
        return resumeService.uploadResume(file, email);
    }
}