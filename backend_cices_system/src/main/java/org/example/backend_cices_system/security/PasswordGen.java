package org.example.backend_cices_system.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGen {
    public static void main(String[] args) {
        String raw = "Prueba2025!";
        String hash = new BCryptPasswordEncoder().encode(raw);
        System.out.println(hash);
    }
}
