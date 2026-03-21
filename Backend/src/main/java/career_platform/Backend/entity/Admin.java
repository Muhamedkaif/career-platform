package career_platform.Backend.entity;

import jakarta.persistence.*;
import org.jspecify.annotations.Nullable;

@Entity
@Table(name="Admin")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;

    public void setPassword(@Nullable String encode) {
        this.password = encode;
    }
    public String getPassword() {
        return password;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getName() {
        return name;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getEmail() {
        return email;
    }
    // getters & setters
}