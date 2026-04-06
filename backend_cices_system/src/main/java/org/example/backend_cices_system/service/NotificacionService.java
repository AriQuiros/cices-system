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

import java.time.Clock;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class NotificacionService {
    private final NotificacionRepository notificacionRepository;
    private final CatalogoService catalogoService;
    private final Clock clock;

    @Transactional
    public Notificacion guardarNotificacion(NotificacionDTO notificacionDTO, Integer idReferencia, String clave) {
        if (existeClave(clave)) return obtenerNotificacionPorClave(clave);

        var notificacion = new Notificacion();

        var categoria = codigoPorCategoria(notificacionDTO.categoria());
        notificacion.setIdCodigoTipoCategoria(categoria);

        notificacion.setIdReferencia(idReferencia);
        notificacion.setClave(clave);
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
                null,
                notificacion.getAsunto(),
                notificacion.getMensaje(),
                notificacion.getFechaCreacion()
        );
    }

    public Short codigoPorCategoria(String categoria){
        return catalogoService.codigoXNombreValor("CATEGORIA_NOTIFICACION", categoria);
    }

    @Transactional
    public void eliminarNotificacionesAntiguas(LocalDate fechaLimite) {
        notificacionRepository.deleteByFechaCreacionBefore(fechaLimite);
    }

    public boolean existeNotificacionHoy(String clave) {
        return notificacionRepository.existsByClaveAndFechaCreacion(clave, LocalDate.now(clock));
    }

    public String crearClave(String categoria, Integer idReferencia, Integer dias){
        return categoria + "_" + idReferencia + "_" + dias;
    }

    public boolean existeClave(String clave){
        return notificacionRepository.existsByClave(clave);
    }

    public Notificacion obtenerNotificacionPorClave(String clave){
        return notificacionRepository.findByClave(clave).orElse(null);
    }
}
