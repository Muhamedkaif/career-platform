package career_platform.Backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name="student")
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
    private String dept;
    private String githubLink;
    private String skills;
    private String resumeUrl;
    private Float cgpa;
    private String phone;
    private String description;
    private String rollno;

    public student() {}

    public student(Long id, String name, String email, String githubLink, String skills, String resumeUrl,String password , String dept, Float cgpa,String phone, String description, String rollno)
    {
        this.id = id;
        this.name = name;
        this.email = email;
        this.githubLink = githubLink;
        this.skills = skills;
        this.resumeUrl = resumeUrl;
        this.password = password;
        this.dept = dept;
        this.cgpa = cgpa;
        this.phone = phone;
        this.description = description;
        this.rollno = rollno;
    }

    public void setDept(String dept) {
        this.dept = dept;
    }
    public String getDept() {
        return dept;
    }
    public void setRollno(String rollno) {
        this.rollno = rollno;
    }
    public String getRollno() {
        return rollno;
    }
    public void setCgpa(Float cgpa) {
        this.cgpa = cgpa;
    }
    public Float getCgpa() {
        return cgpa;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getPhone() {
        return phone;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getDescription() {
        return description;
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