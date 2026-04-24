package org.example.backend_cices_system.modules.investigador.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.investigador.service.CertificacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/certificaciones")
public class CertificacionController {

    private final CertificacionService certificacionService;

    @DeleteMapping("/eliminar/{idCertificacion}")
    public ResponseEntity<?> eliminarCertificacion(@PathVariable Integer idCertificacion){
        var certificacion = certificacionService.eliminarCertificacion(idCertificacion);
        return ResponseEntity.ok(certificacion.nombreCertificacion());
    }

}