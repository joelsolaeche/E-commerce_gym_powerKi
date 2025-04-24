package com.uade.tpo.demo.entity;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public User updateProfile(User userData) {
        User currentUser = getCurrentUser();

        currentUser.setFirstName(userData.getFirstName());
        currentUser.setLastName(userData.getLastName());
        currentUser.setFechaNacimiento(userData.getFechaNacimiento());
        currentUser.setMembresiaActiva(userData.isMembresiaActiva());

        return userRepository.save(currentUser);
    }
}
