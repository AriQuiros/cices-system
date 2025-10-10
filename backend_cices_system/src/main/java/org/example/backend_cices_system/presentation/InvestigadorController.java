package org.example.backend_cices_system.presentation;

import java.util.Map;
import java.util.List;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.example.backend_cices_system.dto.RegistroInvestigadorDTO;
import org.example.backend_cices_system.dto.ProyectoDTO;
import org.example.backend_cices_system.dto.PresupuestoDTO;
import org.example.backend_cices_system.dto.GastoDTO;
import org.example.backend_cices_system.service.InvestigadorService;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/investigador")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class InvestigadorController {
    private final InvestigadorService service;

    @PostMapping("/registrar")
    public ResponseEntity<Map<String,Object>> crear(@RequestBody RegistroInvestigadorDTO body) {
        Short idInv = service.registrarInvestigadorConCerts(body);
        return ResponseEntity.ok(Map.of("idInvestigador", idInv));
    }

    @GetMapping("/proyectos-principal")
    public ResponseEntity<List<ProyectoDTO>> getProyectosInvestigadorPrincipal(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        
        String nombreUsuario = auth.getName();
        List<ProyectoDTO> proyectos = service.getProyectosInvestigadorPrincipal(nombreUsuario);
        return ResponseEntity.ok(proyectos);
    }

    @GetMapping("/presupuesto/{idProyecto}")
    public ResponseEntity<PresupuestoDTO> getPresupuestoProyecto(@PathVariable Integer idProyecto, Authentication auth) {
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        
        PresupuestoDTO presupuesto = service.getPresupuestoProyecto(idProyecto);
        if (presupuesto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(presupuesto);
    }

    @PostMapping("/validar-gasto")
    public ResponseEntity<Map<String, Object>> validarMontoGasto(
            @RequestBody Map<String, Object> request, Authentication auth) {
        try {
            if (auth == null || auth.getName() == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Usuario no autenticado"));
            }
            
            Integer idProyecto = (Integer) request.get("idProyecto");
            BigDecimal monto = new BigDecimal(request.get("monto").toString());
            
            boolean esValido = service.validarMontoGasto(idProyecto, monto);
            PresupuestoDTO presupuesto = service.getPresupuestoProyecto(idProyecto);
            
            Map<String, Object> response = Map.of(
                "valido", esValido,
                "montoTotal", presupuesto != null ? presupuesto.getMonto() : 0,
                "gastosRealizados", presupuesto != null ? presupuesto.getGastosRealizados() : 0,
                "montoDisponible", presupuesto != null ? presupuesto.getMontoDisponible() : 0,
                "mensaje", esValido ? "Monto válido" : "El monto excede el presupuesto disponible"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Error al validar el monto: " + e.getMessage()));
        }
    }

    @PostMapping("/registrar-gasto")
    public ResponseEntity<Map<String, Object>> registrarGasto(@RequestBody GastoDTO gastoDTO, Authentication auth) {
        try {
            if (auth == null || auth.getName() == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "exito", false,
                    "mensaje", "Usuario no autenticado"
                ));
            }
            
            boolean exito = service.registrarGasto(gastoDTO);
            
            if (exito) {
                return ResponseEntity.ok(Map.of(
                    "exito", true,
                    "mensaje", "Gasto registrado exitosamente"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "exito", false,
                    "mensaje", "No se pudo registrar el gasto. Verifique que el monto no exceda el presupuesto disponible."
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "exito", false,
                "mensaje", "Error interno del servidor: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/fecha-actual")
    public ResponseEntity<Map<String, String>> getFechaActual(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        
        LocalDate fechaActual = LocalDate.now();
        String fechaFormateada = fechaActual.toString(); // Formato YYYY-MM-DD
        
        return ResponseEntity.ok(Map.of("fecha", fechaFormateada));
    }
}