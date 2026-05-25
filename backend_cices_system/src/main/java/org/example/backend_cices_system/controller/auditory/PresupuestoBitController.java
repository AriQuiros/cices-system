package org.example.backend_cices_system.controller.auditory;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.service.auditory.PresupuestoBitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/presupuesto-bit")
public class PresupuestoBitController {

    private final PresupuestoBitService presupuestoBitService;

    @GetMapping("/presupuesto/{idPresupuesto}")
    public ResponseEntity<?> obtenerBitacora(@PathVariable Integer idPresupuesto){
        var cambios = presupuestoBitService.obtenerUpdatesBitacora(idPresupuesto);
        return ResponseEntity.ok(cambios);
    }
}
