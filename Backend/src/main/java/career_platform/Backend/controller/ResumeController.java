package career_platform.Backend.controller;

import career_platform.Backend.service.ResumeService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/resume")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/upload")
    public String uploadResume(@RequestParam("file") MultipartFile file) throws Exception {

        return resumeService.uploadResume(file);
    }
}