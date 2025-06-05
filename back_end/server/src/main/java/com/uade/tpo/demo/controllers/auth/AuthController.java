package com.uade.tpo.demo.controllers.auth;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.service.interfaces.AuthService;

import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4002", "http://localhost:5173"})
public class AuthController {

    private final AuthService service;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            AuthResponse authResponse = service.register(request);
            return ResponseEntity.ok(authResponse);
        } catch (DataIntegrityViolationException e) {
            // Handle duplicate email
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("El correo electrónico ya está registrado.");
        } catch (RuntimeException e) {
            // Check if it's an email already exists exception
            if (e.getMessage() != null && e.getMessage().contains("Email already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("El correo electrónico ya está registrado.");
            }
            // Handle other runtime exceptions
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Error al registrar el usuario: " + e.getMessage());
        } catch (Exception e) {
            // Log the error
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al registrar el usuario: " + e.getMessage());
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthResponse> authenticate(
            @RequestBody AuthRequest request) {

        return ResponseEntity.ok(service.authenticate(request));
    }
}
