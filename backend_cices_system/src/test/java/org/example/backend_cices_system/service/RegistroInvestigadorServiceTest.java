package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.*;
import org.example.backend_cices_system.dto.UsuarioRegistroDTO;
import org.example.backend_cices_system.logic.Certificacion;
import org.example.backend_cices_system.logic.Investigador;
import org.example.backend_cices_system.logic.Rol;
import org.example.backend_cices_system.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class RegistroInvestigadorServiceTest {


    @Mock private UsuarioRepository usuarioRepository;
    @Mock private RolUsuarioRepository rolUsuarioRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;
    @Mock private EmpleadoRepository empleadoRepository;
    @Mock private RolRepository rolRepository;
    @Mock private LoginAttemptService attemptService;
    @Mock private CertificacionRepository certificacionRepository;
    @Mock private InvestigadorRepository investigadorRepository;

    @InjectMocks
    private AuthService authService;

    // Helpers para armar acreditaciones válidas
    private static UsuarioRegistroDTO.AcreditacionDTO acc(
            String nombre, LocalDate exp, Short tipo, Short estado) {
        var a = new UsuarioRegistroDTO.AcreditacionDTO();
        a.setNombreCertificacion(nombre);
        a.setFechaExpiracion(exp);
        a.setIdCodigoTipoCertificacion(tipo);
        a.setIdCodigoTipoEstado(estado);
        return a;
    }
    private static UsuarioRegistroDTO.AcreditacionDTO accDate(
            String nombre, String dateStr, Short tipo, Short estado) {
        var a = new UsuarioRegistroDTO.AcreditacionDTO();
        a.setNombreCertificacion(nombre);
        a.setDate(dateStr); // "yyyy-MM-dd"
        a.setIdCodigoTipoCertificacion(tipo);
        a.setIdCodigoTipoEstado(estado);
        return a;
    }
    // Helper en tus tests
    private UsuarioRegistroDTO dtoInvestigadorValido() {
        var dto = new UsuarioRegistroDTO();
        dto.setRoles(List.of("INVESTIGADOR"));
        dto.setUnidadAcademica("Escuela de Ciencias");
        dto.setInstitucionOrigen("UNA");
        dto.setIdCodigoGradoAcademico((short)3);
        dto.setNombreUsuario("user");
        dto.setContrasena("pw");
        return dto;
    }


    // 3) Setup común para registrar investigador
    @org.junit.jupiter.api.BeforeEach
    void setupRegistrarInvestigador() {
        when(passwordEncoder.encode(any())).thenReturn("$2enc");

        // Empleado y Usuario se guardan tal cual
        when(empleadoRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(usuarioRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        // Roles DIRECTOR/ADMINISTRADOR/ASISTENTE/INVESTIGADOR existen
        when(rolRepository.findByNombreRolIgnoreCase(anyString()))
                .thenAnswer(i -> {
                    Rol r = new Rol();
                    r.setNombreRol(i.getArgument(0));
                    return Optional.of(r);
                });

        when(rolUsuarioRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        // Investigador devuelto con id seteado
        when(investigadorRepository.save(any())).thenAnswer(i -> {
            Investigador inv = i.getArgument(0);
            // si tu entidad tiene setter de id, ajústalo; si no, omite
            return inv;
        });
    }
    @Test
    void registrarInvestigadorConCertificacionesOk() {
        var dto = dtoInvestigadorValido();
        var hoy = LocalDate.now();
        dto.setAcreditaciones(List.of(
                acc("AWS SA", hoy, (short)1, (short)9),
                // antes: accDate(..., null, null)
                accDate("Azure", hoy.plusDays(1).toString(), (short)1, null) // tipo requerido
        ));

        when(certificacionRepository.existsByIdInvestigadorAndNombreCertificacionIgnoreCase(any(Investigador.class), eq("AWS SA"))).thenReturn(false);
        when(certificacionRepository.existsByIdInvestigadorAndNombreCertificacionIgnoreCase(any(Investigador.class), eq("Azure"))).thenReturn(false);
        when(empleadoRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(usuarioRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(rolRepository.findByNombreRolIgnoreCase(anyString())).thenReturn(Optional.of(new Rol()));
        when(rolUsuarioRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(investigadorRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        @SuppressWarnings("unchecked")
        var cap = org.mockito.ArgumentCaptor.forClass(java.util.Collection.class);
        when(certificacionRepository.saveAll(cap.capture())).thenReturn(List.of());

        assertDoesNotThrow(() -> authService.registrar(dto));
        verify(certificacionRepository).saveAll(anyCollection());

        // opcional: validar default de estado=9 en "Azure"
        var guardadas = (java.util.Collection<Certificacion>) cap.getValue();
        var azure = guardadas.stream().filter(c -> c.getNombreCertificacion().equals("Azure")).findFirst().orElseThrow();
        org.junit.jupiter.api.Assertions.assertEquals((short)9, azure.getIdCodigoTipoEstado());
    }


    @Test
    void registrarInvestigadorDuplicadoEnPayload() {
        var hoy = LocalDate.now();
        var dto = new UsuarioRegistroDTO();
        dto.setRoles(List.of("INVESTIGADOR"));
        dto.setAcreditaciones(List.of(
                acc("AWS SA", hoy, (short)1, (short)9),
                acc("aws sa", hoy.plusDays(1), (short)1, (short)9)
        ));

        assertThrows(IllegalArgumentException.class, () -> authService.registrar(dto));
        verify(certificacionRepository, never()).saveAll(anyCollection());
    }
    @Test
    void registrarInvestigadorDuplicadoEnBD() {
        var dto = dtoInvestigadorValido();
        dto.setAcreditaciones(List.of(
                acc("AWS SA", LocalDate.now(), (short)1, (short)9)
        ));

        when(certificacionRepository.existsByIdInvestigadorAndNombreCertificacionIgnoreCase(any(Investigador.class), eq("AWS SA")))
                .thenReturn(true);
        when(empleadoRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(usuarioRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(rolRepository.findByNombreRolIgnoreCase(anyString())).thenReturn(Optional.of(new Rol()));
        when(rolUsuarioRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(investigadorRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        assertThrows(IllegalStateException.class, () -> authService.registrar(dto));
        verify(certificacionRepository, never()).saveAll(anyCollection());
    }

    @Test
    void registrarInvestigadorFechaPasada() {
        var dto = new UsuarioRegistroDTO();
        dto.setRoles(List.of("INVESTIGADOR"));
        dto.setAcreditaciones(List.of(acc("AWS SA", LocalDate.now().minusDays(1), (short)1, (short)9)));

        assertThrows(IllegalArgumentException.class, () -> authService.registrar(dto));
    }

    @Test
    void registrarInvestigadorFormatoFechaInvalido() {
        var dto = new UsuarioRegistroDTO();
        dto.setRoles(List.of("INVESTIGADOR"));
        dto.setAcreditaciones(List.of(accDate("AWS SA", "2025/09/26", (short)1, (short)9))); // mal

        assertThrows(IllegalArgumentException.class, () -> authService.registrar(dto));
    }

    @Test
    void registrarInvestigadorTipoCertificacionObligatorio() {
        var dto = dtoInvestigadorValido(); // helper con roles=[INVESTIGADOR], UA/IO/grado válidos
        var acc = new UsuarioRegistroDTO.AcreditacionDTO();
        acc.setNombreCertificacion("AWS SA");
        acc.setFechaExpiracion(LocalDate.now());
        acc.setIdCodigoTipoCertificacion(null);     // <- falta tipo
        acc.setIdCodigoTipoEstado((short)9);
        dto.setAcreditaciones(List.of(acc));

        // stubs mínimos para avanzar hasta la validación de certificaciones
        when(empleadoRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(usuarioRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(rolRepository.findByNombreRolIgnoreCase(anyString())).thenReturn(Optional.of(new Rol()));
        when(rolUsuarioRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(investigadorRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(certificacionRepository
                .existsByIdInvestigadorAndNombreCertificacionIgnoreCase(any(Investigador.class), anyString()))
                .thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> authService.registrar(dto));
        verify(certificacionRepository, never()).saveAll(anyCollection());
    }


    @Test
    void registrar_investigador_unidadAcademica_null_lanza() {
        var dto = new UsuarioRegistroDTO();
        dto.setRoles(List.of("INVESTIGADOR"));
        dto.setUnidadAcademica(null);                 // inválido
        dto.setInstitucionOrigen("UNA");
        dto.setIdCodigoGradoAcademico((short)3);

        assertThrows(IllegalArgumentException.class, () -> authService.registrar(dto));
        verifyNoInteractions(investigadorRepository); // no debe intentar guardar
    }


    @Test
    void registrar_investigador_institucionOrigen_null_lanza() {
        var dto = new UsuarioRegistroDTO();
        dto.setRoles(List.of("INVESTIGADOR"));
        dto.setUnidadAcademica("Escuela de Ciencias");
        dto.setInstitucionOrigen(null);               // inválido
        dto.setIdCodigoGradoAcademico((short)3);

        assertThrows(IllegalArgumentException.class, () -> authService.registrar(dto));
        verifyNoInteractions(investigadorRepository);
    }



    @Test
    void registrar_investigador_grado_null_lanza() {
        var dto = new UsuarioRegistroDTO();
        dto.setRoles(List.of("INVESTIGADOR"));
        dto.setUnidadAcademica("Escuela de Ciencias");
        dto.setInstitucionOrigen("UNA");
        dto.setIdCodigoGradoAcademico(null);          // inválido

        assertThrows(IllegalArgumentException.class, () -> authService.registrar(dto));
        verifyNoInteractions(investigadorRepository);
    }

    @Test
    void registrar_investigador_campos_validos_pasa() {
        // stubs mínimos para que avance
        when(empleadoRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(usuarioRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(rolRepository.findByNombreRolIgnoreCase(anyString())).thenReturn(Optional.of(new Rol()));
        when(rolUsuarioRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(investigadorRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        var dto = new UsuarioRegistroDTO();
        dto.setRoles(List.of("INVESTIGADOR"));
        dto.setUnidadAcademica("Escuela de Ciencias");
        dto.setInstitucionOrigen("UNA");
        dto.setIdCodigoGradoAcademico((short)3);

        assertDoesNotThrow(() -> authService.registrar(dto));
        verify(investigadorRepository, atLeastOnce()).save(any(Investigador.class));
    }

}