package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.EmpleadoRepository;
import org.example.backend_cices_system.dto.CodigoDTO;
import org.example.backend_cices_system.dto.EmpleadoDTO;
import org.example.backend_cices_system.dto.RolDTO;
import org.example.backend_cices_system.dto.UsuarioDTO;
import org.example.backend_cices_system.logic.Empleado;
import org.example.backend_cices_system.logic.Usuario;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmpleadoServicePerfilTest {

    @Mock
    private EmpleadoRepository empleadoRepository;

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private CatalogoService catalogoService;

    @InjectMocks
    private EmpleadoService empleadoService;

    @Test
    void actualizarEmpleado_debeActualizarInformacionDelPerfil() {
        Usuario usuario = new Usuario();
        usuario.setId(7);
        usuario.setNombreUsuario("maria.directora@ucr.ac.cr");
        usuario.setContrasena("hash");
        usuario.setActivo(true);

        Empleado empleado = new Empleado();
        empleado.setId(15);
        empleado.setIdUsuario(usuario);
        empleado.setNombreCompleto("María Directora Prueba");
        empleado.setIdentificacion("111111111");
        empleado.setIdCodigoTipoId((short) 1);
        empleado.setPais("CR");
        empleado.setCorreo("maria.directora@ucr.ac.cr");
        empleado.setNumeroTelefono("88887777");
        empleado.setIdCodigoTipoGradoAcademico((short) 10);

        EmpleadoDTO dto = new EmpleadoDTO(
                15,
                "María Directora Actualizada",
                "111111111",
                new CodigoDTO((short) 1, "NACIONAL", "Nacional"),
                "CR",
                "maria.actualizada@ucr.ac.cr",
                "88889999",
                new CodigoDTO((short) 10, "LICENCIATURA", "Licenciatura"),
                new UsuarioDTO(
                        7,
                        "maria.actualizada@ucr.ac.cr",
                        "",
                        List.of(new RolDTO((short) 1, "DIRECCION"))
                )
        );

        when(empleadoRepository.findById(15)).thenReturn(Optional.of(empleado));
        when(usuarioService.existeNombreUsuario("maria.actualizada@ucr.ac.cr")).thenReturn(false);
        when(empleadoRepository.save(any(Empleado.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Empleado resultado = empleadoService.actualizarEmpleado(dto);

        ArgumentCaptor<Empleado> empleadoCaptor = ArgumentCaptor.forClass(Empleado.class);

        verify(empleadoRepository).findById(15);
        verify(usuarioService).actualizarUsuario(dto.usuario());
        verify(empleadoRepository).save(empleadoCaptor.capture());

        Empleado empleadoGuardado = empleadoCaptor.getValue();

        assertEquals(resultado, empleadoGuardado);
        assertEquals("María Directora Actualizada", empleadoGuardado.getNombreCompleto());
        assertEquals("maria.actualizada@ucr.ac.cr", empleadoGuardado.getCorreo());
        assertEquals("88889999", empleadoGuardado.getNumeroTelefono());
        assertEquals("CR", empleadoGuardado.getPais());
        assertEquals((short) 1, empleadoGuardado.getIdCodigoTipoId());
        assertEquals((short) 10, empleadoGuardado.getIdCodigoTipoGradoAcademico());
    }

    @Test
    void obtenerPerfil_debeRetornarSoloElPerfilDelUsuarioAutenticado() {
        Usuario usuario = new Usuario();
        usuario.setId(7);
        usuario.setNombreUsuario("maria.directora@ucr.ac.cr");
        usuario.setContrasena("hash");
        usuario.setActivo(true);

        Empleado empleado = new Empleado();
        empleado.setId(15);
        empleado.setIdUsuario(usuario);
        empleado.setNombreCompleto("María Directora Prueba");
        empleado.setIdentificacion("111111111");
        empleado.setIdCodigoTipoId((short) 1);
        empleado.setPais("CR");
        empleado.setCorreo("maria.directora@ucr.ac.cr");
        empleado.setNumeroTelefono("88887777");
        empleado.setIdCodigoTipoGradoAcademico((short) 10);

        CodigoDTO tipoId = new CodigoDTO((short) 1, "NACIONAL", "Nacional");
        CodigoDTO grado = new CodigoDTO((short) 10, "LICENCIATURA", "Licenciatura");

        UsuarioDTO usuarioDTO = new UsuarioDTO(
                7,
                "maria.directora@ucr.ac.cr",
                "",
                List.of(new RolDTO((short) 1, "DIRECCION"))
        );

        when(empleadoRepository.findByIdUsuario(usuario)).thenReturn(Optional.of(empleado));
        when(catalogoService.obtenerDto((short) 1)).thenReturn(tipoId);
        when(catalogoService.obtenerDto((short) 10)).thenReturn(grado);
        when(usuarioService.obtenerDTO(usuario)).thenReturn(usuarioDTO);

        EmpleadoDTO resultado = empleadoService.obtenerPerfil(usuario);

        assertNotNull(resultado);
        assertEquals(15, resultado.id());
        assertEquals("María Directora Prueba", resultado.nombreCompleto());
        assertEquals("maria.directora@ucr.ac.cr", resultado.correo());
        assertEquals("88887777", resultado.numeroTelefono());
        assertEquals("111111111", resultado.identificacion());
        assertEquals(usuarioDTO, resultado.usuario());

        verify(empleadoRepository).findByIdUsuario(usuario);
        verify(catalogoService).obtenerDto((short) 1);
        verify(catalogoService).obtenerDto((short) 10);
        verify(usuarioService).obtenerDTO(usuario);
    }

    @Test
    void actualizarEmpleado_noDebeGuardarSiElCorreoUsuarioYaExiste() {
        Usuario usuario = new Usuario();
        usuario.setId(7);
        usuario.setNombreUsuario("maria.directora@ucr.ac.cr");
        usuario.setContrasena("hash");
        usuario.setActivo(true);

        Empleado empleado = new Empleado();
        empleado.setId(15);
        empleado.setIdUsuario(usuario);
        empleado.setNombreCompleto("María Directora Prueba");
        empleado.setIdentificacion("111111111");
        empleado.setIdCodigoTipoId((short) 1);
        empleado.setPais("CR");
        empleado.setCorreo("maria.directora@ucr.ac.cr");
        empleado.setNumeroTelefono("88887777");
        empleado.setIdCodigoTipoGradoAcademico((short) 10);

        EmpleadoDTO dto = new EmpleadoDTO(
                15,
                "María Directora Actualizada",
                "111111111",
                new CodigoDTO((short) 1, "NACIONAL", "Nacional"),
                "CR",
                "correo.existente@ucr.ac.cr",
                "88889999",
                new CodigoDTO((short) 10, "LICENCIATURA", "Licenciatura"),
                new UsuarioDTO(
                        7,
                        "correo.existente@ucr.ac.cr",
                        "",
                        List.of(new RolDTO((short) 1, "DIRECCION"))
                )
        );

        when(empleadoRepository.findById(15)).thenReturn(Optional.of(empleado));
        when(usuarioService.existeNombreUsuario("correo.existente@ucr.ac.cr")).thenReturn(true);

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> empleadoService.actualizarEmpleado(dto)
        );

        assertEquals(
                "El nombre de usuario 'correo.existente@ucr.ac.cr' ya se encuentra registrado",
                exception.getMessage()
        );

        verify(empleadoRepository).findById(15);
        verify(usuarioService).existeNombreUsuario("correo.existente@ucr.ac.cr");
        verify(usuarioService, never()).actualizarUsuario(any(UsuarioDTO.class));
        verify(empleadoRepository, never()).save(any(Empleado.class));
    }
}