package org.example.backend_cices_system.presentation;

import jakarta.validation.Valid;
import org.example.backend_cices_system.dto.EmpleadoDTO;
import org.example.backend_cices_system.logic.Empleado;
import org.example.backend_cices_system.service.EmpleadoService;
import org.springframework.http.ResponseEntity;
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

    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizarEmpleado(@RequestBody @Valid EmpleadoDTO dto) {

        Empleado empleado = empleadoService.actualizarEmpleado(dto);

        return ResponseEntity.ok(empleadoService.obtenerEmpleadoDTO(empleado));
    }
}
