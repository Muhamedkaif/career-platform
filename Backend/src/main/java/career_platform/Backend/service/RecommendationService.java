package career_platform.Backend.service;

import career_platform.Backend.entity.Internship;
import career_platform.Backend.entity.job;
import career_platform.Backend.entity.student;
import career_platform.Backend.repositories.InternshipRepository;
import career_platform.Backend.repositories.JobRepository;
import career_platform.Backend.repositories.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendationService {

    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final InternshipRepository internshipRepository;

    public RecommendationService(StudentRepository studentRepository, InternshipRepository internshipRepository, JobRepository jobRepository) {
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
        this.internshipRepository = internshipRepository;
    }

    public List<job> recommendJobs(Long studentId) {

        student student = studentRepository.findById(studentId).orElse(null);
        List<job> jobs = jobRepository.findAll();
        List<job> recommended = new ArrayList<>();

        if (student == null) return recommended;

        for (job job : jobs) {
            if (job.getRequiredSkills().toLowerCase()
                    .contains(student.getSkills().toLowerCase())) {

                recommended.add(job);
            }
        }

        return recommended;
    }

    public List<Internship> recommendInternships(Long studentId) {

        student student = studentRepository.findById(studentId).orElse(null);
        List<Internship> internships = internshipRepository.findAll();
        List<Internship> recommended = new ArrayList<>();

        if(student == null) return recommended;

        for(Internship internship : internships){
            if(internship.getRequiredSkills().toLowerCase()
                    .contains(student.getSkills().toLowerCase())){
                recommended.add(internship);
            }
        }

        return recommended;
    }
}