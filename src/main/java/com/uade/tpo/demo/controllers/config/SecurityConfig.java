package com.uade.tpo.demo.controllers.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;
        

        
        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(AbstractHttpConfigurer::disable)
                                .authorizeHttpRequests(req -> req
                                                .requestMatchers("/api/v1/auth/**", "/error/**").permitAll() // Público
                                                .requestMatchers(HttpMethod.GET, "/categories/**", "/api/products/**").permitAll() // GET es público
                                                .requestMatchers(HttpMethod.POST, "/categories").hasRole("ADMIN")
                                                .requestMatchers("/api/v1/auth/users/**").hasRole("ADMIN") // Solo ADMIN
                                                .requestMatchers("/api/cart/**", "/api/orders/**").hasRole("USER") // Solo USER
                                                .anyRequest().authenticated()) // Cualquier otra ruta requiere autenticación
                                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}
