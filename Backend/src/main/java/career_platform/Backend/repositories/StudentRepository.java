package career_platform.Backend.repositories;

import career_platform.Backend.entity.student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<student, Long> {
    Optional<student> findByEmail(String email);
}