package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.UsuarioRepository;
import org.example.backend_cices_system.logic.Usuario;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceEstadoTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private RolUsuarioService rolUsuarioService;

    @InjectMocks
    private UsuarioService usuarioService;

    @Test
    void cambiarEstadoUsuario_debeReactivarUsuarioDeshabilitado() {
        Usuario usuario = new Usuario();
        usuario.setId(2);
        usuario.setNombreUsuario("carlos.deshabilitado@cices.ucr.ac.cr");
        usuario.setContrasena("hash");
        usuario.setActivo(false);

        when(usuarioRepository.findById(2)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        usuarioService.cambiarEstadoUsuario(2, true);

        ArgumentCaptor<Usuario> usuarioCaptor = ArgumentCaptor.forClass(Usuario.class);

        verify(usuarioRepository).findById(2);
        verify(usuarioRepository).save(usuarioCaptor.capture());

        Usuario usuarioGuardado = usuarioCaptor.getValue();

        assertEquals(2, usuarioGuardado.getId());
        assertEquals("carlos.deshabilitado@cices.ucr.ac.cr", usuarioGuardado.getNombreUsuario());
        assertTrue(usuarioGuardado.getActivo());
    }

    @Test
    void cambiarEstadoUsuario_debeDeshabilitarUsuarioActivo() {
        Usuario usuario = new Usuario();
        usuario.setId(3);
        usuario.setNombreUsuario("ana.activa@cices.ucr.ac.cr");
        usuario.setContrasena("hash");
        usuario.setActivo(true);

        when(usuarioRepository.findById(3)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        usuarioService.cambiarEstadoUsuario(3, false);

        ArgumentCaptor<Usuario> usuarioCaptor = ArgumentCaptor.forClass(Usuario.class);

        verify(usuarioRepository).findById(3);
        verify(usuarioRepository).save(usuarioCaptor.capture());

        Usuario usuarioGuardado = usuarioCaptor.getValue();

        assertEquals(3, usuarioGuardado.getId());
        assertFalse(usuarioGuardado.getActivo());
    }

    @Test
    void cambiarEstadoUsuario_debeLanzarErrorCuandoUsuarioNoExiste() {
        when(usuarioRepository.findById(999)).thenReturn(Optional.empty());

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> usuarioService.cambiarEstadoUsuario(999, true)
        );

        assertEquals("No se encontró un usuario con el id '999'", exception.getMessage());

        verify(usuarioRepository).findById(999);
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }
}