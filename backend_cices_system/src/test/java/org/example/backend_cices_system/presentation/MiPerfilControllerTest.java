package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.dto.CertificacionDTO;
import org.example.backend_cices_system.dto.EmpleadoDTO;
import org.example.backend_cices_system.dto.InvestigadorDTO;
import org.example.backend_cices_system.logic.Investigador;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.service.CertificacionService;
import org.example.backend_cices_system.service.EmpleadoService;
import org.example.backend_cices_system.service.InvestigadorService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("Pruebas de Controller - Módulo Mi Perfil")
@ExtendWith(MockitoExtension.class)
class MiPerfilControllerTest {

    @Mock
    private EmpleadoService empleadoService;

    @Mock
    private InvestigadorService investigadorService;

    @Mock
    private CertificacionService certificacionService;

    @Mock
    private Authentication authentication;

    @Nested
    @DisplayName("HU-035 - Visualizar perfil del personal administrativo, asistente y director")
    class HU035 {

        @Test
        @DisplayName("GET /api/empleados/perfil debe retornar el perfil del empleado")
        void perfilEmpleado_debeRetornarOkConDatosDelEmpleado() {
            Usuario usuario = new Usuario();
            usuario.setNombreUsuario("admin@ucr.ac.cr");

            EmpleadoDTO empleadoDTO = new EmpleadoDTO(
                    1,
                    "Ana Mora",
                    "11223344",
                    null,
                    "CR",
                    "ana.mora@ucr.ac.cr",
                    "+50688887777",
                    null,
                    null
            );

            when(authentication.getPrincipal()).thenReturn(usuario);
            when(empleadoService.obtenerPerfil(usuario)).thenReturn(empleadoDTO);

            EmpleadoController controller = new EmpleadoController(empleadoService);

            ResponseEntity<?> response = controller.perfil(authentication);

            assertEquals(200, response.getStatusCode().value());
            assertEquals(empleadoDTO, response.getBody());

            verify(empleadoService, times(1)).obtenerPerfil(usuario);
        }
    }

    @Nested
    @DisplayName("HU-036 - Visualizar perfil de investigadores")
    class HU036 {

        @Test
        @DisplayName("GET /api/investigadores/perfil debe retornar el perfil del investigador")
        void perfilInvestigador_debeRetornarOkConDatosDelInvestigador() {
            Usuario usuario = new Usuario();
            usuario.setNombreUsuario("investigador@ucr.ac.cr");

            InvestigadorDTO investigadorDTO = new InvestigadorDTO(
                    10,
                    null,
                    null,
                    null,
                    "Cuidado de enfermería",
                    List.of(),
                    List.of()
            );

            when(authentication.getPrincipal()).thenReturn(usuario);
            when(investigadorService.obtenerPerfil(usuario)).thenReturn(investigadorDTO);

            InvestigadorController controller = new InvestigadorController(investigadorService);

            ResponseEntity<?> response = controller.perfil(authentication);

            assertEquals(200, response.getStatusCode().value());
            assertEquals(investigadorDTO, response.getBody());

            verify(investigadorService, times(1)).obtenerPerfil(usuario);
        }

        @Test
        @DisplayName("GET /api/certificaciones/investigador debe retornar las certificaciones del investigador")
        void certificacionesInvestigador_debeRetornarListaCertificaciones() {
            Usuario usuario = new Usuario();
            usuario.setNombreUsuario("investigador@ucr.ac.cr");

            Investigador investigador = new Investigador();
            investigador.setId(10);

            CertificacionDTO certificacionDTO = new CertificacionDTO(
                    5,
                    null,
                    "Licencia profesional",
                    null,
                    LocalDate.now().plusMonths(6),
                    null
            );

            when(authentication.getPrincipal()).thenReturn(usuario);
            when(investigadorService.obtenerInvestigadorPorUsuario(usuario))
                    .thenReturn(investigador);
            when(certificacionService.certificacionDTOList(investigador))
                    .thenReturn(List.of(certificacionDTO));

            CertificacionController controller = new CertificacionController(
                    certificacionService,
                    investigadorService
            );

            ResponseEntity<?> response = controller.certificacionesInvestigador(authentication);

            assertEquals(200, response.getStatusCode().value());
            assertEquals(List.of(certificacionDTO), response.getBody());

            verify(investigadorService, times(1)).obtenerInvestigadorPorUsuario(usuario);
            verify(certificacionService, times(1)).certificacionDTOList(investigador);
        }
    }

    @Nested
    @DisplayName("HU-041 - Eliminar acreditación o licencia personal")
    class HU041 {

        @Test
        @DisplayName("DELETE /api/certificaciones/eliminar/{id} debe eliminar una certificación")
        void eliminarCertificacion_debeRetornarNombreCertificacionEliminada() {
            CertificacionDTO certificacionDTO = new CertificacionDTO(
                    5,
                    null,
                    "Licencia profesional",
                    null,
                    LocalDate.now().plusMonths(6),
                    null
            );

            when(certificacionService.eliminarCertificacion(5))
                    .thenReturn(certificacionDTO);

            CertificacionController controller = new CertificacionController(
                    certificacionService,
                    investigadorService
            );

            ResponseEntity<?> response = controller.eliminarCertificacion(5);

            assertEquals(200, response.getStatusCode().value());
            assertEquals("Licencia profesional", response.getBody());

            verify(certificacionService, times(1)).eliminarCertificacion(5);
        }
    }
}