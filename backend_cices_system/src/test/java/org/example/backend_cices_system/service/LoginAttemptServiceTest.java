package org.example.backend_cices_system.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class LoginAttemptServiceTest {

    @Test
    void failureUntilBlockedAndSuccessResets() {
        // max=3 intentos, bloqueo=1 minuto
        LoginAttemptService svc = new LoginAttemptService(3, 1);

        // inicialmente no bloqueado
        assertFalse(svc.isBlocked("u"));
        assertEquals(3, svc.remaining("u"));

        // primer fallo
        int rem1 = svc.onFailure("u");
        assertEquals(2, rem1);
        assertFalse(svc.isBlocked("u"));

        // segundo fallo
        int rem2 = svc.onFailure("u");
        assertEquals(1, rem2);
        assertFalse(svc.isBlocked("u"));

        // tercer fallo → bloqueado
        int rem3 = svc.onFailure("u");
        assertEquals(0, rem3);
        assertTrue(svc.isBlocked("u"));

        // aún bloqueado, remaining = 0
        assertEquals(0, svc.remaining("u"));
        assertTrue(svc.blockMinutesRemaining("u") > 0);

        // éxito limpia el estado
        svc.onSuccess("u");
        assertFalse(svc.isBlocked("u"));
        assertEquals(3, svc.remaining("u"));
        assertEquals(0, svc.blockMinutesRemaining("u"));
    }

    @Test
    void negativeOrExpiredBlockRemovesEntry() throws Exception {
        LoginAttemptService svc = new LoginAttemptService(1, 0);

        svc.onFailure("u");                // count=1 en t0
        Thread.sleep(2);                   // garantizamos now > t0

        assertFalse(svc.isBlocked("u"));   // ya expiró, debe limpiar y no bloquear
        assertEquals(1, svc.remaining("u"));
    }

}
