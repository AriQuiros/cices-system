package org.example.backend_cices_system.report.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.report.filter.CertificacionFiltroDTO;
import org.example.backend_cices_system.report.serviceVw.RepInvestigadorCertificacionesService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/consulta/certificaciones")
@RequiredArgsConstructor
public class RepInvestigadorCertificacionesController {

    private final RepInvestigadorCertificacionesService service;

    @PostMapping("/filtrar")
    public ResponseEntity<?> filtrar(@RequestBody CertificacionFiltroDTO filtro,
                                     @RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(service.filtrarCertificacionesPaginado(filtro, page, size));
    }

    @GetMapping("/investigador")
    public ResponseEntity<?> misCertificaciones(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        Usuario usuario = (Usuario) authentication.getPrincipal();

        String identificacion = service.obtenerIdentificacionPorUsuario(usuario.getId());

        CertificacionFiltroDTO filtro = new CertificacionFiltroDTO(
                identificacion,
                null,
                null,
                null,
                "desc"
        );

        return ResponseEntity.ok(
                service.filtrarCertificacionesPaginado(filtro, page, size)
        );
    }
}
