package com.capstone.apeer.Controller;

import com.capstone.apeer.Model.User;
import com.capstone.apeer.Repository.UserRepository;

import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
    String email = body.get("email").trim();
    String password = body.get("password").trim();

    Optional<User> userOpt = userRepository.findByEmail(email)
            .filter(u -> u.getPassword().trim().equals(password));

    if (userOpt.isPresent()) {
        return ResponseEntity.ok(userOpt.get()); // 200 OK
    } else {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid email or password")); // 401
    }
}
     @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        String name = body.get("name").trim();
        String email = body.get("email").trim();
        String password = body.get("password").trim();

        // Check if email exists
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email already exists"));
        }

        // Create user with role = student automatically
        User newUser = new User();
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setPassword(password); // consider hashing
        newUser.setRole(User.Role.student); // automatically student

        userRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }
    
}