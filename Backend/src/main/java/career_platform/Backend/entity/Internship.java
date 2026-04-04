package career_platform.Backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name="internship")
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String company;

    private String location;

    private String duration;

    private String stipend;

    private String description;

    private LocalDate deadline;

    private Integer openings;

    @ElementCollection
    private List<String> skills;

    public Internship() {}

    public Internship(String title, String company, String location, String duration, String stipend, String description, LocalDate deadline, Integer openings, List<String> skills) {
        this.title = title;
        this.company = company;
        this.location = location;
        this.duration = duration;
        this.stipend = stipend;
        this.description = description;
        this.deadline = deadline;
        this.openings = openings;
        this.skills = skills;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompany() {
        return company;
    }
    public void setCompany(String company) {
        this.company = company;
    }

    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }

    public String getDuration() {
        return duration;
    }
    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getStipend() {
        return stipend;
    }
    public void setStipend(String stipend) {
        this.stipend = stipend;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDeadline() {
        return deadline;
    }
    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public Integer getOpenings() {
        return openings;
    }
    public void setOpenings(Integer openings) {
        this.openings = openings;
    }

    public List<String> getSkills() {
        return skills;
    }
    public void setSkills(List<String> skills) {
        this.skills = skills;
    }
}