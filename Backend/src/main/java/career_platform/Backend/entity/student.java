package career_platform.Backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
public class student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "username required")
    private String name;
    @Email(message = "invalid email format")
    @NotBlank(message = "email is required")
    private String email;
    @NotBlank(message = "password is required")
    private String password;
    private String githubLink;
    private String skills;
    private String resumeUrl;

    public student() {}

    public student(Long id, String name, String email, String githubLink, String skills, String resumeUrl,String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.githubLink = githubLink;
        this.skills = skills;
        this.resumeUrl = resumeUrl;
        this.password = password;
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

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}