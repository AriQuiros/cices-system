package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.dto.CertificacionDTO;
import org.example.backend_cices_system.logic.Investigador;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.service.CertificacionService;
import org.example.backend_cices_system.service.InvestigadorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.same;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CertificacionControllerTest {

    @Mock
    private CertificacionService certificacionService;

    @Mock
    private InvestigadorService investigadorService;

    @InjectMocks
    private CertificacionController certificacionController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Debe retornar las certificaciones del investigador autenticado")
    void debeRetornarCertificacionesDelInvestigadorAutenticado() {
        Usuario usuario = new Usuario();
        Investigador investigador = new Investigador();

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(usuario, null, List.of());

        CertificacionDTO dto1 = new CertificacionDTO(
                1,
                null,
                "Licencia de Operación Institucional",
                null,
                LocalDate.of(2026, 4, 15),
                null
        );

        CertificacionDTO dto2 = new CertificacionDTO(
                2,
                null,
                "Acreditación de Conservación Técnica",
                null,
                LocalDate.of(2025, 12, 1),
                null
        );

        when(investigadorService.obtenerInvestigadorPorUsuario(same(usuario))).thenReturn(investigador);
        when(certificacionService.certificacionDTOList(same(investigador))).thenReturn(List.of(dto1, dto2));

        ResponseEntity<?> response = certificacionController.certificacionesInvestigador(authentication);

        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());

        @SuppressWarnings("unchecked")
        List<CertificacionDTO> resultado = (List<CertificacionDTO>) response.getBody();

        assertEquals(2, resultado.size());
        assertEquals("Licencia de Operación Institucional", resultado.get(0).nombreCertificacion());
        assertEquals(LocalDate.of(2026, 4, 15), resultado.get(0).fechaExpiracion());
        assertEquals("Acreditación de Conservación Técnica", resultado.get(1).nombreCertificacion());
        assertEquals(LocalDate.of(2025, 12, 1), resultado.get(1).fechaExpiracion());

        verify(investigadorService).obtenerInvestigadorPorUsuario(same(usuario));
        verify(certificacionService).certificacionDTOList(same(investigador));
    }

    @Test
    @DisplayName("Debe retornar lista vacía cuando el investigador no tiene certificaciones")
    void debeRetornarListaVaciaCuandoNoTieneCertificaciones() {
        Usuario usuario = new Usuario();
        Investigador investigador = new Investigador();

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(usuario, null, List.of());

        when(investigadorService.obtenerInvestigadorPorUsuario(same(usuario))).thenReturn(investigador);
        when(certificacionService.certificacionDTOList(same(investigador))).thenReturn(List.of());

        ResponseEntity<?> response = certificacionController.certificacionesInvestigador(authentication);

        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());

        @SuppressWarnings("unchecked")
        List<CertificacionDTO> resultado = (List<CertificacionDTO>) response.getBody();

        assertTrue(resultado.isEmpty());

        verify(investigadorService).obtenerInvestigadorPorUsuario(same(usuario));
        verify(certificacionService).certificacionDTOList(same(investigador));
    }
}