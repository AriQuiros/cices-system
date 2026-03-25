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

    public TituloController(TituloService tituloService) {
        this.tituloService = tituloService;
    }

    @DeleteMapping("/eliminar/{idTitulo}")
    public ResponseEntity<?> eliminarTitulo(@PathVariable Integer idTitulo){
        var titulo = tituloService.eliminarTitulo(idTitulo);
        return ResponseEntity.ok(titulo.nombreTitulo());
    }
}