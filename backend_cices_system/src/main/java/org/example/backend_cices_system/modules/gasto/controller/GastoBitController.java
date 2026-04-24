package org.example.backend_cices_system.modules.gasto.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.gasto.service.GastoBitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/gasto-bit")
public class GastoBitController {
    private final GastoBitService gastoBitService;

    @GetMapping("/gasto/{idGasto}")
    public ResponseEntity<?> obtenerBitacoraGasto(@PathVariable Integer idGasto){
        var cambiosGasto = gastoBitService.obtenerUpdatesBitacoraGasto(idGasto);
        return ResponseEntity.ok(cambiosGasto);
    }
}
