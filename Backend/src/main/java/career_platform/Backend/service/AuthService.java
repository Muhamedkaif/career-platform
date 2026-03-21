package career_platform.Backend.service;

import career_platform.Backend.Util.JwtUtil;
import career_platform.Backend.entity.student;
import career_platform.Backend.repositories.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder; // ✅ ADD THIS

    public String login(String email, String password) {

        student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔐 CORRECT WAY
        if (!passwordEncoder.matches(password, student.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(student.getEmail());
    }
}