package com.votelive.backend.controller;

import com.votelive.backend.dto.LoginRequest;
import com.votelive.backend.dto.LoginResponse;
import com.votelive.backend.dto.RegisterRequest;
import com.votelive.backend.entity.User;
import com.votelive.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        try {

            User user = userService.register(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message", "User registered successfully",
                            "userId", user.getId(),
                            "name", user.getName(),
                            "email", user.getEmail(),
                            "role", user.getRole()
                    ));

        } catch (RuntimeException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "error", exception.getMessage()
                    ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {

            LoginResponse response = userService.login(
                    request.getEmail(),
                    request.getPassword()
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "error", exception.getMessage()
                    ));
        }
    }
}