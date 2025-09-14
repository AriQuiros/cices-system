package org.example.backend_cices_system.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGen {
    public static void main(String[] args) {
        String raw = "admin123";
        String hash = new BCryptPasswordEncoder().encode(raw);
        System.out.println(hash);
    }
}
