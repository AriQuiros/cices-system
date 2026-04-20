package org.example.backend_cices_system.presentation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.GastoDTO;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.service.GastoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/gastos")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class GastoController {
    private final GastoService gastoService;

    @PostMapping("/registro")
    public ResponseEntity<?> registrarGasto (@RequestBody @Valid List<GastoDTO> listDto){
        var gastos = gastoService.guardarGasto(listDto);
        return ResponseEntity.ok(gastos.getLast().getId());
    }

    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizarGasto (@RequestBody @Valid GastoDTO dto, Authentication authentication){
        var usuario = (Usuario) authentication.getPrincipal();
        var gasto = gastoService.actualizarGasto(dto, usuario);
        return ResponseEntity.ok(gasto);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarGasto (@PathVariable Integer id,Authentication authentication){
        var usuario = (Usuario) authentication.getPrincipal();
        var gasto = gastoService.eliminarGasto(id, usuario);
        return ResponseEntity.ok(gasto);
    }

    @GetMapping("/obtener/{id}")
    public ResponseEntity<?> obtenerGasto (@PathVariable Integer id){
        var gasto = gastoService.obtenerGasto(id);
        var dto = gastoService.obtenerDTO(gasto);
        return ResponseEntity.ok(dto);
    }
}
