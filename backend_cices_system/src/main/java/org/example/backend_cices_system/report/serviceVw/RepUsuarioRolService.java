package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.report.dao.RepUsuarioRolRepository;
import org.example.backend_cices_system.report.view.RepUsuarioRol;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepUsuarioRolService {

    private final RepUsuarioRolRepository repo;

    public RepUsuarioRolService(RepUsuarioRolRepository repo) {
        this.repo = repo;
    }

    public List<RepUsuarioRol> obtenerTodos() {
        return repo.findAll();
    }

    public RepUsuarioRol buscarPorId(Integer idRolUsuario) {
        return repo.findById(idRolUsuario).orElse(null);
    }

    public List<RepUsuarioRol> buscarPorIdUsuario(Integer idUsuario) {
        return repo.findByIdUsuario(idUsuario);
    }

    public List<RepUsuarioRol> buscarPorNombreUsuario(String nombreUsuario) {
        return repo.findByNombreUsuario(nombreUsuario);
    }
}
