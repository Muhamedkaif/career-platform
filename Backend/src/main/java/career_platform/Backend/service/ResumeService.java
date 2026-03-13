package career_platform.Backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class ResumeService {

    private final Cloudinary cloudinary;

    public ResumeService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadResume(MultipartFile file) throws Exception {

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.emptyMap()
        );

        return uploadResult.get("url").toString();
    }
}