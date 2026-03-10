package career_platform.Backend.controller;


import career_platform.Backend.entity.job;
import career_platform.Backend.service.JobService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping("/create")
    public job createJob(@RequestBody job job) {
        return jobService.createJob(job);
    }

    @GetMapping("/all")
    public List<job> getJobs() {
        return jobService.getAllJobs();
    }
}