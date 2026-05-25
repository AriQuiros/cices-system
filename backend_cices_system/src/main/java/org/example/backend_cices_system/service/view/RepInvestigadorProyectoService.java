package org.example.backend_cices_system.service.view;

import lombok.RequiredArgsConstructor;
import org.checkerframework.checker.nullness.qual.NonNull;
import org.example.backend_cices_system.dto.entity.ProyectoDatosDTO;
import org.example.backend_cices_system.dto.entity.ProyectoFechasDTO;
import org.example.backend_cices_system.repository.view.RepInvestigadorProyectoRepository;
import org.example.backend_cices_system.dto.view.ProyectoInvestigadorDTO;
import org.example.backend_cices_system.dto.filter.InvestigadorProyectoFiltroDTO;
import org.example.backend_cices_system.dto.filter.ProyectoFiltroDTO;
import org.example.backend_cices_system.repository.specification.InvestigadorProyectoSpecification;
import org.example.backend_cices_system.model.view.RepInvestigadorProyecto;
import org.example.backend_cices_system.dto.export.InvestigadorReporteDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepInvestigadorProyectoService {

    private final RepInvestigadorProyectoRepository repo;
    private final RepPersonaUsuariaService repPersonaUsuariaService;

    public Integer obtenerIdInvestigador(Integer idUsuario){
        return repPersonaUsuariaService.obtenerPorIdUsuario(idUsuario).getIdInvestigador();
    }

    public List<RepInvestigadorProyecto> buscarPorIdentificacionInvestigador(String idInvestigador) {
        return repo.findByIdentificacion(idInvestigador);
    }

    public Page<InvestigadorReporteDTO> obtenerPorCodigoProyecto(
            String codigoProyecto,
            Pageable pageable,
            String ordenPor,
            String direccion
    ) {

        Sort sort = construirSort(ordenPor, direccion);

        Pageable finalPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sort
        );

        return repo.findByCodigoProyecto(codigoProyecto, finalPageable)
                .map(this::obtenerInvestigadorReporteDTO);
    }

    public Page<ProyectoFechasDTO> obtenerProyectosInvestigadorLigero(
            Integer idInvestigador,
            ProyectoFiltroDTO filtro,
            boolean soloPrincipalOPermiso,
            Pageable pageable
    ) {

        var spec = getInvestigadorProyectoSpecification(idInvestigador, filtro, soloPrincipalOPermiso);

        Sort sort = construirSort("fechaInicio", filtro.ordenFecha());

        Pageable finalPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sort
        );

        return repo.findAll(spec, finalPageable)
                .map(this::obtenerProyectoFechasDTO);
    }

    private static @NonNull Specification<RepInvestigadorProyecto> getInvestigadorProyectoSpecification(Integer idInvestigador, ProyectoFiltroDTO filtro, boolean soloPrincipalOPermiso) {
        InvestigadorProyectoFiltroDTO invFiltro =
                new InvestigadorProyectoFiltroDTO(idInvestigador, null, null, null);

        var spec = InvestigadorProyectoSpecification.filtrar(filtro, invFiltro);

        if (soloPrincipalOPermiso) {
            spec = spec.and((root, query, cb) ->
                    cb.or(
                            cb.equal((root.get("rolProyecto")), "PRINCIPAL"),
                            cb.isNotNull(root.get("idPermisoProyecto"))
                    )
            );
        }
        return spec;
    }

    public Page<ProyectoInvestigadorDTO> obtenerInvestigadorProyectos(
            Integer idInvestigador,
            ProyectoFiltroDTO proyectoFiltro,
            InvestigadorProyectoFiltroDTO filtroInv,
            Pageable pageable
    ) {
        var investigadorFiltro =
                new InvestigadorProyectoFiltroDTO(idInvestigador, filtroInv.rol(), filtroInv.desde(), filtroInv.hasta());

        var spec = InvestigadorProyectoSpecification.filtrar(
                proyectoFiltro,
                investigadorFiltro
        );

        Sort sort = construirSort("fecha", proyectoFiltro.ordenFecha());

        Pageable finalPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sort
        );

        return repo.findAll(spec, finalPageable)
                .map(this::mapToDTO);
    }

    private Sort construirSort(String ordenarPor, String direccion) {
        Sort.Direction dir = "desc".equalsIgnoreCase(direccion)
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        return switch (ordenarPor) {
            case "fecha" -> Sort.by(dir, "fechaInicioInvestigador");
            case "rol" -> Sort.by(dir, "rolProyecto");
            default -> Sort.unsorted();
        };
    }

    public InvestigadorReporteDTO obtenerInvestigadorReporteDTO(RepInvestigadorProyecto investigadorProyecto){
        return new InvestigadorReporteDTO(
                investigadorProyecto.getIdInvestigadorProyecto(),
                investigadorProyecto.getIdentificacion(),
                investigadorProyecto.getNombreInvestigador(),
                investigadorProyecto.getRolProyecto(),
                investigadorProyecto.getActividadProyecto(),
                investigadorProyecto.getFechaInicioInvestigador(),
                investigadorProyecto.getFechaFinInvestigador()
        );
    }

    // Metodo principal: obtener datos por varios proyectos
    public Map<Integer, List<InvestigadorReporteDTO>> obtenerPorProyectos(List<Integer> ids) {

        if (ids == null || ids.isEmpty()) {
            return Map.of();
        }

        List<RepInvestigadorProyecto> filas = repo.findByIdProyectoInOrderByRolProyectoDesc(ids);

        return filas.stream()
                .collect(Collectors.groupingBy(
                        RepInvestigadorProyecto::getIdProyecto,
                        Collectors.mapping(this::obtenerInvestigadorReporteDTO, Collectors.toList())
                ));
    }

    // Metodo secundario: reutiliza el metodo anterior para un solo proyecto
    public List<InvestigadorReporteDTO> obtenerPorProyecto(Integer idProyecto) {
        if (idProyecto == null) return List.of();

        List<RepInvestigadorProyecto> filas = repo.findByIdProyecto(idProyecto);
        if (filas == null || filas.isEmpty()) return List.of();

        return filas.stream()
                .map(this::obtenerInvestigadorReporteDTO)
                .toList();
    }

    public ProyectoFechasDTO obtenerProyectoFechasDTO(RepInvestigadorProyecto p) {
        return new ProyectoFechasDTO(
                p.getCodigoProyecto(),
                p.getNombreProyecto(),
                p.getFechaInicio(),
                p.getFechaFinalizacion()
        );
    }

    private ProyectoInvestigadorDTO mapToDTO(RepInvestigadorProyecto r) {
        return new ProyectoInvestigadorDTO(
                new ProyectoDatosDTO(
                        r.getIdProyecto(),
                        r.getCodigoProyecto(),
                        r.getNombreProyecto(),
                        r.getLineaInvestigacion(),
                        r.getTipoProyecto(),
                        r.getEstadoProyecto(),
                        r.getFechaInicio(),
                        r.getFechaFinalizacion()
                ),
                r.getRolProyecto(),
                r.getFechaInicioInvestigador(),
                r.getFechaFinInvestigador()
        );
    }

}
