package career_platform.Backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "job")
public class job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String company;
    private String location;
    private String type;
    private String salary;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    private LocalDate deadline;

    @ElementCollection
    @CollectionTable(name = "job_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill")
    private List<String> skills = new ArrayList<>();

    public job() {}

    public job(Long id, String title, String company, String location, String type, String salary,
               String description, String requirements, LocalDate deadline, List<String> skills) {
        this.id = id;
        this.title = title;
        this.company = company;
        this.location = location;
        this.type = type;
        this.salary = salary;
        this.description = description;
        this.requirements = requirements;
        this.deadline = deadline;
        this.skills = skills;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }

    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }

    public void setLocation(String location) { this.location = location; }

    public String getType() { return type; }

    public void setType(String type) { this.type = type; }

    public String getSalary() { return salary; }

    public void setSalary(String salary) { this.salary = salary; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public String getRequirements() { return requirements; }

    public void setRequirements(String requirements) { this.requirements = requirements; }

    public LocalDate getDeadline() { return deadline; }

    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public List<String> getSkills() { return skills; }

    public void setSkills(List<String> skills) { this.skills = skills; }
}
