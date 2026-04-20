package org.example.backend_cices_system.presentation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.InvestigadorDTO;
import org.example.backend_cices_system.logic.Investigador;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.service.InvestigadorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/investigadores")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class InvestigadorController {

    private final InvestigadorService investigadorService;

    @PostMapping("/registro")
    public ResponseEntity<?> crearInvestigador(@RequestBody @Valid InvestigadorDTO dto) {
        Investigador investigador =
                investigadorService.crearInvestigador(dto);
        return ResponseEntity.ok(investigador.getId());
    }

    @GetMapping
    public List<Map<String, String>> obtenerInvestigadorXNombre(@RequestParam String nombre) {
        return investigadorService.obtenerInvestigadoresActivos(nombre);
    }

    @GetMapping("/perfil")
    public ResponseEntity<?> perfil(Authentication authentication) {
        Usuario user = (Usuario) authentication.getPrincipal();
        var investigador = investigadorService.obtenerPerfil(user);
        return ResponseEntity.ok(investigador);
    }

    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizarInvestigador(@RequestBody @Valid InvestigadorDTO dto) {
        var inv = investigadorService.actualizarInvestigador(dto);

        return ResponseEntity.ok(inv.getIdEmpleado().getNombreCompleto());
    }
}
