package career_platform.Backend.dto;

public class StudentDTO {

    private String name;
    private String email;
    private String githubLink;
    private String skills;
    private String resumeUrl;

    public StudentDTO() {}

    public StudentDTO(String name, String email, String githubLink, String skills, String resumeUrl) {
        this.name = name;
        this.email = email;
        this.githubLink = githubLink;
        this.skills = skills;
        this.resumeUrl = resumeUrl;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGithubLink() {
        return githubLink;
    }

    public void setGithubLink(String githubLink) {
        this.githubLink = githubLink;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }
}