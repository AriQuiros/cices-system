package org.example.backend_cices_system.service.entity;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.repository.entity.UsuarioRepository;
import org.example.backend_cices_system.dto.entity.UsuarioDTO;
import org.example.backend_cices_system.model.entity.Usuario;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder encoder;
    private final RolUsuarioService rolUsuarioService;

    public boolean existeNombreUsuario(String nombreUsuario) {
        return usuarioRepository.existsByNombreUsuario(nombreUsuario);
    }

    public Usuario guardarUsuario(UsuarioDTO usuarioDTO) {
        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(usuarioDTO.nombreUsuario());
        usuario.setContrasena(encoder.encode(usuarioDTO.contrasena()));
        usuario.setActivo(true);

        usuarioRepository.save(usuario);

        rolUsuarioService.guardarRoles(usuario, usuarioDTO.roles());

        return usuario;
    }

    public Optional<Usuario> obtenerUsuarioActivo(String username){
        return usuarioRepository.findByActivoTrueAndNombreUsuario(username);
    }

    public Usuario obtenerPorNombreUsuario(String username){
        return usuarioRepository.findByNombreUsuario(username)
                .orElseThrow(() -> new IllegalStateException("No se encontró un usuario: '" + username + "'"));
    }

    public void cambiarEstadoUsuario(Integer id, boolean activo){
        var usuario = obtenerUsuario(id);
        usuario.setActivo(activo);
        usuarioRepository.save(usuario);
    }

    public Usuario obtenerUsuario(Integer id){
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("No se encontró un usuario con el id '" + id + "'"));
    }

    public UsuarioDTO obtenerDTO(Usuario usuario){
        return new UsuarioDTO(usuario.getId(),
                usuario.getNombreUsuario(),
                "",
                rolUsuarioService.obtenerRolesDTOUsuario(usuario)
                );
    }

    @Transactional
    public Usuario actualizarUsuario(UsuarioDTO dto) {
        Usuario usuario = obtenerUsuario(dto.id());

        usuario.setNombreUsuario(dto.nombreUsuario());

        return usuarioRepository.save(usuario);
    }

    public Usuario cambiarContrasena(Usuario usuario, String contrasena){
        usuario.setContrasena(encoder.encode(contrasena));
        return usuarioRepository.save(usuario);
    }

}
