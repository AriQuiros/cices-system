package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.data.InvestigadorProyectoRepository;
import org.example.backend_cices_system.data.InvestigadorRepository;
import org.example.backend_cices_system.data.ProyectoRepository;
import org.example.backend_cices_system.data.UsuarioRepository;
import org.example.backend_cices_system.dto.ProyectoDTO;
import org.example.backend_cices_system.logic.Empleado;
import org.example.backend_cices_system.logic.Investigador;
import org.example.backend_cices_system.logic.Proyecto;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.service.InvestigadorService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ProyectoInvestigadorServiceTest {
    @Mock UsuarioRepository usuarioRepo;
    @Mock InvestigadorRepository invRepo;
    @Mock InvestigadorProyectoRepository invProyRepo;
    @Mock ProyectoRepository proyectoRepo;

    @InjectMocks InvestigadorService service; // donde vive misProyectos(String)

    private Usuario usuarioConEmpleado() {
        var u = new Usuario();
        var e = new Empleado(); e.setId((short)1);
        u.setIdEmpleado(e);
        u.setNombreUsuario("invest1");
        return u;
    }

    private Investigador investigador() {
        var inv = new Investigador(); inv.setId((short)10);
        return inv;
    }

    private Proyecto proyecto(String codigo, String nombre, String linea) {
        var p = new Proyecto();
        p.setId((short)11);
        p.setCodigoProyecto(codigo);
        p.setNombreProyecto(nombre);
        p.setLineaInvestigacion(linea);
        p.setFechaInicio(LocalDate.now().minusDays(10));
        p.setFechaFinalizacion(LocalDate.now().plusDays(10));
        return p;
    }

    @Test
    void misProyectos_ok_mapeaDTOs() {
        when(usuarioRepo.findActiveByUsername("alice")).thenReturn(Optional.of(usuarioConEmpleado()));
        when(invRepo.findByIdEmpleado(any())).thenReturn(Optional.of(investigador()));
        when(invProyRepo.findProyectoIdsVigentesByInvestigador(any())).thenReturn(List.of((short)11));
        when(proyectoRepo.findAllById(List.of((short)11))).thenReturn(List.of(proyecto("P-001","Proyecto A","IA")));

        List<ProyectoDTO> out = service.misProyectos("alice");

        assertEquals(1, out.size());
        assertEquals("P-001", out.get(0).getCodigo());
        assertEquals("Proyecto A", out.get(0).getNombre());
        assertEquals("IA", out.get(0).getLineaInvestigacion());
    }

    @Test
    void misProyectos_sinProyectos_retornaVacio() {
        when(usuarioRepo.findActiveByUsername("bob")).thenReturn(Optional.of(usuarioConEmpleado()));
        when(invRepo.findByIdEmpleado(any())).thenReturn(Optional.of(investigador()));
        when(invProyRepo.findProyectoIdsVigentesByInvestigador(any())).thenReturn(List.of());

        var out = service.misProyectos("bob");

        assertTrue(out.isEmpty());
    }

    @Test
    void misProyectos_usuarioNoActivo_lanzaMensajeEsperado() {
        when(usuarioRepo.findActiveByUsername("x")).thenReturn(Optional.empty());

        var ex = assertThrows(RuntimeException.class, () -> service.misProyectos("x"));
        assertEquals("Usuario no activo", ex.getMessage());
    }

    @Test
    void misProyectos_noEsInvestigador_lanzaMensajeEsperado() {
        when(usuarioRepo.findActiveByUsername("y")).thenReturn(Optional.of(usuarioConEmpleado()));
        when(invRepo.findByIdEmpleado(any())).thenReturn(Optional.empty());

        // Si tu servicio mantiene el catch genérico, este test fallará porque se envuelve el mensaje.
        // Para que pase, deja pasar RuntimeException conocidas (como "No es investigador").
        var ex = assertThrows(RuntimeException.class, () -> service.misProyectos("y"));
        assertEquals("No es investigador", ex.getMessage());
    }
}
