package career_platform.Backend.repositories;

import career_platform.Backend.entity.Skill;
import career_platform.Backend.entity.StudentSkill;
import career_platform.Backend.entity.student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentSkillRepository extends JpaRepository<StudentSkill, Long> {

    List<StudentSkill> findByStudentId(Long studentId);

    Optional<StudentSkill> findByStudentAndSkill(student student, Skill skill);
}