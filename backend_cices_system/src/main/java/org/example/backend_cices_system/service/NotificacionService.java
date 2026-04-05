package org.example.backend_cices_system.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.NotificacionRepository;
import org.example.backend_cices_system.data.NotificacionUsuarioRepository;
import org.example.backend_cices_system.dto.CodigoDTO;
import org.example.backend_cices_system.dto.NotificacionDTO;
import org.example.backend_cices_system.dto.UsuarioDTO;
import org.example.backend_cices_system.logic.Notificacion;
import org.example.backend_cices_system.logic.NotificacionUsuario;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class NotificacionService {
    private final NotificacionRepository notificacionRepository;
    private final CatalogoService catalogoService;

    @Transactional
    public Notificacion guardarNotificacion(NotificacionDTO notificacionDTO) {
        var notificacion = new Notificacion();

        var categoria = codigoPorCategoria(notificacionDTO.categoria());
        notificacion.setIdCodigoTipoCategoria(categoria);

        notificacion.setIdCodigoTipoPrioridad(notificacionDTO.prioridad().id());
        notificacion.setAsunto(notificacionDTO.asunto());
        notificacion.setMensaje(notificacionDTO.mensaje());
        notificacion.setFechaCreacion(notificacionDTO.fechaCreacion());

        notificacionRepository.save(notificacion);

        return notificacion;
    }

    public NotificacionDTO obtenerDTO(Notificacion notificacion){
        return new NotificacionDTO(
                notificacion.getId(),
                catalogoService.obtenerDto(notificacion.getIdCodigoTipoCategoria()).valor(),
                catalogoService.obtenerDto(notificacion.getIdCodigoTipoPrioridad()),
                notificacion.getAsunto(),
                notificacion.getMensaje(),
                notificacion.getFechaCreacion()
        );
    }

    public Short codigoPorCategoria(String categoria){
        return catalogoService.codigoXNombreValor("CATEGORIA_NOTIFICACION", categoria);
    }
}
