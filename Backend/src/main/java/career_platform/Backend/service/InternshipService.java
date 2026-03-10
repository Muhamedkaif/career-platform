package career_platform.Backend.service;

import career_platform.Backend.entity.Internship;
import career_platform.Backend.repositories.InternshipRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InternshipService {

    private final InternshipRepository internshipRepository;

    public InternshipService(InternshipRepository internshipRepository) {
        this.internshipRepository = internshipRepository;
    }

    public Internship createInternship(Internship internship) {
        return internshipRepository.save(internship);
    }

    public List<Internship> getInternships() {
        return internshipRepository.findAll();
    }
}