package career_platform.Backend.service;


import career_platform.Backend.entity.student;
import career_platform.Backend.repositories.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public student saveStudent(student student) {
        return studentRepository.save(student);
    }

    public List<student> getAllStudents() {
        return studentRepository.findAll();
    }
}