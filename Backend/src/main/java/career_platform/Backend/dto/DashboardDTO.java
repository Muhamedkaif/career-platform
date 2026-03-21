package career_platform.Backend.dto;

public class DashboardDTO {

    private String email;
    private String name;
    private String message;
    private String dept;

    public DashboardDTO(String email,String dept, String name, String message) {
        this.email = email;
        this.name = name;
        this.message = message;
        this.dept = dept;
    }

    public String getEmail() {
        return email;
    }
    public String getDept() {
        return dept;
    }

    public String getName() {
        return name;
    }

    public String getMessage() {
        return message;
    }
}