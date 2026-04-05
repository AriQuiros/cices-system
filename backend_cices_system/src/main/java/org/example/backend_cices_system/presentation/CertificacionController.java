package org.example.backend_cices_system.presentation;

import jakarta.validation.Valid;
import org.example.backend_cices_system.dto.CertificacionDTO;
import org.example.backend_cices_system.logic.Certificacion;
import org.example.backend_cices_system.logic.Investigador;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.service.CertificacionService;
import org.example.backend_cices_system.service.InvestigadorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificaciones")
public class CertificacionController {

    private final CertificacionService certificacionService;
    private final InvestigadorService investigadorService;

    public CertificacionController(CertificacionService certificacionService,
                                   InvestigadorService investigadorService) {
        this.certificacionService = certificacionService;
        this.investigadorService = investigadorService;
    }

    @GetMapping("/investigador")
    public ResponseEntity<?> certificacionesInvestigador(Authentication authentication){
        var user = (Usuario) authentication.getPrincipal();
        var investigador = investigadorService.obtenerInvestigadorPorUsuario(user);
        var certificaciones = certificacionService.certificacionDTOList(investigador);
        return ResponseEntity.ok(certificaciones);
    }

    @DeleteMapping("/eliminar/{idCertificacion}")
    public ResponseEntity<?> eliminarCertificacion(@PathVariable Integer idCertificacion){
        var certificacion = certificacionService.eliminarCertificacion(idCertificacion);
        return ResponseEntity.ok(certificacion.nombreCertificacion());
    }

}