package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.CertificacionRepository;
import org.example.backend_cices_system.data.EmpleadoRepository;
import org.example.backend_cices_system.data.InvestigadorRepository;
import org.example.backend_cices_system.dto.CertificacionDTO;
import org.example.backend_cices_system.dto.EmpleadoDTO;
import org.example.backend_cices_system.dto.InvestigadorDTO;
import org.example.backend_cices_system.logic.Certificacion;
import org.example.backend_cices_system.logic.Empleado;
import org.example.backend_cices_system.logic.Investigador;
import org.example.backend_cices_system.logic.Usuario;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("Pruebas de Service - Módulo Mi Perfil")
@ExtendWith(MockitoExtension.class)
class MiPerfilServiceTest {

    @Mock
    private EmpleadoRepository empleadoRepository;

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private CatalogoService catalogoService;

    @Mock
    private InvestigadorRepository investigadorRepository;

    @Mock
    private EmpleadoService empleadoServiceMock;

    @Mock
    private EntidadService entidadService;

    @Mock
    private TituloService tituloService;

    @Mock
    private CertificacionService certificacionServiceMock;

    @Mock
    private CertificacionRepository certificacionRepository;

    @Nested
    @DisplayName("HU-035 - Visualizar perfil del personal administrativo, asistente y director")
    class HU035 {

        @Test
        @DisplayName("Debe retornar los datos básicos del perfil del empleado")
        void obtenerPerfilEmpleado_debeRetornarDatosBasicos() {
            Usuario usuario = new Usuario();
            usuario.setNombreUsuario("admin@ucr.ac.cr");

            Empleado empleado = new Empleado();
            empleado.setId(1);
            empleado.setIdUsuario(usuario);
            empleado.setNombreCompleto("Ana Mora");
            empleado.setIdentificacion("11223344");
            empleado.setPais("CR");
            empleado.setCorreo("ana.mora@ucr.ac.cr");
            empleado.setNumeroTelefono("+50688887777");
            empleado.setIdCodigoTipoId((short) 1);
            empleado.setIdCodigoTipoGradoAcademico((short) 2);

            when(empleadoRepository.findByIdUsuario(usuario))
                    .thenReturn(Optional.of(empleado));

            EmpleadoService empleadoService = new EmpleadoService(
                    empleadoRepository,
                    usuarioService,
                    catalogoService
            );

            EmpleadoDTO resultado = empleadoService.obtenerPerfil(usuario);

            assertEquals("Ana Mora", resultado.nombreCompleto());
            assertEquals("11223344", resultado.identificacion());
            assertEquals("CR", resultado.pais());
            assertEquals("ana.mora@ucr.ac.cr", resultado.correo());
            assertEquals("+50688887777", resultado.numeroTelefono());
        }

        @Test
        @DisplayName("Debe lanzar error si no existe empleado asociado al usuario")
        void obtenerPerfilEmpleado_sinEmpleado_debeLanzarError() {
            Usuario usuario = new Usuario();
            usuario.setNombreUsuario("noexiste@ucr.ac.cr");

            when(empleadoRepository.findByIdUsuario(usuario))
                    .thenReturn(Optional.empty());

            EmpleadoService empleadoService = new EmpleadoService(
                    empleadoRepository,
                    usuarioService,
                    catalogoService
            );

            assertThrows(RuntimeException.class, () -> {
                empleadoService.obtenerPerfil(usuario);
            });
        }
    }

    @Nested
    @DisplayName("HU-036 - Visualizar perfil de investigadores")
    class HU036 {

        @Test
        @DisplayName("Debe retornar el perfil del investigador con formación académica")
        void obtenerPerfilInvestigador_debeRetornarFormacionAcademica() {
            Usuario usuario = new Usuario();
            usuario.setNombreUsuario("investigador@ucr.ac.cr");

            Empleado empleado = new Empleado();
            empleado.setId(1);
            empleado.setNombreCompleto("Carlos Rojas");
            empleado.setIdUsuario(usuario);

            Investigador investigador = new Investigador();
            investigador.setId(10);
            investigador.setIdEmpleado(empleado);
            investigador.setTemaInteres("Cuidado de enfermería");

            when(investigadorRepository.findByIdEmpleado_IdUsuario(usuario))
                    .thenReturn(Optional.of(investigador));

            when(empleadoServiceMock.obtenerEmpleadoDTO(empleado))
                    .thenReturn(null);

            when(tituloService.tituloDTOList(investigador))
                    .thenReturn(List.of());

            when(certificacionServiceMock.certificacionDTOList(investigador))
                    .thenReturn(List.of());

            InvestigadorService investigadorService = new InvestigadorService(
                    empleadoServiceMock,
                    entidadService,
                    investigadorRepository,
                    tituloService,
                    certificacionServiceMock
            );

            InvestigadorDTO resultado = investigadorService.obtenerPerfil(usuario);

            assertEquals(10, resultado.id());
            assertEquals("Cuidado de enfermería", resultado.temaInteres());
            assertNotNull(resultado.titulos());
            assertNotNull(resultado.certificaciones());
        }

        @Test
        @DisplayName("Debe lanzar error si el usuario no tiene investigador asociado")
        void obtenerPerfilInvestigador_sinInvestigador_debeLanzarError() {
            Usuario usuario = new Usuario();
            usuario.setNombreUsuario("usuario@ucr.ac.cr");

            when(investigadorRepository.findByIdEmpleado_IdUsuario(usuario))
                    .thenReturn(Optional.empty());

            InvestigadorService investigadorService = new InvestigadorService(
                    empleadoServiceMock,
                    entidadService,
                    investigadorRepository,
                    tituloService,
                    certificacionServiceMock
            );

            assertThrows(IllegalStateException.class, () -> {
                investigadorService.obtenerPerfil(usuario);
            });
        }
    }

    @Nested
    @DisplayName("HU-041 - Eliminar acreditación o licencia personal")
    class HU041 {

        @Test
        @DisplayName("Debe eliminar una certificación existente")
        void eliminarCertificacion_existente_debeEliminarCorrectamente() {
            Certificacion certificacion = new Certificacion();
            certificacion.setId(5);
            certificacion.setNombreCertificacion("Licencia profesional");
            certificacion.setFechaExpiracion(LocalDate.now().plusMonths(6));
            certificacion.setIdCodigoTipoCertificacion((short) 1);
            certificacion.setIdCodigoTipoEstado((short) 2);

            when(certificacionRepository.findById(5))
                    .thenReturn(Optional.of(certificacion));

            CertificacionService certificacionService = new CertificacionService(
                    certificacionRepository,
                    catalogoService,
                    entidadService
            );

            CertificacionDTO resultado = certificacionService.eliminarCertificacion(5);

            assertEquals("Licencia profesional", resultado.nombreCertificacion());
            verify(certificacionRepository, times(1)).deleteById(5);
        }

        @Test
        @DisplayName("Debe lanzar error si la certificación no existe")
        void eliminarCertificacion_inexistente_debeLanzarError() {
            when(certificacionRepository.findById(99))
                    .thenReturn(Optional.empty());

            CertificacionService certificacionService = new CertificacionService(
                    certificacionRepository,
                    catalogoService,
                    entidadService
            );

            assertThrows(IllegalStateException.class, () -> {
                certificacionService.eliminarCertificacion(99);
            });

            verify(certificacionRepository, never()).deleteById(anyInt());
        }
    }
}