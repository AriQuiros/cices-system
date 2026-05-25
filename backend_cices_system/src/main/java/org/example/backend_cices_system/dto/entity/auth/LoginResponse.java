package org.example.backend_cices_system.dto.entity.auth;

public record LoginResponse(String token, UserInfo user) { }
