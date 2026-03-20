package career_platform.Backend.service;


import career_platform.Backend.entity.student;
import career_platform.Backend.repositories.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    public StudentService(StudentRepository studentRepository, PasswordEncoder passwordEncoder) {
        this.passwordEncoder  = passwordEncoder;
        this.studentRepository = studentRepository;
    }

    public student saveStudent(student student) {
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        return studentRepository.save(student);
    }

    public List<student> getAllStudents() {
        return studentRepository.findAll();
    }
}