package career_platform.Backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "student_skills",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"student_id", "skill_id"})
        }
)
public class StudentSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private student student;

    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    private int score;
    private int percentage;
    private String level;

    private LocalDateTime lastUpdated;

    // getters & setters
    public StudentSkill(student student, Skill skill, int score, int percentage, String level) {
        this.student = student;
        this.skill = skill;
        this.score = score;
        this.percentage = percentage;
        this.level = level;
    }
    public StudentSkill() {}
    public void  setStudent(student student) {
        this.student = student;
    }
    public student getStudent() {
        return student;
    }
    public void setSkill(Skill skill) {
        this.skill = skill;
    }
    public Skill getSkill() {
        return skill;
    }
    public void setScore(int score) {
        this.score = score;
    }
    public int getScore() {
        return score;
    }
    public void setPercentage(int percentage) {
        this.percentage = percentage;
    }
    public int getPercentage() {
        return percentage;
    }
    public void setLevel(String level) {
        this.level = level;
    }
    public String getLevel() {
        return level;
    }
    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

}