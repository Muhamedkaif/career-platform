package career_platform.Backend.configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "deiaaohvw",
                "api_key", "856732721197393",
                "api_secret", "XZkN1tvJQC86U0_3AbjsLF4NXds"
        ));
    }
}