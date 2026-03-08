package org.example.backend_cices_system.presentation;

import jakarta.validation.Valid;
import org.example.backend_cices_system.dto.TituloDTO;
import org.example.backend_cices_system.logic.Investigador;
import org.example.backend_cices_system.logic.Titulo;
import org.example.backend_cices_system.service.InvestigadorService;
import org.example.backend_cices_system.service.TituloService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/investigadores/{idInvestigador}/titulos")
public class TituloController {

    private final TituloService tituloService;
    private final InvestigadorService investigadorService;

    public TituloController(TituloService tituloService,
                            InvestigadorService investigadorService) {
        this.tituloService = tituloService;
        this.investigadorService = investigadorService;
    }

    @PostMapping
    public ResponseEntity<?> agregarTitulo(
            @PathVariable String identificacion,
            @RequestBody @Valid TituloDTO dto) {

        Investigador investigador = investigadorService.buscarXIdentificacion(identificacion);
        Titulo titulo = tituloService.guardarTitulo(dto, investigador);

        return ResponseEntity.ok(titulo.getId());
    }
}