package com.uade.tpo.demo.service.interfaces;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.uade.tpo.demo.entity.User;

import java.util.Optional;

public interface UserService {
    Page<User> getAllUsers(PageRequest pageRequest);
    
    Optional<User> getUserById(Long id);
    
    Optional<User> getUserByEmail(String email); // New method

    void deleteUser(Long id);

    User updateUser(Long id, User updatedUser);
}
