package org.example.backend_cices_system.controller.entity;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.entity.InvestigadorDTO;
import org.example.backend_cices_system.model.entity.Investigador;
import org.example.backend_cices_system.model.entity.Usuario;
import org.example.backend_cices_system.service.entity.InvestigadorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/investigadores")
public class InvestigadorController {

    private final InvestigadorService investigadorService;

    @PostMapping("/registro")
    public ResponseEntity<?> crearInvestigador(@RequestBody InvestigadorDTO dto) {
        Investigador investigador =
                investigadorService.crearInvestigador(dto);
        return ResponseEntity.ok(investigador.getId());
    }

    @GetMapping
    public List<Map<String, String>> obtenerInvestigadorXNombre(
            @RequestParam(required = false) String nombre
            ) {
        return investigadorService.obtenerInvestigadoresActivos(nombre);
    }

    @GetMapping("/perfil")
    public ResponseEntity<?> perfil(Authentication authentication) {
        Usuario user = (Usuario) authentication.getPrincipal();
        var investigador = investigadorService.obtenerPerfil(user);
        return ResponseEntity.ok(investigador);
    }

    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizarInvestigador(@RequestBody InvestigadorDTO dto) {
        var inv = investigadorService.actualizarInvestigador(dto);

        return ResponseEntity.ok(inv.getIdEmpleado().getNombreCompleto());
    }
}
