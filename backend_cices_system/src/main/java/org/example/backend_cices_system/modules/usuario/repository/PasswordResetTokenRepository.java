package org.example.backend_cices_system.modules.usuario.repository;

import org.example.backend_cices_system.modules.usuario.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Integer> {

    Optional<PasswordResetToken> findByTokenHash(String tokenHash);

}
