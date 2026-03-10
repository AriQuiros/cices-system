package org.example.backend_cices_system.presentation;

import jakarta.validation.Valid;
import org.example.backend_cices_system.dto.GastoDTO;
import org.example.backend_cices_system.service.GastoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gastos")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class GastoController {
    private final GastoService gastoService;

    public GastoController(GastoService gastoService) {
        this.gastoService = gastoService;
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrarGasto (@RequestBody @Valid List<GastoDTO> listDto){
        var gastos = gastoService.guardarGasto(listDto);
        return ResponseEntity.ok(gastos.getLast().getId());
    }

    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizarGasto (@RequestBody @Valid GastoDTO dto){
        var gasto = gastoService.actualizarGasto(dto);
        return ResponseEntity.ok(gasto);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarGasto (@PathVariable Integer id){
        var gasto = gastoService.eliminarGasto(id);
        return ResponseEntity.ok(gasto);
    }
}
