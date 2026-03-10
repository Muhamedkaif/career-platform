package career_platform.Backend.entity;

import jakarta.persistence.*;

@Entity
public class student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String githubLink;
    private String skills;
    private String resumeUrl;

    public student() {}

    public student(Long id, String name, String email, String githubLink, String skills, String resumeUrl) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.githubLink = githubLink;
        this.skills = skills;
        this.resumeUrl = resumeUrl;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getGithubLink() { return githubLink; }

    public void setGithubLink(String githubLink) { this.githubLink = githubLink; }

    public String getSkills() { return skills; }

    public void setSkills(String skills) { this.skills = skills; }

    public String getResumeUrl() { return resumeUrl; }

    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }
}