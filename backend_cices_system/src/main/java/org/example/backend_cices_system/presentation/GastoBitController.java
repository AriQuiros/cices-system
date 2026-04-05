package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.service.audit.GastoBitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gasto-bit")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class GastoBitController {
    private final GastoBitService gastoBitService;

    public GastoBitController(GastoBitService gastoBitService) {
        this.gastoBitService = gastoBitService;
    }

    @GetMapping("/gasto/{idGasto}")
    public ResponseEntity<?> obtenerBitacoraGasto(@PathVariable Integer idGasto){
        var cambiosGasto = gastoBitService.obtenerUpdatesBitacoraGasto(idGasto);
        return ResponseEntity.ok(cambiosGasto);
    }
}
