package org.example.backend_cices_system.dto;

import java.util.List;

public record UserInfo(Short id, String username, String nombreCompleto, List<String> roles) {}
