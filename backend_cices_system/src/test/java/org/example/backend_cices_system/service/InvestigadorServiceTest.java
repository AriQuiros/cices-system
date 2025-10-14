package org.example.backend_cices_system.service;

import jakarta.persistence.EntityManager;
import org.example.backend_cices_system.data.InvestigadorProyectoRepository;
import org.example.backend_cices_system.data.InvestigadorRepository;
import org.example.backend_cices_system.data.ProyectoRepository;
import org.example.backend_cices_system.data.UsuarioRepository;
import org.example.backend_cices_system.dto.InvestigadorDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.List;

@ExtendWith(MockitoExtension.class)
class InvestigadorServiceTest {

    @Mock
    EntityManager em;
    @Mock
    UsuarioRepository usuarioRepo;
    @Mock InvestigadorRepository invRepo;              // el que usa el método
    @Mock
    InvestigadorProyectoRepository invProyRepo;
    @Mock
    ProyectoRepository proyectoRepo;

    InvestigadorService service;

    @BeforeEach
    void setUp() {
        service = new InvestigadorService(
                em, usuarioRepo, invRepo, invProyRepo, proyectoRepo
        );
    }

    @Test
    void textoValido_llamaRepoConTexto() {
        String q = "bio";
        var esperado = List.of(new InvestigadorDTO((short)1,"Ana","Unidad"));
        when(invRepo.buscarInvestigadores(q)).thenReturn(esperado);

        var r = service.buscarInvestigadores(q);

        verify(invRepo).buscarInvestigadores(q);
        assertEquals(1, r.size());
        assertEquals("Ana", r.get(0).nombre());
    }

    @Test
    void null_llamaRepoConNull() {
        when(invRepo.buscarInvestigadores(null)).thenReturn(List.of());

        var r = service.buscarInvestigadores(null);

        verify(invRepo).buscarInvestigadores(null);
        assertTrue(r.isEmpty());
    }

    @Test
    void blanco_llamaRepoConNull() {
        when(invRepo.buscarInvestigadores(null)).thenReturn(List.of());

        var r = service.buscarInvestigadores("   ");

        verify(invRepo).buscarInvestigadores(null);
        assertTrue(r.isEmpty());
    }
}
