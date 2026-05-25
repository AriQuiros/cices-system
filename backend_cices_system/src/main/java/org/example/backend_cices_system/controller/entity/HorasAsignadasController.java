package org.example.backend_cices_system.controller.entity;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.entity.HorasAsignadasDTO;
import org.example.backend_cices_system.service.entity.HorasAsignadasService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/horas-asignadas")
public class HorasAsignadasController {
    private final HorasAsignadasService horasAsignadasService;

    @PostMapping("/registro")
    public ResponseEntity<?> registrarHora (@RequestBody @Valid List<HorasAsignadasDTO> listDto){
        var Canthoras = horasAsignadasService.guardarHorasAsignadas(listDto);
        return ResponseEntity.ok(Canthoras);
    }

    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizarHora (@RequestBody @Valid HorasAsignadasDTO dto){
        var hora = horasAsignadasService.actualizarHora(dto);
        return ResponseEntity.ok(hora);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarHora (@PathVariable Integer id) {
        var invHora = horasAsignadasService.eliminarHora(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/obtener/{id}")
    public ResponseEntity<?> obtenerHora (@PathVariable Integer id){
        var hora = horasAsignadasService.obtenerHoraAsignada(id);
        var dto = horasAsignadasService.obtenerHoraAsignadaDTO(hora);
        return ResponseEntity.ok(dto);
    }
}
