package career_platform.Backend.dto;

public class DashboardDTO {

    private String email;
    private String name;
    private String message;

    public DashboardDTO(String email, String name, String message) {
        this.email = email;
        this.name = name;
        this.message = message;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getMessage() {
        return message;
    }
}