package org.example.backend_cices_system.consult.proyecto.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.proyecto.dto.DocumentoDTO;
import org.example.backend_cices_system.modules.proyecto.dto.ProyectoDatosDTO;
import org.example.backend_cices_system.modules.proyecto.dto.ProyectoFechasDTO;
import org.example.backend_cices_system.export.dto.*;
import org.example.backend_cices_system.consult.proyecto.repository.RepProyectoBaseRepository;
import org.example.backend_cices_system.consult.proyecto.dto.ProyectoFiltroDTO;
import org.example.backend_cices_system.consult.proyecto.specification.ProyectoSpecification;
import org.example.backend_cices_system.consult.proyecto.view.RepProyectoBase;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RepProyectoBaseService {

    private final RepProyectoBaseRepository repo;

    public RepProyectoBase buscarPorId(Integer idProyecto) {
        return repo.findById(idProyecto)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado con ID: " + idProyecto));
    }

    public RepProyectoBase buscarPorCodigo(String codigoProyecto) {
        return repo.findByCodigoProyecto(codigoProyecto)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado con código: " + codigoProyecto));
    }

    public List<RepProyectoBase> buscarPorIds(List<Integer> idsProyectos) {
        return repo.findByIdProyectoIn(idsProyectos);
    }

    public Page<RepProyectoBase> obtenerPaginaFiltrada(ProyectoFiltroDTO filtroDTO, Pageable pageable) {
        Specification<RepProyectoBase> spec = ProyectoSpecification.filtrar(filtroDTO);
        Pageable pageableConOrden = construirPageableConOrden(filtroDTO, pageable);
        return repo.findAll(spec, pageableConOrden);
    }

    // sin paginación
    public List<Integer> buscarIdsPorFiltros(ProyectoFiltroDTO filtroDTO) {
        return repo.findAll(ProyectoSpecification.filtrar(filtroDTO))
                .stream()
                .map(RepProyectoBase::getIdProyecto)
                .toList();
    }

    public Page<ProyectoDatosDTO> buscarConFiltros(ProyectoFiltroDTO filtroDTO, Pageable pageable) {
        return obtenerPaginaFiltrada(filtroDTO, pageable)
                .map(this::mapToProyectoDatosDTO);
    }

    public List<ProyectoFechasDTO> obtenerProyectosFechasDTOs(ProyectoFiltroDTO filtroDTO, Pageable pageable) {
        return obtenerPaginaFiltrada(filtroDTO, pageable)
                .map(this::mapToProyectoFechasDTO)
                .stream()
                .toList();
    }

    private Pageable construirPageableConOrden(ProyectoFiltroDTO filtroDTO, Pageable pageable) {

        Sort sort = Sort.unsorted();

        if (filtroDTO.ordenFecha() != null && !filtroDTO.ordenFecha().isBlank()) {
            sort = filtroDTO.ordenFecha().equalsIgnoreCase("asc")
                    ? Sort.by("fechaInicio").ascending()
                    : Sort.by("fechaInicio").descending();
        }

        return PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sort
        );
    }

    private ProyectoDatosDTO mapToProyectoDatosDTO(RepProyectoBase p) {
        return new ProyectoDatosDTO(
                p.getIdProyecto(),
                p.getCodigoProyecto(),
                p.getNombreProyecto(),
                p.getLineaInvestigacion(),
                p.getTipoProyecto(),
                p.getEstadoProyecto(),
                p.getFechaInicio(),
                p.getFechaFinalizacion()
        );
    }

    private ProyectoFechasDTO mapToProyectoFechasDTO(RepProyectoBase p) {
        return new ProyectoFechasDTO(
                p.getCodigoProyecto(),
                p.getNombreProyecto(),
                p.getFechaInicio(),
                p.getFechaFinalizacion()
        );
    }

    public ProyectoReporteDTO obtenerProyectoReporteDTO(
            RepProyectoBase proyecto,
            List<InvestigadorReporteDTO> investigadores,
            List<EntidadReporteDTO> entidades,
            List<PresupuestoReporteDTO> presupuestos,
            List<ObjetivoReporteDTO> objetivos,
            List<DocumentoDTO> documentos,
            List<InformeReporteDTO> informes
    ) {
        return new ProyectoReporteDTO(
                proyecto.getCodigoProyecto(),
                proyecto.getNombreProyecto(),
                proyecto.getDescripcionProyecto(),
                proyecto.getObjetivoGeneral(),
                proyecto.getLineaInvestigacion(),
                proyecto.getTipoProyecto(),
                proyecto.getEstadoProyecto(),
                proyecto.getFechaInicio(),
                proyecto.getFechaFinalizacion(),
                investigadores,
                entidades,
                presupuestos,
                objetivos,
                documentos,
                informes
        );
    }
}