package org.example.backend_cices_system.service.shared;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {
    private final Dotenv dotenv;
    private final RestTemplate restTemplate = new RestTemplate();

    public EmailService(Dotenv dotenv) {
        this.dotenv = dotenv;
    }

    public void enviarCorreoReset(String destino, String link) {

        String apiKey = dotenv.get("BREVO_API_KEY");
        String senderEmail = dotenv.get("BREVO_SENDER_EMAIL");
        String senderName = dotenv.get("BREVO_SENDER_NAME");

        String url = "https://api.brevo.com/v3/smtp/email";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);

        Map<String, Object> body = new HashMap<>();

        // Remitente
        Map<String, String> sender = new HashMap<>();
        sender.put("email", senderEmail);
        sender.put("name", senderName);

        // Destinatario
        List<Map<String, String>> to = new ArrayList<>();
        Map<String, String> destinatario = new HashMap<>();
        destinatario.put("email", destino);
        to.add(destinatario);

        // Contenido HTML
        String html = generarHtml(link);

        body.put("sender", sender);
        body.put("to", to);
        body.put("subject", "Recuperación de contraseña - Sistema CICES");
        body.put("htmlContent", html);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            restTemplate.postForEntity(url, request, String.class);
            System.out.println("Correo enviado correctamente a: " + destino);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error enviando correo con Brevo");
        }
    }

    private String generarHtml(String link) {
        return """
            <html>
            <body>
                <h2>Recuperación de contraseña</h2>
                <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="%s">Restablecer contraseña</a>
                <p>Este enlace expira en 20 minutos.</p>
            </body>
            </html>
            """.formatted(link);
    }
}