package career_platform.Backend.controller;

import career_platform.Backend.entity.student;
import career_platform.Backend.service.StudentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/register")
    public student registerStudent(@RequestBody student student) {
        return studentService.saveStudent(student);
    }


    @GetMapping("/all")
    public List<student> getAllStudents() {
        return studentService.getAllStudents();
    }
}