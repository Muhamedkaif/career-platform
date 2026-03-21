package career_platform.Backend.controller;

import career_platform.Backend.Util.JwtUtil;
import career_platform.Backend.entity.Admin;
import career_platform.Backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ Register
    @PostMapping("/register")
    public Admin register(@RequestBody Admin admin) {
        return adminService.register(admin);
    }

    // ✅ Login
    @PostMapping("/login")
    public String login(@RequestBody Admin admin) {
        Admin loggedInAdmin = adminService.login(admin.getEmail(), admin.getPassword());

        return jwtUtil.generateToken(loggedInAdmin.getEmail());
    }
}