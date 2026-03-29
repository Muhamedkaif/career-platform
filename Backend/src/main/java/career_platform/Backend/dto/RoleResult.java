package career_platform.Backend.dto;


import java.util.List;

public class RoleResult {

    private String role;
    private int score;
    private List<String> missing_skills;
    private String explanation;
    private List<String> recommended_courses;

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public List<String> getMissing_skills() { return missing_skills; }
    public void setMissing_skills(List<String> missing_skills) { this.missing_skills = missing_skills; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public List<String> getRecommended_courses() { return recommended_courses; }
    public void setRecommended_courses(List<String> recommended_courses) { this.recommended_courses = recommended_courses; }
}