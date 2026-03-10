package career_platform.Backend.service;


import career_platform.Backend.entity.job;
import career_platform.Backend.repositories.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public job createJob(job job) {
        return jobRepository.save(job);
    }

    public List<job> getAllJobs() {
        return jobRepository.findAll();
    }
}