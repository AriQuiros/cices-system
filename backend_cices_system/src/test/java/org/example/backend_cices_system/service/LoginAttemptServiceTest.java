package org.example.backend_cices_system.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LoginAttemptServiceTest {

    @Test
    void noDeberiaEstarBloqueadoInicialmente() {
        LoginAttemptService service = new LoginAttemptService(3, 5);

        assertFalse(service.isBlocked("juan"));
        assertEquals(3, service.remaining("juan"));
    }

    @Test
    void onFailure_deberiaReducirIntentosRestantes() {
        LoginAttemptService service = new LoginAttemptService(3, 5);

        int restantes1 = service.onFailure("juan");
        int restantes2 = service.onFailure("juan");

        assertEquals(2, restantes1);
        assertEquals(1, restantes2);
        assertEquals(1, service.remaining("juan"));
    }

    @Test
    void deberiaBloquearDespuesDeMaximosIntentos() {
        LoginAttemptService service = new LoginAttemptService(3, 5);

        service.onFailure("juan");
        service.onFailure("juan");
        service.onFailure("juan");

        assertTrue(service.isBlocked("juan"));
        assertEquals(0, service.remaining("juan"));
    }

    @Test
    void onSuccess_deberiaLimpiarIntentos() {
        LoginAttemptService service = new LoginAttemptService(3, 5);

        service.onFailure("juan");
        service.onFailure("juan");
        service.onSuccess("juan");

        assertFalse(service.isBlocked("juan"));
        assertEquals(3, service.remaining("juan"));
    }

    @Test
    void blockMinutesRemaining_deberiaSerMayorOIgualACero() {
        LoginAttemptService service = new LoginAttemptService(3, 5);

        service.onFailure("juan");

        long remaining = service.blockMinutesRemaining("juan");

        assertTrue(remaining >= 0);
    }
}