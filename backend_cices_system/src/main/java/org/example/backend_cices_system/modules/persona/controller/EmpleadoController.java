package org.example.backend_cices_system.modules.persona.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.persona.dto.EmpleadoDTO;
import org.example.backend_cices_system.modules.persona.model.Empleado;
import org.example.backend_cices_system.modules.usuario.model.Usuario;
import org.example.backend_cices_system.modules.persona.service.EmpleadoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/empleados")
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    @PostMapping("/registro")
    public ResponseEntity<?> crearEmpleado(@RequestBody @Valid EmpleadoDTO dto) {
        Empleado empleado = empleadoService.crearEmpleado(dto);
        return ResponseEntity.ok(empleado.getId());
    }

    @GetMapping("/perfil")
    public ResponseEntity<?> perfil(Authentication authentication) {
        Usuario user = (Usuario) authentication.getPrincipal();
        var empleado = empleadoService.obtenerPerfil(user);
        return ResponseEntity.ok(empleado);
    }

    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizarEmpleado(@RequestBody @Valid EmpleadoDTO dto) {
        var empleado = empleadoService.actualizarEmpleado(dto);

        return ResponseEntity.ok(empleado.getNombreCompleto());
    }
}
