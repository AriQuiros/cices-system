package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.report.dao.RepNotificacionesUsuarioRepository;
import org.example.backend_cices_system.report.view.RepNotificacionesUsuario;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepNotificacionesUsuarioService {

    private final RepNotificacionesUsuarioRepository repo;

    public RepNotificacionesUsuarioService(RepNotificacionesUsuarioRepository repo) {
        this.repo = repo;
    }

    public List<RepNotificacionesUsuario> obtenerTodos() {
        return repo.findAll();
    }

    public RepNotificacionesUsuario buscarPorId(Integer idNotificacionUsuario) {
        return repo.findById(idNotificacionUsuario).orElse(null);
    }

    public List<RepNotificacionesUsuario> buscarPorIdUsuario(Integer idUsuario) {
        return repo.findByIdUsuario(idUsuario);
    }

    public List<RepNotificacionesUsuario> buscarPorNombreUsuario(String nombreUsuario) {
        return repo.findByNombreUsuarioContainingIgnoreCase(nombreUsuario);
    }

    public List<RepNotificacionesUsuario> buscarPorAsunto(String asunto) {
        return repo.findByAsuntoContainingIgnoreCase(asunto);
    }
}
