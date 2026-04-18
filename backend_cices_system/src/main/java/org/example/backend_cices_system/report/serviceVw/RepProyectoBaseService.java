package org.example.backend_cices_system.report.serviceVw;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.ProyectoDatosDTO;
import org.example.backend_cices_system.dto.ProyectoFechasDTO;
import org.example.backend_cices_system.report.dao.RepProyectoBaseRepository;
import org.example.backend_cices_system.report.specification.ProyectoSpecification;
import org.example.backend_cices_system.report.view.RepInvestigadorProyecto;
import org.example.backend_cices_system.report.view.RepProyectoBase;
import org.example.backend_cices_system.service.PermisoProyectoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepProyectoBaseService {

    private final RepProyectoBaseRepository repo;
    private final RepInvestigadorProyectoService repInvestigadorProyectoService;

    public Page<RepProyectoBase> obtenerTodos(
            Specification<RepProyectoBase> spec,
            Pageable pageable) {
        return repo.findAll(spec, pageable);
    }

    public List<ProyectoFechasDTO> obtenerTodos_fechas() {
        return repo.findAll().stream()
                .map(this::obtenerProyectoFechasDTO)
                .collect(Collectors.toList());
    }

    public List<ProyectoDatosDTO> proyectosListado(){
        return repo.findAll().stream()
                .map(p -> new ProyectoDatosDTO(
                        p.getIdProyecto(),
                        p.getCodigoProyecto(),
                        p.getNombreProyecto(),
                        p.getLineaInvestigacion(),
                        p.getTipoProyecto(),
                        p.getEstadoProyecto(),
                        p.getFechaInicio(),
                        p.getFechaFinalizacion()
                ))
                .toList();
    }

    public Page<ProyectoDatosDTO> buscarConFiltros(
            String texto,
            String estado,
            List<String> tipos,
            List<String> lineas,
            Pageable pageable
    ) {

        Specification<RepProyectoBase> spec = ProyectoSpecification.filtrar(
                texto, estado, tipos, lineas
        );

        return repo.findAll(spec, pageable)
                .map(p -> new ProyectoDatosDTO(
                        p.getIdProyecto(),
                        p.getCodigoProyecto(),
                        p.getNombreProyecto(),
                        p.getLineaInvestigacion(),
                        p.getTipoProyecto(),
                        p.getEstadoProyecto(),
                        p.getFechaInicio(),
                        p.getFechaFinalizacion()
                ));
    }

    public List<RepProyectoBase> buscarPorIds(List<Integer> idsProyectos) {
        return repo.findByIdProyectoIn(idsProyectos);
    }

    public ProyectoFechasDTO obtenerProyectoFechasDTO(RepProyectoBase p){
        return new ProyectoFechasDTO(
                p.getCodigoProyecto(),
                p.getNombreProyecto(),
                p.getFechaInicio(),
                p.getFechaFinalizacion()
        );
    }
}

