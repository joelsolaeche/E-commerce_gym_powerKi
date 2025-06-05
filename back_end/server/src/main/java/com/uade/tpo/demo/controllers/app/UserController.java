package com.uade.tpo.demo.controllers.app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.service.interfaces.UserService;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        Page<User> usersPage = (page == null || size == null) ?
                userService.getAllUsers(PageRequest.of(0, Integer.MAX_VALUE)) :
                userService.getAllUsers(PageRequest.of(page, size));
        return ResponseEntity.ok(usersPage);
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        Optional<User> result = userService.getUserById(userId);
        return result.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody User userRequest) {
        User updatedUser = userService.updateUser(userId, userRequest);
        return ResponseEntity.ok(updatedUser);
    }
    

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<User> getLoggedInUser(Authentication authentication) {
        String loggedInEmail = authentication.getName();  
        Optional<User> result = userService.getUserByEmail(loggedInEmail);

        return result.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.noContent().build());
    }
}
