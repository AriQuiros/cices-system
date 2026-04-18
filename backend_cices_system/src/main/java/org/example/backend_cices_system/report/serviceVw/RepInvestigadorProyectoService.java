package org.example.backend_cices_system.report.serviceVw;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.InvestigadorProyectoDTO;
import org.example.backend_cices_system.dto.ProyectoDatosDTO;
import org.example.backend_cices_system.dto.ProyectoFechasDTO;
import org.example.backend_cices_system.dto.RolProyectoDTO;
import org.example.backend_cices_system.report.dao.RepInvestigadorProyectoRepository;
import org.example.backend_cices_system.report.filter.ProyectoFiltroDTO;
import org.example.backend_cices_system.report.specification.ProyectoSpecification;
import org.example.backend_cices_system.report.view.RepInvestigadorProyecto;
import org.example.backend_cices_system.report.view.RepProyectoBase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RepInvestigadorProyectoService {

    private final RepInvestigadorProyectoRepository repo;
    private final RepProyectoBaseService repProyectoBaseService;
    private final RepPersonaUsuariaService repPersonaUsuariaService;

    public List<RepInvestigadorProyecto> obtenerTodos() {
        return repo.findAll();
    }

    public Integer obtenerIdInvestigador(Integer idUsuario){
        return repPersonaUsuariaService.obtenerPorIdUsuario(idUsuario).getIdInvestigador();
    }

    public List<RepInvestigadorProyecto> buscarPorIdentificacionInvestigador(String idInvestigador) {
        return repo.findByIdentificacion(idInvestigador);
    }

    public List<ProyectoFechasDTO> obtenerProyectosPrincipalOCoordinadorFechas(Integer idInvestigador){

        List<RepProyectoBase> proyectos = obtenerProyectosBase(idInvestigador);

        return proyectos.stream()
                .map(repProyectoBaseService::obtenerProyectoFechasDTO)
                .toList();
    }

    public List<ProyectoFechasDTO> obtenerProyectosInvestigador(Integer idInvestigador){

        List<RepProyectoBase> proyectos = obtenerProyectosBase(idInvestigador);

        return proyectos.stream()
                .map(repProyectoBaseService::obtenerProyectoFechasDTO)
                .toList();
    }

    private List<RepProyectoBase> obtenerProyectosBase(Integer idInvestigador){

        List<Integer> ids = repo.findByIdInvestigador(idInvestigador)
                .stream()
                .filter(r ->
                        "PRINCIPAL".equalsIgnoreCase(r.getRolProyecto()) ||
                                r.getIdPermisoProyecto() != null
                )
                .map(RepInvestigadorProyecto::getIdProyecto)
                .distinct()
                .toList();

        if (ids.isEmpty()) {
            return List.of();
        }

        return repProyectoBaseService.buscarPorIds(ids);
    }

    public Page<ProyectoDatosDTO> obtenerProyectosDatosInvestigador(
            Integer idInvestigador,
            ProyectoFiltroDTO filtro,
            Pageable pageable
    ){

        List<Integer> ids = repo.findByIdInvestigador(idInvestigador)
                .stream()
                .map(RepInvestigadorProyecto::getIdProyecto)
                .distinct()
                .toList();

        if (ids.isEmpty()) {
            return Page.empty(pageable);
        }

        Specification<RepProyectoBase> spec =
                ProyectoSpecification.filtrar(
                        filtro.texto(),
                        filtro.estado(),
                        filtro.tipos(),
                        filtro.lineas()
                ).and((root, query, cb) -> root.get("idProyecto").in(ids));

        Page<RepProyectoBase> page =
                repProyectoBaseService.obtenerTodos(spec, pageable);

        return page.map(p -> new ProyectoDatosDTO(
                p.getIdProyecto(),
                p.getCodigoProyecto(),
                p.getNombreProyecto(),
                p.getEstadoProyecto(),
                p.getTipoProyecto(),
                p.getLineaInvestigacion(),
                p.getFechaInicio(),
                p.getFechaFinalizacion()
        ));
    }


}
