package com.uade.tpo.demo.controllers.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;

@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, AuthenticationProvider authenticationProvider) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf
                    .ignoringRequestMatchers("/h2-console/**")
                    .ignoringRequestMatchers("/api/v1/auth/**")) // Disable CSRF for auth endpoints
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .headers(headers -> headers.frameOptions().disable()) // Disable for H2 console
                .authorizeHttpRequests(req -> req
                        .requestMatchers("/h2-console/**").permitAll() // Allow H2 console
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/test/**").permitAll() // Allow test endpoints
                        .requestMatchers("/error/**").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/categories").hasAuthority("ADMIN")
                        .requestMatchers("/categories/getAll").permitAll()
                        .requestMatchers(HttpMethod.GET, "/categories/{categoryId}").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/categories/{categoryId}").hasAuthority("ADMIN")
                        .requestMatchers("/categories/update/{categoryId}").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/carts/{userId}").hasAuthority("USER")
                        .requestMatchers(HttpMethod.POST, "/carts/**").hasAuthority("USER")
                        .requestMatchers(HttpMethod.PUT, "/carts/**").hasAuthority("USER")
                        .requestMatchers(HttpMethod.DELETE, "/carts/**").hasAuthority("USER")
                        .requestMatchers(HttpMethod.GET, "/carts").hasAuthority("ADMIN")
                        .requestMatchers("/products/**").permitAll()
                        .requestMatchers("/bills/**").authenticated()
                        .requestMatchers("/orders/**").authenticated()
                        .requestMatchers("/users/**").authenticated()
                        .requestMatchers("/users").hasRole("ADMIN")
                        .requestMatchers("/users/{userId}").hasRole("ADMIN"))

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider) // Keep custom provider
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider(UserDetailsService userDetailsService) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoderDAP());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoderDAP() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4002", "http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "Origin"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
