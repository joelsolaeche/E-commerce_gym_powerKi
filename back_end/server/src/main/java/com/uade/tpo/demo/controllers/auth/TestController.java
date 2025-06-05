package com.uade.tpo.demo.controllers.auth;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = {"http://localhost:4002", "http://localhost:5173"})
public class TestController {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/db-status")
    public ResponseEntity<Map<String, Object>> testDatabaseConnection() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Test database connection
            String dbStatus = jdbcTemplate.queryForObject("SELECT 'Connection successful'", String.class);
            response.put("dbConnection", dbStatus);
            
            // Check table existence
            List<Map<String, Object>> tables = jdbcTemplate.queryForList(
                "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='PUBLIC'"
            );
            response.put("tables", tables);
            
            // Count users
            long userCount = userRepository.count();
            response.put("userCount", userCount);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/roles")
    public ResponseEntity<Map<String, Object>> testRoles() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // List all possible role values
            response.put("validRoles", java.util.Arrays.asList(com.uade.tpo.demo.entity.Role.values()));
            
            // Test parsing a role
            try {
                com.uade.tpo.demo.entity.Role userRole = com.uade.tpo.demo.entity.Role.valueOf("USER");
                response.put("userRoleTest", userRole.name());
            } catch (Exception e) {
                response.put("userRoleError", e.getMessage());
            }
            
            try {
                com.uade.tpo.demo.entity.Role adminRole = com.uade.tpo.demo.entity.Role.valueOf("ADMIN");
                response.put("adminRoleTest", adminRole.name());
            } catch (Exception e) {
                response.put("adminRoleError", e.getMessage());
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(response);
        }
    }
} 