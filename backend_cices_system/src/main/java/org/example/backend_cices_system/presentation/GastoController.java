package org.example.backend_cices_system.presentation;

import jakarta.validation.Valid;
import org.example.backend_cices_system.dto.GastoDTO;
import org.example.backend_cices_system.service.GastoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gastos")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class GastoController {
    private final GastoService gastoService;

    public GastoController(GastoService gastoService) {
        this.gastoService = gastoService;
    }

    @PostMapping("/registro/{codigoProyecto}")
    public ResponseEntity<?> registrarGasto (@PathVariable String codigoProyecto,
                                             @RequestBody @Valid GastoDTO dto){
        var gasto = gastoService.guardarGasto(dto,codigoProyecto,dto.presupuesto().categoria());
        return ResponseEntity.ok(gasto.getId());
    }
}
