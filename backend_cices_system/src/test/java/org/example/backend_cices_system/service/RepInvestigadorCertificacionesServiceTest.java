package org.example.backend_cices_system.service;

import org.example.backend_cices_system.report.dao.RepInvestigadorCertificacionesRepository;
import org.example.backend_cices_system.report.dto.CertificacionFiltroDTO;
import org.example.backend_cices_system.report.dto.FormacionDTO;
import org.example.backend_cices_system.report.serviceVw.RepInvestigadorCertificacionesService;
import org.example.backend_cices_system.report.view.RepInvestigadorCertificaciones;
import org.example.backend_cices_system.reportes.builder.CertificacionesReportBuilder;
import org.example.backend_cices_system.reportes.service.DocumentService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RepInvestigadorCertificacionesServiceTest {

    @Mock
    private RepInvestigadorCertificacionesRepository repo;

    @Mock
    private DocumentService documentService;

    @Mock
    private CertificacionesReportBuilder certificacionesReportBuilder;

    @InjectMocks
    private RepInvestigadorCertificacionesService service;

    @Test
    void filtrarCertificacionesPaginado_debeMapearEntidadADTO() {
        CertificacionFiltroDTO filtro = new CertificacionFiltroDTO();
        filtro.setNombre("Ana");
        filtro.setOrdenFecha("asc");

        RepInvestigadorCertificaciones entidad = mock(RepInvestigadorCertificaciones.class);
        when(entidad.getIdentificacion()).thenReturn("111");
        when(entidad.getNombreInvestigador()).thenReturn("Ana Perez");
        when(entidad.getNombreCertificacion()).thenReturn("Licencia Investigador");
        when(entidad.getInstitucion()).thenReturn("UNA");
        when(entidad.getTipoCertificacion()).thenReturn("Licencia");
        when(entidad.getEstadoCertificacion()).thenReturn("Activa");
        when(entidad.getFechaExpiracion()).thenReturn(LocalDate.of(2026, 5, 10));

        Page<RepInvestigadorCertificaciones> page = new PageImpl<>(List.of(entidad));

        when(repo.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(page);

        Page<FormacionDTO> resultado = service.filtrarCertificacionesPaginado(filtro, 0, 10);

        assertEquals(1, resultado.getContent().size());
        FormacionDTO dto = resultado.getContent().get(0);

        assertEquals("111", dto.identificacionInvestigador());
        assertEquals("Ana Perez", dto.nombreInvestigador());
        assertEquals("Licencia Investigador", dto.nombre());
        assertEquals("UNA", dto.institucion());
        assertEquals("Licencia", dto.tipo());
        assertEquals("Activa", dto.estado());
        assertEquals(LocalDate.of(2026, 5, 10), dto.fecha());
    }

    @Test
    void filtrarCertificaciones_debeRetornarListaDTO() {
        CertificacionFiltroDTO filtro = new CertificacionFiltroDTO();
        filtro.setOrdenFecha("desc");

        RepInvestigadorCertificaciones entidad = mock(RepInvestigadorCertificaciones.class);
        when(entidad.getIdentificacion()).thenReturn("222");
        when(entidad.getNombreInvestigador()).thenReturn("Luis Mora");
        when(entidad.getNombreCertificacion()).thenReturn("Acreditación Científica");
        when(entidad.getInstitucion()).thenReturn("TEC");
        when(entidad.getTipoCertificacion()).thenReturn("Acreditación");
        when(entidad.getEstadoCertificacion()).thenReturn("Vencida");
        when(entidad.getFechaExpiracion()).thenReturn(LocalDate.of(2025, 8, 20));

        when(repo.findAll(any(Specification.class), any(Sort.class)))
                .thenReturn(List.of(entidad));

        List<FormacionDTO> resultado = service.filtrarCertificaciones(filtro);

        assertEquals(1, resultado.size());
        assertEquals("Luis Mora", resultado.get(0).nombreInvestigador());
        assertEquals("Acreditación Científica", resultado.get(0).nombre());
    }

    @Test
    void generarReporte_debeInvocarDocumentServiceConDatosFiltrados() {
        CertificacionFiltroDTO filtro = new CertificacionFiltroDTO();
        filtro.setOrdenFecha("asc");

        RepInvestigadorCertificaciones entidad = mock(RepInvestigadorCertificaciones.class);
        when(entidad.getIdentificacion()).thenReturn("111");
        when(entidad.getNombreInvestigador()).thenReturn("Ana Perez");
        when(entidad.getNombreCertificacion()).thenReturn("Licencia Investigador");
        when(entidad.getInstitucion()).thenReturn("UNA");
        when(entidad.getTipoCertificacion()).thenReturn("Licencia");
        when(entidad.getEstadoCertificacion()).thenReturn("Activa");
        when(entidad.getFechaExpiracion()).thenReturn(LocalDate.of(2026, 5, 10));

        when(repo.findAll(any(Specification.class), any(Sort.class)))
                .thenReturn(List.of(entidad));

        ResponseEntity<byte[]> expected = ResponseEntity.ok("archivo".getBytes());

        when(documentService.generarResponse(
                eq(certificacionesReportBuilder),
                anyList(),
                eq("pdf"),
                eq("reporte_certificaciones")
        )).thenReturn(expected);

        ResponseEntity<byte[]> response = service.generarReporte(filtro, "pdf");

        assertEquals(200, response.getStatusCode().value());
        assertArrayEquals("archivo".getBytes(), response.getBody());

        verify(documentService).generarResponse(
                eq(certificacionesReportBuilder),
                anyList(),
                eq("pdf"),
                eq("reporte_certificaciones")
        );
    }

    @Test
    void filtrarCertificacionesPaginado_debeConstruirPageableConOrdenAscendente() {
        CertificacionFiltroDTO filtro = new CertificacionFiltroDTO();
        filtro.setOrdenFecha("asc");

        when(repo.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(Page.empty());

        service.filtrarCertificacionesPaginado(filtro, 0, 12);

        ArgumentCaptor<Pageable> captor = ArgumentCaptor.forClass(Pageable.class);
        verify(repo).findAll(any(Specification.class), captor.capture());

        Pageable pageable = captor.getValue();
        Sort.Order order = pageable.getSort().getOrderFor("fechaExpiracion");

        assertNotNull(order);
        assertEquals(Sort.Direction.ASC, order.getDirection());
    }
}