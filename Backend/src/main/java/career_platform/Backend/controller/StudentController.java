package career_platform.Backend.controller;

import career_platform.Backend.dto.DashboardDTO;
import career_platform.Backend.dto.GithubDTO;
import career_platform.Backend.dto.SkillResponse;
import career_platform.Backend.entity.Skill;
import career_platform.Backend.entity.StudentSkill;
import career_platform.Backend.entity.student;
import career_platform.Backend.repositories.SkillRepository;
import career_platform.Backend.repositories.StudentRepository;
import career_platform.Backend.repositories.StudentSkillRepository;
import career_platform.Backend.service.AuthService;
import career_platform.Backend.service.StudentService;
import career_platform.Backend.service.StudentSkillService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import career_platform.Backend.Util.JwtUtil;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;
    private AuthService authService;
    private JwtUtil jwtUtil;
    private StudentRepository studentRepository;
    private StudentSkillRepository studentSkillRepository;

    public StudentController(StudentService studentService, SkillRepository skillRepository,AuthService authService, JwtUtil jwtUtil, StudentRepository studentRepository) {
        this.studentService = studentService;
        this.studentSkillRepository = studentSkillRepository;
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
                student.getName(),
                student.getDept(),// ✅ added
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
    @Autowired
    private StudentSkillService studentSkillService;

    @PostMapping("/{id}/skills/auto")
    public ResponseEntity<?> updateSkillsFromAI(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> skills) {

        studentSkillService.saveOrUpdateSkills(id, skills);

        return ResponseEntity.ok("Skills updated successfully");
    }
    @GetMapping("/{id}/skills")
    public List<SkillResponse> getSkills(@PathVariable Long id) {

        List<StudentSkill> skills = studentSkillRepository.findByStudentId(id);

        return skills.stream()
                .map(s -> new SkillResponse(
                        s.getSkill().getName(),
                        s.getScore()
                ))
                .toList();
    }

}