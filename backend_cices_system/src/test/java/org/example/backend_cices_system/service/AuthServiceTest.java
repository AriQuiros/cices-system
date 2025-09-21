package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.*;
import org.example.backend_cices_system.dto.LoginResponse;
import org.example.backend_cices_system.dto.UserInfo;
import org.example.backend_cices_system.dto.UsuarioRegistroDTO;
import org.example.backend_cices_system.logic.*;
import org.example.backend_cices_system.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private RolUsuarioRepository rolUsuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private EmpleadoRepository empleadoRepository;

    @Mock
    private RolRepository rolRepository;

    @Mock
    private InvestigadorRepository investigadorRepository;

    @InjectMocks
    private AuthService authService;


        //LOGIN
        @Test
        void loginSuccess() {
            //crear un nuevo usuario simulado
            Usuario usuario = new Usuario();
            usuario.setId(Short.valueOf("1"));
            usuario.setNombreUsuario("test");
            usuario.setContrasena("$2encoded"); // simulando hash bcrypt guardada en la base de datos

            // Arrange: lo que debe devolver los repositorios y el passwordEncoder cuando loguea un usuario
            when(usuarioRepository.findActiveByUsername("test"))
                    .thenReturn(Optional.of(usuario));
            when(passwordEncoder.matches("12345", "$2encoded")).thenReturn(true);
            when(rolUsuarioRepository.findRoleNamesByUsuarioId(Short.valueOf("1")))
                    .thenReturn(List.of("DIRECTOR"));
            when(jwtUtil.generate("test", List.of("DIRECTOR")))
                    .thenReturn("fake-jwt");

            // Act: ejecutamos el login del service
            LoginResponse response = authService.login("test", "12345");

            // Assert: verificamos la respuesta esperada
            assertNotNull(response);
            assertEquals("fake-jwt", response.token());
            assertEquals("test", response.user().username());
            assertEquals(List.of("DIRECTOR"), response.user().roles());
        }

        @Test
        void loginFailsInvalidPassword() {
            //crear un nuevo usuario simulado
            Usuario usuario = new Usuario();
            usuario.setId(Short.valueOf("1"));
            usuario.setNombreUsuario("test");
            usuario.setContrasena("$2encoded");


            when(usuarioRepository.findActiveByUsername("test"))
                    .thenReturn(Optional.of(usuario));
            when(passwordEncoder.matches("wrong", "$2encoded")).thenReturn(false);

            assertThrows(BadCredentialsException.class, () ->
                    authService.login("test", "wrong"));
        }

        // TEST REGISTRO
        @Test
        void registrarUsuarioConRolValido() {
            //crear un nuevo usuario con rol simulado
            UsuarioRegistroDTO dto = new UsuarioRegistroDTO();
            dto.setNombreCompleto("Director cices");
            dto.setCorreo("director@test.com");
            dto.setIdentificacion("1234567890");
            dto.setTelefono("88888888");
            dto.setNombreUsuario("1234567890");
            dto.setContrasena("12345");
            dto.setRoles(List.of("DIRECTOR"));

            //difinir id
            Empleado empleadoMock = new Empleado();
            empleadoMock.setId(Short.valueOf("1"));

            //difinir id
            Usuario usuarioMock = new Usuario();
            usuarioMock.setId(Short.valueOf("1"));

            // un rol en la base de datoos
            Rol rolMock = new Rol();
            rolMock.setId(Short.valueOf("1"));
            rolMock.setNombreRol("DIRECTOR");

            // Arrange: lo que debe devolver el repositorio
            when(empleadoRepository.save(any(Empleado.class))).thenReturn(empleadoMock);
            when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioMock);
            when(rolRepository.findByNombreRolIgnoreCase("DIRECTOR")).thenReturn(Optional.of(rolMock));

            //registar el usuario
            authService.registrar(dto);

            //verficar el registro, los repositorios se llamaron correctamente
            verify(empleadoRepository, times(1)).save(any(Empleado.class));
            verify(usuarioRepository, times(1)).save(any(Usuario.class));
            verify(rolUsuarioRepository, times(1)).save(any(RolUsuario.class));
        }



    //si no se selecciona un rol al registrar
        @Test
        void registrarFallaSinRol() {
            UsuarioRegistroDTO dto = new UsuarioRegistroDTO();
            dto.setRoles(List.of()); // vacía

            RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.registrar(dto));
            assertEquals("Debe seleccionar al menos un rol", ex.getMessage());
        }

        //TEST IDENTIFICACION EXISTENMTE ---
        @Test
        void existeIdentificacionTrue() {
            Empleado e1 = new Empleado();
            e1.setIdentificacion("1234567890");
            when(empleadoRepository.findAll()).thenReturn(List.of(e1));

            assertTrue(authService.existeIdentificacion("1234567890"));
        }

        //TEST IDENTIFICACION NO EXISTENTE ---
        @Test
        void existeIdentificacionFalse() {
            Empleado e1 = new Empleado();
            e1.setIdentificacion("999");
            when(empleadoRepository.findAll()).thenReturn(List.of(e1));

            assertFalse(authService.existeIdentificacion("1234567890"));
        }
    }

