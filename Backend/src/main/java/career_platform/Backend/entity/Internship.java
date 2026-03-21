package career_platform.Backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name="internship")
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String company;

    private String role;

    private String requiredSkills;

    private String description;

    public Internship(String company, String role, String requiredSkills, String description) {
        this.company = company;
        this.role = role;
        this.requiredSkills = requiredSkills;
        this.description = description;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getCompany() {
        return company;
    }
    public void setCompany(String company) {
        this.company = company;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }

    public void setRequiredSkills(String requiredSkills) {
        this.requiredSkills = requiredSkills;
    }
    public String getRequiredSkills() {
        return requiredSkills;
    }
}