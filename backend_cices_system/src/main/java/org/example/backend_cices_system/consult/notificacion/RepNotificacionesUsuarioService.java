package org.example.backend_cices_system.consult.notificacion;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RepNotificacionesUsuarioService {

    private final RepNotificacionesUsuarioRepository repo;

    public Page<RepNotificacionesUsuario> buscarConFiltro(
            Integer idUsuario,
            NotificacionFiltroDTO filtro,
            Pageable pageable
    ) {
        var spec = NotificacionSpecification.filtrar(idUsuario, filtro);
        return repo.findAll(spec, pageable);
    }

    public long contarNoLeidas(Integer idUsuario) {
        var filtroNoLeidas = new NotificacionFiltroDTO(null, false, null);
        var spec = NotificacionSpecification.filtrar(idUsuario, filtroNoLeidas);
        return repo.count(spec);
    }
}