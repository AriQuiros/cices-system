package org.example.backend_cices_system.service;

import jakarta.transaction.Transactional;
import org.example.backend_cices_system.data.RolUsuarioRepository;
import org.example.backend_cices_system.data.UsuarioRepository;
import org.example.backend_cices_system.dto.RolDTO;
import org.example.backend_cices_system.dto.UsuarioDTO;
import org.example.backend_cices_system.logic.Rol;
import org.example.backend_cices_system.logic.RolUsuario;
import org.example.backend_cices_system.logic.Usuario;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.beans.Encoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service

public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder encoder;
    private final RolUsuarioRepository rolUsuarioRepository;
    private final RolService rolService;

    public UsuarioService(UsuarioRepository usuarioRepository, RolUsuarioRepository rolUsuarioRepository,
                          RolService rolService, PasswordEncoder encoder) {
        this.usuarioRepository = usuarioRepository;
        this.encoder = encoder;
        this.rolUsuarioRepository = rolUsuarioRepository;
        this.rolService = rolService;
    }

    boolean existeNombreUsuario(String nombreUsuario) {
        return usuarioRepository.findByNombreUsuario(nombreUsuario).isPresent();
    }

    Usuario obtenerXNombreUsuario(String nombreUsuario) {
        return usuarioRepository.findByNombreUsuario(nombreUsuario).orElse(null);
    }

    public Usuario guardarUsuario(UsuarioDTO usuarioDTO) {
        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(usuarioDTO.nombreUsuario());
        usuario.setContrasena(encoder.encode(usuarioDTO.contrasena()));
        usuario.setActivo(true);

        usuarioRepository.save(usuario);

        guardarRoles(usuario, usuarioDTO.roles());

        return usuario;
    }

    List<String> obtenerRolesUsuarioPorIdUsuario(Integer id){
        return rolUsuarioRepository.findRoleNamesByUsuarioId(id);
    }

    List<RolDTO> obtenerRolesDTOUsuario(Usuario usuario){
        var rolesUsuario= rolUsuarioRepository.findByIdUsuario(usuario);
        var roles = new ArrayList<RolDTO>();
        for(RolUsuario rolUsuario: rolesUsuario){
            roles.add(new RolDTO(rolUsuario.getIdRol().getId(), rolUsuario.getIdRol().getNombreRol()));
        }
        return roles;
    }

    public void guardarRoles(Usuario usuario, List<RolDTO> roles) {
        for (RolDTO rolDto : roles) {
            Rol rol = rolService.obtenerRol(rolDto.id());

            RolUsuario rolUsuario = new RolUsuario();
            rolUsuario.setIdUsuario(usuario);
            rolUsuario.setIdRol(rol);

            rolUsuarioRepository.save(rolUsuario);
        }
    }

    public Optional<Usuario> obtenerUsuarioActivo(String username){
        return usuarioRepository.findByActivoTrueAndNombreUsuario(username);
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
                obtenerRolesDTOUsuario(usuario)
                );
    }

    @Transactional
    public Usuario actualizarUsuario(UsuarioDTO dto) {
        Usuario usuario = obtenerUsuario(dto.id());

        usuario.setNombreUsuario(dto.nombreUsuario());

        return usuarioRepository.save(usuario);
    }
}
