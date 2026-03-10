package career_platform.Backend.service;

import career_platform.Backend.entity.job;
import career_platform.Backend.entity.student;
import career_platform.Backend.repositories.JobRepository;
import career_platform.Backend.repositories.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendationService {

    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;

    public RecommendationService(StudentRepository studentRepository, JobRepository jobRepository) {
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
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
}