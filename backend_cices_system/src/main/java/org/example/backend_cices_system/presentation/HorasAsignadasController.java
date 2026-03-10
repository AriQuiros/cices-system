package org.example.backend_cices_system.presentation;

import jakarta.validation.Valid;
import org.example.backend_cices_system.dto.HorasAsignadasDTO;
import org.example.backend_cices_system.service.HorasAsignadasService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/horas")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class HorasAsignadasController {
    private final HorasAsignadasService horasAsignadasService;

    public HorasAsignadasController(HorasAsignadasService horasAsignadasService) {
        this.horasAsignadasService = horasAsignadasService;
    }

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
}
