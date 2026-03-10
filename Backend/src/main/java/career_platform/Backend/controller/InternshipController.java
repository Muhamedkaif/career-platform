package career_platform.Backend.controller;

import career_platform.Backend.entity.Internship;
import career_platform.Backend.service.InternshipService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/internships")
public class InternshipController {

    private final InternshipService internshipService;

    public InternshipController(InternshipService internshipService) {
        this.internshipService = internshipService;
    }

    @PostMapping("/create")
    public Internship createInternship(@RequestBody Internship internship) {
        return internshipService.createInternship(internship);
    }

    @GetMapping("/all")
    public List<Internship> getInternships() {
        return internshipService.getInternships();
    }
}