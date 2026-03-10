package career_platform.Backend.repositories;

import career_platform.Backend.entity.job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<job, Long> {
}