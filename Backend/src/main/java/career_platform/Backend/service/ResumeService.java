package career_platform.Backend.service;

import career_platform.Backend.entity.student;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import career_platform.Backend.repositories.StudentRepository;

import java.util.Map;

@Service
public class ResumeService {

    private final Cloudinary cloudinary;
    private final StudentRepository studentRepository;

    public ResumeService(Cloudinary cloudinary , StudentRepository studentRepository) {
        this.cloudinary = cloudinary;
        this.studentRepository = studentRepository;
    }

    public String uploadResume(MultipartFile file , String email) throws Exception {

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "resumes/",   // ✅ folder name
                        "public_id", email + "_resume" ,
                        "resource_type", "raw",
                        "type", "upload"  // optional unique name
                )
        );


        String url = uploadResult.get("secure_url").toString();

        // 🔍 Find student
        student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 💾 Save URL
        student.setResumeUrl(url);
        studentRepository.save(student);

        return url;
    }
}