package career_platform.Backend.service;

import career_platform.Backend.entity.Skill;
import career_platform.Backend.entity.StudentSkill;
import career_platform.Backend.entity.student;
import career_platform.Backend.repositories.SkillRepository;
import career_platform.Backend.repositories.StudentRepository;
import career_platform.Backend.repositories.StudentSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
public class StudentSkillService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private StudentSkillRepository studentSkillRepository;

    public void saveOrUpdateSkills(Long studentId, Map<String, Integer> extractedSkills) {

        student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        for (Map.Entry<String, Integer> entry : extractedSkills.entrySet()) {

            String skillName = entry.getKey();
            int score = entry.getValue();

            // 1️⃣ Get or create skill
            Skill skill = skillRepository.findByName(skillName)
                    .orElseGet(() -> skillRepository.save(new Skill(skillName, "general")));

            // 2️⃣ Check if already exists
            Optional<StudentSkill> existing = studentSkillRepository
                    .findByStudentAndSkill(student, skill);

            if (existing.isPresent()) {
                // 🔄 UPDATE
                StudentSkill ss = existing.get();
                ss.setScore(score);
                ss.setPercentage(score);
                ss.setLastUpdated(LocalDateTime.now());
                studentSkillRepository.save(ss);
            } else {
                // ➕ INSERT
                StudentSkill newSkill = new StudentSkill();
                newSkill.setStudent(student);
                newSkill.setSkill(skill);
                newSkill.setScore(score);
                newSkill.setPercentage(score);
                newSkill.setLevel("intermediate");
                newSkill.setLastUpdated(LocalDateTime.now());

                studentSkillRepository.save(newSkill);
            }
        }
    }
}