package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.InvestigadorRepository;
import org.example.backend_cices_system.dto.*;
import org.example.backend_cices_system.logic.Empleado;
import org.example.backend_cices_system.logic.Entidad;
import org.example.backend_cices_system.logic.Investigador;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InvestigadorServiceTest {

    @Mock
    private EmpleadoService empleadoService;

    @Mock
    private EntidadService entidadService;

    @Mock
    private InvestigadorRepository investigadorRepository;

    @Mock
    private TituloService tituloService;

    @Mock
    private CertificacionService certificacionService;

    @InjectMocks
    private InvestigadorService investigadorService;

    @Captor
    private ArgumentCaptor<Investigador> investigadorCaptor;

    @Test
    void actualizarInvestigador_debeActualizarPerfilYGuardarCertificaciones() {
        CodigoDTO tipoEntidad = new CodigoDTO((short) 1, "INSTITUCION", "Institución");
        CodigoDTO tipoUnidad = new CodigoDTO((short) 2, "UNIDAD", "Unidad");
        CodigoDTO tipoId = new CodigoDTO((short) 3, "NACIONAL", "Nacional");
        CodigoDTO grado = new CodigoDTO((short) 4, "LICENCIATURA", "Licenciatura");
        CodigoDTO tipoCert = new CodigoDTO((short) 5, "ACREDITACION", "Acreditación");
        CodigoDTO nivelTitulo = new CodigoDTO((short) 6, "MAESTRIA", "Maestría");

        EntidadDTO institucionOrigenDto =
                new EntidadDTO(1, "Universidad de Costa Rica", tipoEntidad);
        EntidadDTO unidadAcademicaDto =
                new EntidadDTO(2, "Escuela de Computación", tipoUnidad);
        EntidadDTO entidadCertDto =
                new EntidadDTO(3, "Colegio Federado", tipoEntidad);

        UsuarioDTO usuarioDto = new UsuarioDTO(
                10,
                "maria.martinezhernandez@ucr.ac.cr",
                "1234",
                List.of(new RolDTO((short) 1, "INVESTIGADOR"))
        );

        EmpleadoDTO empleadoDto = new EmpleadoDTO(
                20,
                "María Martínez Hernández",
                "123456789",
                tipoId,
                "CR",
                "maria.martinezhernandez@ucr.ac.cr",
                "88887777",
                grado,
                usuarioDto
        );

        TituloDTO tituloDto = new TituloDTO(
                30,
                institucionOrigenDto,
                "Maestría en Computación",
                nivelTitulo,
                LocalDate.of(2020, 11, 20)
        );

        CertificacionDTO certificacionDto = new CertificacionDTO(
                55,
                entidadCertDto,
                "Acreditación ISO 27001",
                tipoCert,
                LocalDate.of(2027, 6, 30),
                null
        );

        InvestigadorDTO dto = new InvestigadorDTO(
                100,
                empleadoDto,
                institucionOrigenDto,
                unidadAcademicaDto,
                "Seguridad informática",
                List.of(tituloDto),
                List.of(certificacionDto)
        );

        Empleado empleado = new Empleado();
        empleado.setId(20);
        empleado.setNombreCompleto("María Martínez Hernández");

        Investigador investigadorExistente = new Investigador();
        investigadorExistente.setId(100);
        investigadorExistente.setIdEmpleado(empleado);
        investigadorExistente.setTemaInteres("Tema viejo");

        Entidad institucionGuardada = new Entidad();
        institucionGuardada.setId(1);
        institucionGuardada.setNombre("Universidad de Costa Rica");

        Entidad unidadGuardada = new Entidad();
        unidadGuardada.setId(2);
        unidadGuardada.setNombre("Escuela de Computación");

        when(investigadorRepository.findById(100))
                .thenReturn(Optional.of(investigadorExistente));
        when(entidadService.guardarEntidad(institucionOrigenDto))
                .thenReturn(institucionGuardada);
        when(entidadService.guardarEntidad(unidadAcademicaDto))
                .thenReturn(unidadGuardada);
        when(investigadorRepository.save(any(Investigador.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Investigador resultado = investigadorService.actualizarInvestigador(dto);

        assertNotNull(resultado);
        assertEquals("Seguridad informática", resultado.getTemaInteres());
        assertSame(institucionGuardada, resultado.getIdInstitucionOrigen());
        assertSame(unidadGuardada, resultado.getIdUnidadAcademica());

        verify(empleadoService).actualizarEmpleado(empleadoDto);

        verify(investigadorRepository).save(investigadorCaptor.capture());
        Investigador guardado = investigadorCaptor.getValue();
        assertEquals("Seguridad informática", guardado.getTemaInteres());

        verify(tituloService).guardarTitulo(tituloDto, resultado);
        verify(certificacionService).guardarCertificacion(certificacionDto, resultado);
    }

    @Test
    void actualizarInvestigador_noDebeGuardarTitulosNiCertificacionesSiVienenNulos() {
        CodigoDTO tipoEntidad = new CodigoDTO((short) 1, "INSTITUCION", "Institución");
        CodigoDTO tipoUnidad = new CodigoDTO((short) 2, "UNIDAD", "Unidad");
        CodigoDTO tipoId = new CodigoDTO((short) 3, "NACIONAL", "Nacional");
        CodigoDTO grado = new CodigoDTO((short) 4, "LICENCIATURA", "Licenciatura");

        UsuarioDTO usuarioDto = new UsuarioDTO(
                10,
                "maria.martinezhernandez@ucr.ac.cr",
                "1234",
                List.of(new RolDTO((short) 1, "INVESTIGADOR"))
        );

        EmpleadoDTO empleadoDto = new EmpleadoDTO(
                20,
                "María Martínez Hernández",
                "123456789",
                tipoId,
                "CR",
                "maria.martinezhernandez@ucr.ac.cr",
                "88887777",
                grado,
                usuarioDto
        );

        EntidadDTO institucionOrigenDto =
                new EntidadDTO(1, "Universidad de Costa Rica", tipoEntidad);
        EntidadDTO unidadAcademicaDto =
                new EntidadDTO(2, "Escuela de Computación", tipoUnidad);

        InvestigadorDTO dto = new InvestigadorDTO(
                100,
                empleadoDto,
                institucionOrigenDto,
                unidadAcademicaDto,
                "Nuevo tema",
                null,
                null
        );

        Empleado empleado = new Empleado();
        empleado.setId(20);
        empleado.setNombreCompleto("María Martínez Hernández");

        Investigador investigadorExistente = new Investigador();
        investigadorExistente.setId(100);
        investigadorExistente.setIdEmpleado(empleado);

        Entidad institucionGuardada = new Entidad();
        institucionGuardada.setId(1);

        Entidad unidadGuardada = new Entidad();
        unidadGuardada.setId(2);

        when(investigadorRepository.findById(100))
                .thenReturn(Optional.of(investigadorExistente));
        when(entidadService.guardarEntidad(institucionOrigenDto))
                .thenReturn(institucionGuardada);
        when(entidadService.guardarEntidad(unidadAcademicaDto))
                .thenReturn(unidadGuardada);
        when(investigadorRepository.save(any(Investigador.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Investigador resultado = investigadorService.actualizarInvestigador(dto);

        assertEquals("Nuevo tema", resultado.getTemaInteres());
        verify(empleadoService).actualizarEmpleado(empleadoDto);
        verify(tituloService, never()).guardarTitulo(any(), any());
        verify(certificacionService, never()).guardarCertificacion(any(), any());
    }
}