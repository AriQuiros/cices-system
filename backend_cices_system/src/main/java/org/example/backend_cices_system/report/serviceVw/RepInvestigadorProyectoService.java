package org.example.backend_cices_system.report.serviceVw;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.ProyectoDatosDTO;
import org.example.backend_cices_system.dto.ProyectoFechasDTO;
import org.example.backend_cices_system.report.dao.RepInvestigadorProyectoRepository;
import org.example.backend_cices_system.report.dto.ProyectoInvestigadorDTO;
import org.example.backend_cices_system.report.filter.InvestigadorProyectoFiltroDTO;
import org.example.backend_cices_system.report.filter.ProyectoFiltroDTO;
import org.example.backend_cices_system.report.specification.ProyectoSpecification;
import org.example.backend_cices_system.report.view.RepInvestigadorProyecto;
import org.example.backend_cices_system.report.view.RepProyectoBase;
import org.example.backend_cices_system.reportes.dto.InvestigadorReporteDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepInvestigadorProyectoService {

    private final RepInvestigadorProyectoRepository repo;
    private final RepProyectoBaseService repProyectoBaseService;
    private final RepPersonaUsuariaService repPersonaUsuariaService;

    public Integer obtenerIdInvestigador(Integer idUsuario){
        return repPersonaUsuariaService.obtenerPorIdUsuario(idUsuario).getIdInvestigador();
    }

    public List<RepInvestigadorProyecto> buscarPorIdentificacionInvestigador(String idInvestigador) {
        return repo.findByIdentificacion(idInvestigador);
    }

    public List<InvestigadorReporteDTO> obtenerPorCodigoProyecto(String codigoProyecto){
        return repo.findByCodigoProyecto(codigoProyecto)
                .stream().map(this::obtenerInvestigadorReporteDTO).toList();
    }

    public List<ProyectoFechasDTO> obtenerInvestigadorProyectos(Integer idInvestigador,
                                                                ProyectoFiltroDTO filtro,
                                                                Pageable pageable) {
        var ids = repo.findByIdInvestigador(idInvestigador)
                .stream()
                .map(RepInvestigadorProyecto::getIdProyecto)
                .distinct()
                .toList();
        return repProyectoBaseService
                .obtenerPorIdsConFiltro(ids, filtro, pageable)
                .map(repProyectoBaseService::obtenerProyectoFechasDTO)
                .getContent();
    }

    public List<ProyectoFechasDTO> obtenerProyectosPrincipalOPermiso(
            Integer idInvestigador,
            ProyectoFiltroDTO filtro,
            Pageable pageable
    ) {

        // 1. Obtener IDs filtrados por rol/permisos
        List<Integer> ids = repo.findByIdInvestigador(idInvestigador)
                .stream()
                .filter(r ->
                        "PRINCIPAL".equalsIgnoreCase(r.getRolProyecto())
                                || r.getIdPermisoProyecto() != null
                )
                .map(RepInvestigadorProyecto::getIdProyecto)
                .distinct()
                .toList();

        if (ids.isEmpty()) return List.of();

        return repProyectoBaseService
                .obtenerPorIdsConFiltro(ids, filtro, pageable)
                .map(repProyectoBaseService::obtenerProyectoFechasDTO)
                .getContent();
    }

    public Page<ProyectoInvestigadorDTO> obtenerInvestigadorProyectos(
            Integer idInvestigador,
            InvestigadorProyectoFiltroDTO filtro,
            Pageable pageable
    ) {
        ProyectoFiltroDTO proyectoFiltro = new ProyectoFiltroDTO(
                filtro.texto(),
                filtro.estado(),
                filtro.tipos(),
                filtro.lineas(),
                filtro.ordenFecha()
        );

        Page<RepProyectoBase> proyectosPage =
                repProyectoBaseService.obtenerTodos(
                        ProyectoSpecification.filtrar(proyectoFiltro),
                        pageable
                );

        List<RepProyectoBase> proyectos = proyectosPage.getContent();

        if (proyectos.isEmpty()) {
            return Page.empty(pageable);
        }
        List<Integer> ids = proyectos.stream()
                .map(RepProyectoBase::getIdProyecto)
                .toList();

        List<RepInvestigadorProyecto> relaciones =
                repo.findByIdProyectoIn(ids);

        List<RepInvestigadorProyecto> relacionesFiltradas =
                relaciones.stream()
                        .filter(r -> r.getIdInvestigador().equals(idInvestigador))
                        .filter(r -> filtroRol(r, filtro.rol()))
                        .filter(r -> filtroFechas(r, filtro.desde(), filtro.hasta()))
                        .toList();

        // 5. AGRUPAR POR PROYECTO
        Map<Integer, RepInvestigadorProyecto> relacionPorProyecto =
                relacionesFiltradas.stream()
                        .collect(Collectors.toMap(
                                RepInvestigadorProyecto::getIdProyecto,
                                r -> r,
                                (r1, r2) -> r1 // si hay duplicados, toma uno
                        ));

        return proyectosPage.map(p -> {

            RepInvestigadorProyecto r =
                    relacionPorProyecto.get(p.getIdProyecto());

            return new ProyectoInvestigadorDTO(
                    new ProyectoDatosDTO(
                            p.getIdProyecto(),
                            p.getCodigoProyecto(),
                            p.getNombreProyecto(),
                            p.getLineaInvestigacion(),
                            p.getTipoProyecto(),
                            p.getEstadoProyecto(),
                            p.getFechaInicio(),
                            p.getFechaFinalizacion()
                    ),
                    r != null ? r.getRolProyecto() : null,
                    r != null ? r.getFechaInicioInvestigador() : null,
                    r != null ? r.getFechaFinInvestigador() : null
            );
        });
    }

    public InvestigadorReporteDTO obtenerInvestigadorReporteDTO(RepInvestigadorProyecto investigadorProyecto){
        return new InvestigadorReporteDTO(
                investigadorProyecto.getIdInvestigador(),
                investigadorProyecto.getIdentificacion(),
                investigadorProyecto.getNombreInvestigador(),
                investigadorProyecto.getRolProyecto(),
                investigadorProyecto.getActividadProyecto(),
                investigadorProyecto.getFechaInicioInvestigador(),
                investigadorProyecto.getFechaFinPermiso()
        );
    }

    // Metodo principal: obtener datos por varios proyectos
    public Map<Integer, List<InvestigadorReporteDTO>> obtenerPorProyectos(List<Integer> ids) {

        if (ids == null || ids.isEmpty()) {
            return Map.of();
        }

        List<RepInvestigadorProyecto> filas = repo.findByIdProyectoIn(ids);

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

    private boolean filtroRol(RepInvestigadorProyecto r, String rol) {
        return rol == null || rol.isBlank()
                || r.getRolProyecto().equalsIgnoreCase(rol);
    }

    private boolean filtroFechas(
            RepInvestigadorProyecto r,
            LocalDate desde,
            LocalDate hasta
    ) {

        boolean cumpleDesde = (desde == null)
                || !r.getFechaInicioInvestigador().isBefore(desde);

        boolean cumpleHasta = (hasta == null)
                || (r.getFechaFinInvestigador() != null
                && !r.getFechaFinInvestigador().isAfter(hasta));

        return cumpleDesde && cumpleHasta;
    }


}
