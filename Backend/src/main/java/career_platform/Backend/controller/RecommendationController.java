package career_platform.Backend.controller;


import career_platform.Backend.entity.job;
import career_platform.Backend.service.RecommendationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/{studentId}")
    public List<job> getRecommendations(@PathVariable Long studentId) {
        return recommendationService.recommendJobs(studentId);
    }
}