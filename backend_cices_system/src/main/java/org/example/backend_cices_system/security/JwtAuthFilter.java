package org.example.backend_cices_system.security;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.backend_cices_system.dto.UsuarioDTO;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.service.UsuarioService;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtUtil jwt;
    private final UsuarioService usuarioService;

    public JwtAuthFilter(JwtUtil jwt, UsuarioService usuarioService) {
        this.jwt = jwt;
        this.usuarioService = usuarioService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            chain.doFilter(req, res); // dejar pasar el preflight
            return;
        }
        String h = req.getHeader(HttpHeaders.AUTHORIZATION);
        if (h != null && h.startsWith("Bearer ")) {
            String token = h.substring(7);
            try {
                DecodedJWT djwt = jwt.verify(token);
                String username = djwt.getSubject();
                Usuario usuario = usuarioService.obtenerPorNombreUsuario(username);
                List<String> roles = djwt.getClaim("roles").asList(String.class);

                List<SimpleGrantedAuthority> auths = roles.stream()
                        .filter(Objects::nonNull)
                        .map(r -> new SimpleGrantedAuthority("ROLE_" + r.toUpperCase()))
                        .toList();

                Authentication auth = new UsernamePasswordAuthenticationToken(usuario, null, auths);
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (JWTVerificationException ignored) { }
        }
        chain.doFilter(req, res);
    }
}
