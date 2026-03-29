package career_platform.Backend.dto;

import java.util.List;

public class AIResponse {
    public List<RoleResult> jobs;
    public List<RoleResult> internships;
    public List<RoleResult> getJobs() { return jobs; }
    public void setJobs(List<RoleResult> jobs) { this.jobs = jobs; }

    public List<RoleResult> getInternships() { return internships; }
    public void setInternships(List<RoleResult> internships) { this.internships = internships; }
}