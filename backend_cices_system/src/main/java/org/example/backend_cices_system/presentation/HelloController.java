package org.example.backend_cices_system.presentation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HelloController {
    @GetMapping(value = "/hello", produces = "application/json")
    public Map<String,String> hello() {
        return Map.of("msg","hola desde backend");
    }
}
