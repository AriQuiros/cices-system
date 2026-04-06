package org.example.backend_cices_system.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.RolUsuarioRepository;
import org.example.backend_cices_system.dto.RolDTO;
import org.example.backend_cices_system.logic.RolUsuario;
import org.example.backend_cices_system.logic.Usuario;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RolUsuarioService {

    private final RolUsuarioRepository rolUsuarioRepository;
    private final RolService rolService;

    public List<String> obtenerRolesUsuarioPorIdUsuario(Integer id){
        return rolUsuarioRepository.findRoleNamesByUsuarioId(id);
    }

    public List<RolDTO> obtenerRolesDTOUsuario(Usuario usuario){
        var rolesUsuario = rolUsuarioRepository.findByIdUsuario(usuario);
        var roles = new ArrayList<RolDTO>();

        for(RolUsuario rolUsuario : rolesUsuario){
            roles.add(new RolDTO(
                    rolUsuario.getIdRol().getId(),
                    rolUsuario.getIdRol().getNombreRol()
            ));
        }

        return roles;
    }

    public void guardarRoles(Usuario usuario, List<RolDTO> roles) {
        for (RolDTO rolDto : roles) {
            var rol = rolService.obtenerRol(rolDto.id());

            RolUsuario rolUsuario = new RolUsuario();
            rolUsuario.setIdUsuario(usuario);
            rolUsuario.setIdRol(rol);

            rolUsuarioRepository.save(rolUsuario);
        }
    }

    public List<RolUsuario> obtenerRolesUsuarioPorNombreRol(String nombreRol){
        return rolUsuarioRepository.findByIdRol_NombreRolContainingIgnoreCase(nombreRol);
    }
}