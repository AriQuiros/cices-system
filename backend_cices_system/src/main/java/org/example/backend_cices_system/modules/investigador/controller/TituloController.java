package org.example.backend_cices_system.modules.investigador.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.investigador.service.TituloService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/titulos")
public class TituloController {

    private final TituloService tituloService;

    @DeleteMapping("/eliminar/{idTitulo}")
    public ResponseEntity<?> eliminarTitulo(@PathVariable Integer idTitulo){
        var titulo = tituloService.eliminarTitulo(idTitulo);
        return ResponseEntity.ok(titulo.nombreTitulo());
    }
}