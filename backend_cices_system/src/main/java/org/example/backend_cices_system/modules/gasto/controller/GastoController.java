package org.example.backend_cices_system.modules.gasto.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.gasto.dto.GastoDTO;
import org.example.backend_cices_system.modules.usuario.model.Usuario;
import org.example.backend_cices_system.modules.gasto.service.GastoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/gastos")
public class GastoController {
    private final GastoService gastoService;

    @PostMapping("/registro")
    public ResponseEntity<?> registrarGasto (@RequestBody @Valid List<GastoDTO> listDto){
        var gastos = gastoService.guardarGasto(listDto);
        return ResponseEntity.ok((Map.of(
                "message", "Gastos registrados"
        )));
    }

    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizarGasto (@RequestBody @Valid GastoDTO dto, Authentication authentication){
        var usuario = (Usuario) authentication.getPrincipal();
        var gasto = gastoService.actualizarGasto(dto, usuario);
        return ResponseEntity.ok((Map.of(
                "message", "Gasto actualizado"
        )));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarGasto (@PathVariable Integer id,Authentication authentication){
        var usuario = (Usuario) authentication.getPrincipal();
        var gasto = gastoService.eliminarGasto(id, usuario);
        return ResponseEntity.ok((Map.of(
                "message", "Gasto eliminado"
        )));
    }

    @GetMapping("/obtener/{id}")
    public ResponseEntity<?> obtenerGasto (@PathVariable Integer id){
        var gasto = gastoService.obtenerGasto(id);
        var dto = gastoService.obtenerDTO(gasto);
        return ResponseEntity.ok(dto);
    }
}
