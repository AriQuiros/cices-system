package org.example.backend_cices_system.service;

import org.example.backend_cices_system.dto.InvestigadorProyectoDTO;
import org.example.backend_cices_system.report.dao.RepInvestigadorProyectoRepository;
import org.example.backend_cices_system.report.serviceVw.RepInvestigadorProyectoService;
import org.example.backend_cices_system.report.view.RepInvestigadorProyecto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RepInvestigadorProyectoServiceTest {

    @Mock
    private RepInvestigadorProyectoRepository repo;

    @InjectMocks
    private RepInvestigadorProyectoService service;

    @Test
    void buscarPorCodigoProyecto_debeMapearParticipantesADTO() {
        String codigoProyecto = "PROY-001";

        RepInvestigadorProyecto participante = new RepInvestigadorProyecto();
        participante.setIdInvestigadorProyecto(10);
        participante.setIdInvestigador(200);
        participante.setIdentificacion("123456789");
        participante.setNombreInvestigador("Derby Muñoz");
        participante.setGradoAcademico("Licenciatura");
        participante.setCodigoProyecto(codigoProyecto);
        participante.setIdRolProyecto((short) 3);
        participante.setRolProyecto("Colaborador");
        participante.setActividadProyecto("Análisis de datos");
        participante.setFechaInicioInvestigador(LocalDate.of(2025, 1, 10));
        participante.setFechaFinInvestigador(LocalDate.of(2025, 12, 10));

        when(repo.findByCodigoProyecto(codigoProyecto)).thenReturn(List.of(participante));

        List<InvestigadorProyectoDTO> resultado = service.buscarPorCodigoProyecto(codigoProyecto);

        assertNotNull(resultado);
        assertEquals(1, resultado.size());

        InvestigadorProyectoDTO dto = resultado.get(0);
        assertEquals(10, dto.id());
        assertEquals("123456789", dto.identificacionInvestigador());
        assertEquals("Derby Muñoz", dto.nombreInvestigador());
        assertEquals("Licenciatura", dto.gradoAcademico());
        assertEquals("PROY-001", dto.codigoProyecto());
        assertNotNull(dto.rolProyecto());
        assertEquals((short) 3, dto.rolProyecto().id());
        assertEquals("Colaborador", dto.rolProyecto().nombreRolProyecto());
        assertEquals("Análisis de datos", dto.actividadProyecto());
        assertEquals(LocalDate.of(2025, 1, 10), dto.fechaInicio());
        assertEquals(LocalDate.of(2025, 12, 10), dto.fechaFin());

        verify(repo).findByCodigoProyecto(codigoProyecto);
    }
}