package career_platform.Backend.service;

import career_platform.Backend.entity.student;
import career_platform.Backend.repositories.StudentRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Map;

@Service
public class ResumeService {

    private final Cloudinary cloudinary;
    private final StudentRepository studentRepository;

    public ResumeService(Cloudinary cloudinary, StudentRepository studentRepository) {
        this.cloudinary = cloudinary;
        this.studentRepository = studentRepository;
    }

    public String uploadResume(MultipartFile file, String email) throws Exception {
        String safePublicId = email.replaceAll("[^a-zA-Z0-9_-]", "_") + "_resume";

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "resumes/",
                        "public_id", safePublicId,
                        "resource_type", "raw",
                        "type", "upload",
                        "access_mode", "public",
                        "overwrite", true
                )
        );

        String url = uploadResult.get("url").toString();

        student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        student.setResumeUrl(url);
        studentRepository.save(student);

        return url;
    }

    public ResponseEntity<InputStreamResource> getResume(String email) {
        student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String fileUrl = student.getResumeUrl();

        if (fileUrl == null || fileUrl.isBlank()) {
            throw new RuntimeException("Resume not found");
        }

        try {
            InputStream inputStream = new URL(normalizeResumeUrl(fileUrl)).openStream();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=resume")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new InputStreamResource(inputStream));

        } catch (Exception e) {
            throw new RuntimeException("Error fetching resume file", e);
        }
    }

    public File downloadResumeFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) {
            throw new RuntimeException("Resume not found");
        }

        try (InputStream inputStream = new URL(normalizeResumeUrl(fileUrl)).openStream()) {
            File tempFile = File.createTempFile("resume", ".pdf");
            Files.copy(inputStream, tempFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
            return tempFile;
        } catch (Exception e) {
            throw new RuntimeException("Error downloading resume file", e);
        }
    }

    private String normalizeResumeUrl(String fileUrl) {
        if (fileUrl.contains("/image/upload/") && fileUrl.toLowerCase().contains(".pdf")) {
            return fileUrl.replace("/image/upload/", "/raw/upload/");
        }

        return fileUrl;
    }
}
