package org.example.backend_cices_system.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtil {
    @Value("${security.jwt.secret}") private String secret;
    @Value("${security.jwt.exp-hours}") private long expHours;

    public String generate(String subject, List<String> roles) {
        Algorithm alg = Algorithm.HMAC256(secret);
        Instant now = Instant.now();
        return JWT.create()
                .withSubject(subject)
                .withIssuedAt(Date.from(now))
                .withExpiresAt(Date.from(now.plus(expHours, ChronoUnit.HOURS)))
                .withClaim("roles", roles)
                .sign(alg);
    }

    public DecodedJWT verify(String token) {
        return JWT.require(Algorithm.HMAC256(secret)).build().verify(token);
    }
}
