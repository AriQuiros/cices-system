package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.RolUsuarioRepository;
import org.example.backend_cices_system.data.UsuarioRepository;
import org.example.backend_cices_system.dto.RolDTO;
import org.example.backend_cices_system.dto.UsuarioDTO;
import org.example.backend_cices_system.logic.Rol;
import org.example.backend_cices_system.logic.RolUsuario;
import org.example.backend_cices_system.logic.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private RolUsuarioRepository rolUsuarioRepository;

    @Mock
    private RolService rolService;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;
    private Rol rolDirector;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1);
        usuario.setNombreUsuario("juan.perez");
        usuario.setContrasena("hash");
        usuario.setActivo(true);

        rolDirector = new Rol();
        rolDirector.setId((short) 10);
        rolDirector.setNombreRol("DIRECTOR");
    }

    @Test
    void guardarUsuario_deberiaGuardarUsuarioActivoYContrasenaEncriptada() {
        UsuarioDTO dto = new UsuarioDTO(
                null,
                "maria.lopez",
                "123456",
                List.of(new RolDTO((short) 10, "DIRECTOR"))
        );

        when(encoder.encode("123456")).thenReturn("hash123");
        when(rolService.obtenerRol((short) 10)).thenReturn(rolDirector);
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        Usuario resultado = usuarioService.guardarUsuario(dto);

        assertNotNull(resultado);
        assertEquals("maria.lopez", resultado.getNombreUsuario());
        assertEquals("hash123", resultado.getContrasena());
        assertTrue(resultado.getActivo());

        verify(usuarioRepository).save(any(Usuario.class));
        verify(rolUsuarioRepository).save(any(RolUsuario.class));
    }

    @Test
    void guardarRoles_deberiaGuardarCadaRolAsignado() {
        Usuario user = new Usuario();
        user.setId(5);

        Rol rol1 = new Rol();
        rol1.setId((short) 1);
        rol1.setNombreRol("ADMIN");

        Rol rol2 = new Rol();
        rol2.setId((short) 2);
        rol2.setNombreRol("DIRECTOR");

        List<RolDTO> roles = List.of(
                new RolDTO((short) 1, "ADMIN"),
                new RolDTO((short) 2, "DIRECTOR")
        );

        when(rolService.obtenerRol((short) 1)).thenReturn(rol1);
        when(rolService.obtenerRol((short) 2)).thenReturn(rol2);

        usuarioService.guardarRoles(user, roles);

        verify(rolUsuarioRepository, times(2)).save(any(RolUsuario.class));
    }
}