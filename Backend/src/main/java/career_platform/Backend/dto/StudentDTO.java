package career_platform.Backend.dto;

public class StudentDTO {

    private String name;
    private String email;
    private String githubLink;
    private String skills;
    private String resumeUrl;
    private String dept;
    private float cgpa;
    private String description;
    private String phone;
    private String rollno;

    public StudentDTO() {}

    public StudentDTO(String name, String email, String githubLink, String skills, String resumeUrl,String dept, float cgpa, String description, String phone, String rollno) {
        this.name = name;
        this.email = email;
        this.githubLink = githubLink;
        this.skills = skills;
        this.resumeUrl = resumeUrl;
        this.dept = dept;
        this.cgpa = cgpa;
        this.description = description;
        this.phone = phone;
        this.rollno = rollno;
    }

    public String getdept() {
        return dept;
    }
    public void setdept(String dept) {
        this.dept = dept;
    }
    public void setRollno(String rollno) {
        this.rollno = rollno;
    }
    public String getRollno() {
        return rollno;
    }
    public void setCgpa(float cgpa) {
        this.cgpa = cgpa;
    }
    public float getCgpa() {
        return cgpa;
    }
    public String getName() {
        return name;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getPhone() {
        return phone;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
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