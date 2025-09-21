package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.dto.DirectorResumenDTO;
import org.example.backend_cices_system.service.DirectorService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/director")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class DirectorController {

    private final DirectorService service;
    public DirectorController(DirectorService service) { this.service = service; }

    @GetMapping("/resumen")
    public DirectorResumenDTO resumen(@RequestParam(defaultValue = "30") int dias) {
        return service.get(dias);
    }
}
