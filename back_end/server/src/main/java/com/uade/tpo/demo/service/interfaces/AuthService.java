package com.uade.tpo.demo.service.interfaces;

import com.uade.tpo.demo.controllers.auth.AuthRequest;
import com.uade.tpo.demo.controllers.auth.AuthResponse;
import com.uade.tpo.demo.controllers.auth.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse authenticate(AuthRequest request);

}
