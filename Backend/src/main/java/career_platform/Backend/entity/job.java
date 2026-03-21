package career_platform.Backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name="job")
public class job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String company;
    private String role;
    private String requiredSkills;
    private String description;

    public job() {}

    public job(Long id, String company, String role, String requiredSkills, String description) {
        this.id = id;
        this.company = company;
        this.role = role;
        this.requiredSkills = requiredSkills;
        this.description = description;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getCompany() { return company; }

    public void setCompany(String company) { this.company = company; }

    public String getRole() { return role; }

    public void setRole(String role) { this.role = role; }

    public String getRequiredSkills() { return requiredSkills; }

    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }
}