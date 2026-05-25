package org.example.backend_cices_system.controller.entity;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.service.entity.CertificacionService;
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