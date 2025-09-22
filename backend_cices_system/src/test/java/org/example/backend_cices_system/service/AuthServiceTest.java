package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.*;
import org.example.backend_cices_system.dto.LoginResponse;
import org.example.backend_cices_system.dto.UsuarioRegistroDTO;
import org.example.backend_cices_system.logic.*;
import org.example.backend_cices_system.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UsuarioRepository usuarioRepository;
    @Mock private RolUsuarioRepository rolUsuarioRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;
    @Mock private EmpleadoRepository empleadoRepository;
    @Mock private RolRepository rolRepository;
    @Mock private InvestigadorRepository investigadorRepository;
    @Mock private LoginAttemptService attemptService;
    @Mock private CertificacionRepository certificacionRepository;

    @InjectMocks private AuthService authService;

    @Test
    void loginSuccess() {
        Usuario u = new Usuario();
        u.setId(Short.valueOf("1"));
        u.setNombreUsuario("test");
        u.setContrasena("$2encoded");

        when(attemptService.isBlocked("test")).thenReturn(false);
        when(usuarioRepository.findActiveByUsername("test")).thenReturn(Optional.of(u));
        when(passwordEncoder.matches("12345", "$2encoded")).thenReturn(true);
        when(rolUsuarioRepository.findRoleNamesByUsuarioId(Short.valueOf("1")))
                .thenReturn(List.of("DIRECTOR"));
        when(jwtUtil.generate("test", List.of("DIRECTOR"))).thenReturn("fake-jwt");

        LoginResponse r = authService.login("test", "12345");

        assertNotNull(r);
        assertEquals("fake-jwt", r.token());
        assertEquals("test", r.user().username());
        assertEquals(List.of("DIRECTOR"), r.user().roles());
        verify(attemptService).onSuccess("test");
        verify(attemptService, never()).onFailure(anyString());
    }

    @Test
    void loginFailsInvalidPassword() {
        Usuario u = new Usuario();
        u.setId(Short.valueOf("1"));
        u.setNombreUsuario("test");
        u.setContrasena("$2encoded");

        when(attemptService.isBlocked("test")).thenReturn(false);
        when(usuarioRepository.findActiveByUsername("test")).thenReturn(Optional.of(u));
        when(passwordEncoder.matches("wrong", "$2encoded")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> authService.login("test", "wrong"));
        verify(attemptService).onFailure("test");
        verify(attemptService, never()).onSuccess(anyString());
    }

    @Test
    void loginBlocked() {
        when(attemptService.isBlocked("test")).thenReturn(true);
        assertThrows(org.springframework.security.authentication.LockedException.class,
                () -> authService.login("test", "x"));
        verifyNoInteractions(usuarioRepository, passwordEncoder, jwtUtil, rolUsuarioRepository);
    }

    @Test
    void loginUserNotFound() {
        when(attemptService.isBlocked("test")).thenReturn(false);
        when(usuarioRepository.findActiveByUsername("test")).thenReturn(Optional.empty());
        assertThrows(BadCredentialsException.class, () -> authService.login("test", "x"));
        verify(attemptService).onFailure("test");
    }

    @Test
    void loginPlainTextPassword() {
        Usuario u = new Usuario();
        u.setId(Short.valueOf("1"));
        u.setNombreUsuario("test");
        u.setContrasena("abc123"); // no bcrypt

        when(attemptService.isBlocked("test")).thenReturn(false);
        when(usuarioRepository.findActiveByUsername("test")).thenReturn(Optional.of(u));
        when(rolUsuarioRepository.findRoleNamesByUsuarioId(Short.valueOf("1")))
                .thenReturn(List.of("DIRECTOR"));
        when(jwtUtil.generate("test", List.of("DIRECTOR"))).thenReturn("jwt");

        LoginResponse r = authService.login("test", "abc123");

        assertEquals("jwt", r.token());
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(attemptService).onSuccess("test");
    }

    @Test
    void loginBcryptWithPrefix() {
        Usuario u = new Usuario();
        u.setId(Short.valueOf("1"));
        u.setNombreUsuario("test");
        u.setContrasena("{bcrypt}$2hash"); // con prefijo

        when(attemptService.isBlocked("test")).thenReturn(false);
        when(usuarioRepository.findActiveByUsername("test")).thenReturn(Optional.of(u));
        when(passwordEncoder.matches("pw", "$2hash")).thenReturn(true);
        when(rolUsuarioRepository.findRoleNamesByUsuarioId(Short.valueOf("1")))
                .thenReturn(List.of("DIRECTOR"));
        when(jwtUtil.generate("test", List.of("DIRECTOR"))).thenReturn("jwt");

        LoginResponse r = authService.login("test", "pw");

        assertEquals("jwt", r.token());
        verify(passwordEncoder).matches("pw", "$2hash");
    }

    @Test
    void registrarUsuarioConRolValido() {
        UsuarioRegistroDTO dto = new UsuarioRegistroDTO();
        dto.setNombreCompleto("Dir CICES");
        dto.setCorreo("director@test.com");
        dto.setIdentificacion("123");
        dto.setTelefono("8888");
        dto.setNombreUsuario("director");
        dto.setContrasena("12345");
        dto.setRoles(List.of("DIRECTOR"));

        Empleado emp = new Empleado(); emp.setId(Short.valueOf("1"));
        Usuario usr = new Usuario(); usr.setId(Short.valueOf("1"));
        Rol rol = new Rol(); rol.setId(Short.valueOf("9")); rol.setNombreRol("DIRECTOR");

        when(empleadoRepository.save(any())).thenReturn(emp);
        when(usuarioRepository.save(any())).thenReturn(usr);
        when(rolRepository.findByNombreRolIgnoreCase("DIRECTOR")).thenReturn(Optional.of(rol));
        when(passwordEncoder.encode("12345")).thenReturn("$2hash");

        authService.registrar(dto);

        verify(empleadoRepository).save(any(Empleado.class));
        verify(usuarioRepository).save(any(Usuario.class));
        verify(rolUsuarioRepository, times(1)).save(any(RolUsuario.class));
        verify(passwordEncoder).encode("12345");
        verifyNoInteractions(certificacionRepository); // no es investigador
    }

    @Test
    void registrarFallaSinRol() {
        UsuarioRegistroDTO dto = new UsuarioRegistroDTO();
        dto.setRoles(List.of());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.registrar(dto));
        assertEquals("Debe seleccionar al menos un rol", ex.getMessage());
    }

    @Test
    void existeIdentificacionTrue() {
        Empleado e = new Empleado(); e.setIdentificacion("123");
        when(empleadoRepository.findAll()).thenReturn(List.of(e));
        assertTrue(authService.existeIdentificacion("123"));
    }

    @Test
    void existeIdentificacionFalse() {
        Empleado e = new Empleado(); e.setIdentificacion("999");
        when(empleadoRepository.findAll()).thenReturn(List.of(e));
        assertFalse(authService.existeIdentificacion("123"));
    }

}


