package org.example.backend_cices_system.modules.usuario.dto;

import java.util.List;

public record UserInfo(Integer id, String username, String nombreCompleto, List<String> roles) { }

