package org.example.backend_cices_system.presentation;

import jakarta.validation.Valid;
import org.example.backend_cices_system.dto.CertificacionDTO;
import org.example.backend_cices_system.logic.Certificacion;
import org.example.backend_cices_system.logic.Investigador;
import org.example.backend_cices_system.service.CertificacionService;
import org.example.backend_cices_system.service.InvestigadorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/investigadores/{idInvestigador}/certificaciones")
public class CertificacionController {

    private final CertificacionService certificacionService;
    private final InvestigadorService investigadorService;

    public CertificacionController(CertificacionService certificacionService,
                                   InvestigadorService investigadorService) {
        this.certificacionService = certificacionService;
        this.investigadorService = investigadorService;
    }

    @PostMapping
    public ResponseEntity<?> agregarCertificacion(
            @PathVariable String identificacion,
            @RequestBody @Valid CertificacionDTO dto) {

        Investigador investigador = investigadorService.buscarPorIdentificacion(identificacion);
        Certificacion certificacion = certificacionService.guardarCertificacion(dto, investigador);

        return ResponseEntity.ok(certificacion.getId());
    }
}