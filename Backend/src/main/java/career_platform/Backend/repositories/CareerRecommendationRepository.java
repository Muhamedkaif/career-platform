package career_platform.Backend.repositories;

import career_platform.Backend.entity.CareerRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CareerRecommendationRepository
        extends JpaRepository<CareerRecommendation, Long> {
}