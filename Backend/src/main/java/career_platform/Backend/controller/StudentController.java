package career_platform.Backend.controller;

import career_platform.Backend.dto.DashboardDTO;
import career_platform.Backend.dto.GithubDTO;
import career_platform.Backend.entity.student;
import career_platform.Backend.repositories.StudentRepository;
import career_platform.Backend.service.AuthService;
import career_platform.Backend.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import career_platform.Backend.Util.JwtUtil;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;
    private AuthService authService;
    private JwtUtil jwtUtil;
    private StudentRepository studentRepository;

    public StudentController(StudentService studentService,AuthService authService,JwtUtil jwtUtil,StudentRepository studentRepository) {
        this.studentService = studentService;
        this.authService = authService;
        this.jwtUtil = jwtUtil;
        this.studentRepository = studentRepository;
    }

    @PostMapping("/register")
    public student registerStudent(@Valid @RequestBody student student_details) {

        return studentService.saveStudent(student_details);
    }

    @GetMapping("/all")
    public List<student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @PostMapping("/login")
    public String login(@RequestBody student student) {
        return authService.login(student.getEmail(), student.getPassword());
    }
    @GetMapping("/dashboard")
    public DashboardDTO getDashboard(@RequestHeader("Authorization") String token) {

        String jwt = token.substring(7);

        String email = jwtUtil.extractEmail(jwt);

        student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new DashboardDTO(
                student.getEmail(),
                student.getName(),   // ✅ added
                "Welcome to your dashboard 🚀"
        );
    }
        @PostMapping("/github")
        public String saveGithubLink(
                @RequestHeader("Authorization") String token,
                @RequestBody GithubDTO githubDTO) {

            String jwt = token.substring(7);
            String email = jwtUtil.extractEmail(jwt);

            student student = studentRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            student.setGithubLink(githubDTO.getGithubLink());
            studentRepository.save(student);

            return "GitHub link saved successfully ✅";
        }
}