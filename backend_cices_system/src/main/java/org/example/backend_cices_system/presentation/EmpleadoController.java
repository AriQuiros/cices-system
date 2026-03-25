package org.example.backend_cices_system.presentation;

import jakarta.validation.Valid;
import org.example.backend_cices_system.dto.EmpleadoDTO;
import org.example.backend_cices_system.logic.Empleado;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.service.EmpleadoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/empleados")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    public EmpleadoController(EmpleadoService empleadoService) {
        this.empleadoService = empleadoService;
    }

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
