package org.example.backend_cices_system.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.PermisoProyectoRepository;
import org.example.backend_cices_system.dto.PermisoProyectoDTO;
import org.example.backend_cices_system.logic.InvestigadorProyecto;
import org.example.backend_cices_system.logic.PermisoProyecto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PermisoProyectoService {

    private final PermisoProyectoRepository permisoProyectoRepository;
    private final InvestigadorProyectoService  investigadorProyectoService;
    private final NotificacionUsuarioService notificacionUsuarioService;

    public List<PermisoProyecto> getAll() {
        return permisoProyectoRepository.findAll();
    }

    public PermisoProyecto getById(Integer id) {
        return permisoProyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permiso no encontrado"));
    }

    public boolean existsById(Integer id) {
        return permisoProyectoRepository.existsById(id);
    }

    public PermisoProyectoDTO save(PermisoProyectoDTO permisoDto) {
        var permisoProyecto = new PermisoProyecto();

        var investigadorProyecto =
                investigadorProyectoService.obtenerInvestigadorProyecto
                        (permisoDto.investigadorProyectoDTO().id());

        permisoProyecto.setIdInvestigadorProyecto(investigadorProyecto);
        permisoProyecto.setFechaInicioPermiso(permisoDto.fechaInicio());
        permisoProyecto.setFechaFinPermiso(permisoDto.fechaFin());

        permisoProyectoRepository.save(permisoProyecto);

        generarNotificacionPermiso(permisoProyecto);

        return permisoDto;
    }

    public void generarNotificacionPermiso(PermisoProyecto permiso){
        var usuario = permiso.getIdInvestigadorProyecto().getIdInvestigador().getIdEmpleado().getIdUsuario();
        var codigoProyecto = permiso.getIdInvestigadorProyecto().getIdProyecto().getCodigoProyecto();

        var mensaje = "Se ha otorgado el permiso 'COORDINADOR' en el proyecto '" + codigoProyecto +
                "' durante el periodo del " + permiso.getFechaInicioPermiso() + " a";

        mensaje = permiso.getFechaFinPermiso() != null ? mensaje + "l " + permiso.getFechaInicioPermiso() : mensaje + " indefinido. ";

        notificacionUsuarioService.guardarNotificacionPermiso(usuario, codigoProyecto, mensaje);
    }

    public void delete(Integer id) {
        if (existsById(id))
            permisoProyectoRepository.deleteById(id);
    }

    public boolean existByInvestigadorProyecto(InvestigadorProyecto inv){
        return permisoProyectoRepository.existsByIdInvestigadorProyecto(inv);
    }

    public boolean existByInvestigadorProyectoId(Integer idInvestigadorProyecto){
        return permisoProyectoRepository.existsByIdInvestigadorProyecto_Id(idInvestigadorProyecto);
    }

    public PermisoProyectoDTO obtenerDTO(PermisoProyecto permisoProyecto){
        return new PermisoProyectoDTO(
                permisoProyecto.getId(),
                investigadorProyectoService.obtenerDTO(permisoProyecto.getIdInvestigadorProyecto()),
                permisoProyecto.getFechaInicioPermiso(),
                permisoProyecto.getFechaFinPermiso()
        );
    }

    public List<PermisoProyecto> obtenerPorCodigoProyecto(String codigoProyecto){
        return permisoProyectoRepository.findByIdInvestigadorProyecto_IdProyecto_CodigoProyecto(codigoProyecto);
    }

    public List<PermisoProyectoDTO> obtenerDTOsPorCodigoProyecto(String codigoProyecto){
        return obtenerPorCodigoProyecto(codigoProyecto).stream()
                .map(this::obtenerDTO).toList();
    }
}