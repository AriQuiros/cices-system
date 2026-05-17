package org.example.backend_cices_system.modules.proyecto.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.export.dto.EntidadReporteDTO;
import org.example.backend_cices_system.modules.proyecto.repository.EntidadProyectoRepository;
import org.example.backend_cices_system.shared.entidad.EntidadDTO;
import org.example.backend_cices_system.shared.entidad.Entidad;
import org.example.backend_cices_system.modules.proyecto.model.EntidadProyecto;
import org.example.backend_cices_system.modules.proyecto.model.Proyecto;
import org.example.backend_cices_system.shared.entidad.EntidadService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EntidadProyectoService {

    private final EntidadProyectoRepository entidadProyectoRepository;
    private final EntidadService entidadService;

    @Transactional
    public void guardarEntidadProyecto(Proyecto proyecto, Entidad entidad) {
        if (existeEntidadProyecto(proyecto.getId(), entidad.getId())) {
            return;
        }

        var entidadProyecto = new EntidadProyecto();
        entidadProyecto.setIdProyecto(proyecto);
        entidadProyecto.setIdEntidad(entidad);

        entidadProyectoRepository.save(entidadProyecto);
    }

    public boolean existeEntidadProyecto(Integer idProyecto, Integer idEntidad) {
        return entidadProyectoRepository.existsByIdProyecto_IdAndIdEntidad_Id(idProyecto, idEntidad);
    }

    public List<EntidadDTO> obtenerEntidadesProyecto(Proyecto proyecto){
        return entidadProyectoRepository.findEntidadProyectoByIdProyecto(proyecto).stream()
                .map(e -> entidadService.obtenerDTO(e.getIdEntidad())).toList();
    }

    public List<EntidadReporteDTO> obtenerEntidadesReportePorProyecto(Integer idProyecto) {
        return entidadProyectoRepository.findByIdProyecto_IdIn(List.of(idProyecto))
                .stream()
                .map(ep -> toReporteDTO(ep))
                .toList();
    }

    public Map<Integer, List<EntidadReporteDTO>> obtenerPorProyectos(List<Integer> idsProyectos) {
        if (idsProyectos == null || idsProyectos.isEmpty()) return Map.of();

        return entidadProyectoRepository.findByIdProyecto_IdIn(idsProyectos)
                .stream()
                .collect(Collectors.groupingBy(
                        ep -> ep.getIdProyecto().getId(),
                        Collectors.mapping(ep -> toReporteDTO(ep), Collectors.toList())
                ));
    }

    private EntidadReporteDTO toReporteDTO(EntidadProyecto ep) {
        Entidad entidad = ep.getIdEntidad();
        String tipo = entidad.getIdCodigoTipoEntidad() != null
                ? entidadService.obtenerDTO(entidad).tipo().despliegue()
                : null;
        return new EntidadReporteDTO(entidad.getNombre(), tipo);
    }
}