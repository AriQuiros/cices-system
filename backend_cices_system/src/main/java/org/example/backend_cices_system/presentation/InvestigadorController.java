package org.example.backend_cices_system.presentation;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.backend_cices_system.dto.RegistroInvestigadorDTO;
import org.example.backend_cices_system.service.InvestigadorService;

@RestController
@RequestMapping("/api/investigadores")
@RequiredArgsConstructor
public class InvestigadorController {
    private final InvestigadorService service;

    @PostMapping
    public ResponseEntity<Map<String,Object>> crear(@RequestBody RegistroInvestigadorDTO body) {
        Short idInv = service.registrarInvestigadorConCerts(body);
        return ResponseEntity.ok(Map.of("idInvestigador", idInv));
    }
}