package com.uade.tpo.demo.controllers.auth;

import java.time.LocalDate;

import com.uade.tpo.demo.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private LocalDate fechaNacimiento;
    private boolean membresiaActiva;
    private Role role;
}
