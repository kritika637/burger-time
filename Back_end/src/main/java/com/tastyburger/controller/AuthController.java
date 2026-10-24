package com.tastyburger.controller;

import com.tastyburger.dto.request.LoginRequest;
import com.tastyburger.dto.request.RegisterRequest;
import com.tastyburger.dto.response.ApiResponse;
import com.tastyburger.dto.response.AuthResponse;
import com.tastyburger.dto.response.UserResponse;
import com.tastyburger.entity.User;
import com.tastyburger.repository.UserRepository;
import com.tastyburger.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email already registered"));
        }
        User user = new User(request.getName(), request.getEmail(),
                passwordEncoder.encode(request.getPassword()), request.getPhone());
        userRepository.save(user);
        String token = tokenProvider.generateToken(user.getEmail());
        UserResponse userResponse = new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getPhone());
        return ResponseEntity.ok(new ApiResponse<>(true, "Registration successful", new AuthResponse(true, token, userResponse)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new org.springframework.security.authentication.BadCredentialsException("Invalid credentials"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new org.springframework.security.authentication.BadCredentialsException("Invalid credentials");
        }
        String token = tokenProvider.generateToken(user.getEmail());
        UserResponse userResponse = new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getPhone());
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", new AuthResponse(true, token, userResponse)));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Logged out successfully", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserResponse userResponse = new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getPhone());
        return ResponseEntity.ok(ApiResponse.ok(userResponse));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@RequestBody java.util.Map<String, String> body) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (body.containsKey("name")) user.setName(body.get("name"));
        if (body.containsKey("phone")) user.setPhone(body.get("phone"));
        userRepository.save(user);
        UserResponse userResponse = new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getPhone());
        return ResponseEntity.ok(ApiResponse.ok("Profile updated", userResponse));
    }
}
