package career_platform.Backend.dto;

public class SkillResponse {
    private String subject;
    private int A;

    public SkillResponse(String subject, int A) {
        this.subject = subject;
        this.A = A;
    }

    public String getSubject() { return subject; }
    public int getA() { return A; }
}