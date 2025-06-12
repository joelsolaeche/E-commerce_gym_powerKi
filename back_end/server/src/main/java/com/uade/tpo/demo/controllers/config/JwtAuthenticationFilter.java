package com.uade.tpo.demo.controllers.config;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    
    private static final Logger logger = Logger.getLogger(JwtAuthenticationFilter.class.getName());

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        
        final String requestURI = request.getRequestURI();
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        
        if (authHeader == null || !authHeader.startsWith("Bearer")) {
            logger.fine("No Authorization header found or not starting with Bearer for URI: " + requestURI);
            filterChain.doFilter(request, response);
            return;
        }
        
        logger.info("Processing JWT token for URI: " + requestURI);
        jwt = authHeader.substring(7);
        
        try {
            userEmail = jwtService.extractUsername(jwt);
            
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                logger.info("Found email in token: " + userEmail + " for URI: " + requestURI);
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                
                logger.info("User details loaded, authorities: " + userDetails.getAuthorities());
                
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    logger.info("Token is valid for user: " + userEmail);
                    
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    logger.info("Setting authentication in SecurityContext with authorities: " + userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    logger.warning("Token is invalid for user: " + userEmail);
                }
            } else {
                logger.fine("No user email found in token or authentication already exists for URI: " + requestURI);
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error processing JWT token", e);
        }

        filterChain.doFilter(request, response);
    }
}
