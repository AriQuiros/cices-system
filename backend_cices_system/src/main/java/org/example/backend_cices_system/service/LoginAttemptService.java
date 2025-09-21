package org.example.backend_cices_system.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
@Component
public class LoginAttemptService {
    private final int max;
    private final Duration block;
    private final ConcurrentHashMap<String, Attempt> attempts = new ConcurrentHashMap<>();

    public LoginAttemptService(
            @Value("${security.login.max-attempts}") int max,
            @Value("${security.login.block-minutes}") long blockMinutes) {
        this.max = max;
        this.block = Duration.ofMinutes(blockMinutes);
    }

    public boolean isBlocked(String key) {
        var a = attempts.get(key);
        if (a == null) return false;
        if (Instant.now().isAfter(a.first.plus(block))) { attempts.remove(key); return false; }
        return a.count >= max;
    }

    public int onFailure(String key) {
        var a = attempts.compute(key, (k, v) ->
                v == null || Instant.now().isAfter(v.first.plus(block))
                        ? new Attempt(1, Instant.now())
                        : new Attempt(v.count + 1, v.first));
        return Math.max(0, max - a.count);
    }

    public void onSuccess(String key) { attempts.remove(key); }

    public int remaining(String key) {
        var a = attempts.get(key);
        if (a == null) return max;
        if (Instant.now().isAfter(a.first.plus(block))) return max;
        return Math.max(0, max - a.count);
    }

    public long blockMinutesRemaining(String key) {
        var a = attempts.get(key);
        if (a == null) return 0;
        long elapsed = Duration.between(a.first, Instant.now()).toMinutes();
        return Math.max(0, block.toMinutes() - elapsed);
    }

    private record Attempt(int count, Instant first) {}
}
