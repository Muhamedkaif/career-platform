package career_platform.Backend.entity;

import jakarta.persistence.*;

@Entity

public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String company;

    private String role;

    private String requiredSkills;

    private String description;
}