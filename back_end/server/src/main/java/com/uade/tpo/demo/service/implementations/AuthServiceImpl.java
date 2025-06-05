package com.uade.tpo.demo.service.implementations;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.controllers.auth.AuthRequest;
import com.uade.tpo.demo.controllers.auth.AuthResponse;
import com.uade.tpo.demo.controllers.auth.RegisterRequest;
import com.uade.tpo.demo.controllers.config.JwtService;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.exceptions.InvalidCredentialsException;
import com.uade.tpo.demo.exceptions.UserNotFoundException;
import com.uade.tpo.demo.repository.UserRepository;
import com.uade.tpo.demo.service.interfaces.AuthService;
import com.uade.tpo.demo.service.interfaces.CartService;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CartService cartService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        try {
            System.out.println("Received registration request for email: " + request.getEmail());
            
            // Check if email already exists
            if (repository.findByEmail(request.getEmail()).isPresent()) {
                System.out.println("Email already exists: " + request.getEmail());
                throw new RuntimeException("Email already exists");
            }
            
            System.out.println("Creating user entity");
        var user = User.builder()
                .firstName(request.getFirstname())
                .lastName(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

            System.out.println("Saving user to database");
        User savedUser = repository.save(user);
            System.out.println("User saved with ID: " + savedUser.getId());

            // Try to create a cart for the user, but don't fail if it doesn't work
            try {
                System.out.println("Creating cart for user: " + savedUser.getId());
        cartService.createCart(savedUser.getId());
                System.out.println("Cart created successfully");
            } catch (Exception e) {
                // Log the error but continue with registration
                System.err.println("Error creating cart for user: " + e.getMessage());
                e.printStackTrace();
            }

            System.out.println("Generating JWT token");
        var jwtToken = jwtService.generateToken(savedUser);
            System.out.println("Token generated");

            System.out.println("Registration completed successfully");
        return AuthResponse.builder()
                .accessToken(jwtToken)
                .userId(savedUser.getId())
                .role(savedUser.getRole().name())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                // .cartId(cart.getId()) 
                .build();
        } catch (Exception e) {
            // Log the complete error
            System.err.println("Error during registration: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw to let the controller handle it
        }
    }

    @Override
    public AuthResponse authenticate(AuthRequest request) {
        User user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        // Long cartId = user.getCart().getId();

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .accessToken(token)
                .userId(user.getId())
                .role(user.getRole().name())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                // .cartId(cartId)
                .build();
    }
}
