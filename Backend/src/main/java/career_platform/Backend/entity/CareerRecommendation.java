package career_platform.Backend.entity;


import jakarta.persistence.*;
import java.util.List;

@Entity
public class CareerRecommendation {

    @Id
    @GeneratedValue
    private Long id;

    private String role;
    private int score;
    private String type;

    @ElementCollection
    private List<String> missingSkills;

    private String explanation;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private student student;

    public Long getId() { return id; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public List<String> getMissingSkills() { return missingSkills; }
    public void setMissingSkills(List<String> missingSkills) { this.missingSkills = missingSkills; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public student getUser() { return student; }
    public void setUser(student user) { this.student = user; }
}
    // getters & setters
