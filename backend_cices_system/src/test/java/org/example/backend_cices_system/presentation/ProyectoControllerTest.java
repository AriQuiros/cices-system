package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.dto.*;
import org.example.backend_cices_system.service.ProyectoService;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProyectoControllerTest {

    @Mock ProyectoService proyectoService;
    @InjectMocks ProyectoController controller;

    @Captor ArgumentCaptor<Pageable> pageableCaptor;
    @Captor ArgumentCaptor<Short> idCaptor;
    @Captor ArgumentCaptor<AsignacionReqDTO> reqCaptor;

    @Test
    void suggest_ok() {
        String q = "bio";
        int limit = 5;
        var esperado = List.of(
                new ProyectoMiniDTO((short)1, "P-001", "Proyecto A"),
                new ProyectoMiniDTO((short)2, "P-002", "Proyecto B")
        );
        when(proyectoService.suggest(eq(q), any(Pageable.class))).thenReturn(esperado);

        List<ProyectoMiniDTO> out = controller.suggest(q, limit);

        assertThat(out).hasSize(2);
        assertThat(out.get(0).id()).isEqualTo((short)1);
        assertThat(out.get(0).codigo()).isEqualTo("P-001");
        assertThat(out.get(0).nombre()).isEqualTo("Proyecto A");

        verify(proyectoService).suggest(eq(q), pageableCaptor.capture());
        assertThat(pageableCaptor.getValue()).isEqualTo(PageRequest.of(0, limit));
    }

    @Test
    void search_ok() {
        var dto = new ProyectoResumenDTO(
                (short)7, "P-007", "Proyecto X", "ACTIVO", "Biología",
                LocalDate.of(2025,1,1), LocalDate.of(2025,12,31),
                200, 3, 150
        );
        when(proyectoService.buscarResumen("x")).thenReturn(dto);

        ProyectoResumenDTO out = controller.search("x");

        assertThat(out.id()).isEqualTo((short)7);
        assertThat(out.codigo()).isEqualTo("P-007");
        assertThat(out.nombre()).isEqualTo("Proyecto X");
        assertThat(out.estado()).isEqualTo("ACTIVO");
        assertThat(out.linea()).isEqualTo("Biología");
        assertThat(out.horas_planificadas()).isEqualTo(200);
        assertThat(out.asignados_cnt()).isEqualTo(3);
        assertThat(out.horas_comprometidas()).isEqualTo(150);

        verify(proyectoService).buscarResumen("x");
    }

    @Test
    void listarAsignados_ok() {
        var lista = List.of(new AsignadoDTO(
                (short)3, "Ana Mora", "INVESTIGADOR",
                LocalDate.of(2025,1,1), LocalDate.of(2025,12,31),
                new BigDecimal("120.5"), "ACTIVO"
        ));
        when(proyectoService.listarAsignados(10, "")).thenReturn(lista);

        ResponseEntity<List<AsignadoDTO>> resp = controller.listarAsignados(10, "");

        assertThat(resp.getStatusCodeValue()).isEqualTo(200);
        assertThat(resp.getBody()).hasSize(1);
        var a0 = resp.getBody().get(0);
        assertThat(a0.id()).isEqualTo((short)3);
        assertThat(a0.nombre()).isEqualTo("Ana Mora");
        assertThat(a0.rol()).isEqualTo("INVESTIGADOR");
        assertThat(a0.estado()).isEqualTo("ACTIVO");

        verify(proyectoService).listarAsignados(10, "");
    }

    @Test
    void crearAsignacion_204() {
        var req = new AsignacionReqDTO(
                (short)3,       // investigadorId
                (short)2,       // rolProyectoId
                40,             // horasMes
                6,              // meses
                LocalDate.of(2025, 1, 1),
                LocalDate.of(2025, 6, 30)
        );

        ResponseEntity<Void> resp = controller.crearAsignacion(9, req);

        assertThat(resp.getStatusCodeValue()).isEqualTo(204);

        verify(proyectoService).agregarAsignacion(idCaptor.capture(), reqCaptor.capture());
        assertThat(idCaptor.getValue()).isEqualTo((short)9);

        var captured = reqCaptor.getValue();
        assertThat(captured.investigadorId()).isEqualTo((short)3);
        assertThat(captured.rolProyectoId()).isEqualTo((short)2);
        assertThat(captured.horasMes()).isEqualTo(40);
        assertThat(captured.meses()).isEqualTo(6);
        assertThat(captured.ini()).isEqualTo(LocalDate.of(2025, 1, 1));
        assertThat(captured.fin()).isEqualTo(LocalDate.of(2025, 6, 30));
    }

    @Test
    void eliminarAsignacion_204() {
        ResponseEntity<Void> resp = controller.eliminarAsignacion(9, (short)3);

        assertThat(resp.getStatusCodeValue()).isEqualTo(204);
        verify(proyectoService).quitarAsignacion((short)9, (short)3);
    }
}
