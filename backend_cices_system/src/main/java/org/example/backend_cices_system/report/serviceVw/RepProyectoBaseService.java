package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.dto.ProyectoDatosDTO;
import org.example.backend_cices_system.dto.ProyectoFechasDTO;
import org.example.backend_cices_system.report.dao.RepProyectoBaseRepository;
import org.example.backend_cices_system.report.view.RepInvestigadorProyecto;
import org.example.backend_cices_system.report.view.RepProyectoBase;
import org.example.backend_cices_system.service.PermisoProyectoService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RepProyectoBaseService {

    private final RepProyectoBaseRepository repo;
    private final RepInvestigadorProyectoService repInvestigadorProyectoService;
    private final PermisoProyectoService permisoProyectoService;

    public RepProyectoBaseService(RepProyectoBaseRepository repo,
                                  RepInvestigadorProyectoService repInvestigadorProyectoService,
                                  PermisoProyectoService permisoProyectoService) {
        this.repo = repo;
        this.repInvestigadorProyectoService = repInvestigadorProyectoService;
        this.permisoProyectoService = permisoProyectoService;
    }

    public List<RepProyectoBase> obtenerTodos() {
        return repo.findAll();
    }

    public List<ProyectoFechasDTO> obtenerTodos_fechas() {
        return repo.findAll().stream()
                .map(p -> new ProyectoFechasDTO(
                        p.getCodigoProyecto(),
                        p.getNombreProyecto(),
                        p.getFechaInicio(),
                        p.getFechaFinalizacion()
                ))
                .collect(Collectors.toList());
    }

    public RepProyectoBase buscarPorId(Integer idProyecto) {
        return repo.findById(idProyecto).orElse(null);
    }

    public RepProyectoBase buscarPorCodigoProyecto(String codigoProyecto) {
        return repo.findByCodigoProyecto(codigoProyecto);
    }

    public List<RepProyectoBase> buscarPorNombreProyecto(String nombreProyecto) {
        return repo.findByNombreProyectoContainingIgnoreCase(nombreProyecto);
    }

    public List<ProyectoFechasDTO> obtenerProyectosInvestigador(Integer id){
        return repInvestigadorProyectoService.buscarPorIdInvestigador(id).stream()
                .map(p -> new ProyectoFechasDTO(
                        p.getCodigoProyecto(),
                        p.getNombreProyecto(),
                        p.getFechaInicio(),
                        p.getFechaFinalizacion()
                )).toList();
    }

    public List<ProyectoFechasDTO> proyectosPrincipalInvestigador(Integer id){

        return repInvestigadorProyectoService
                .buscarPorIdInvestigador(id)
                .stream()
                .filter(p -> "PRINCIPAL".equalsIgnoreCase(p.getRolProyecto())
                        || permisoProyectoService.existByInvestigadorProyectoId(p.getIdInvestigadorProyecto()))
                .map(p -> new ProyectoFechasDTO(
                        p.getCodigoProyecto(),
                        p.getNombreProyecto(),
                        p.getFechaInicio(),
                        p.getFechaFinalizacion()
                ))
                .toList();
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

    public List<ProyectoDatosDTO> proyectosListadoInvestigador(Integer id){

        List<Integer> idsInvestigador = repInvestigadorProyectoService
                .buscarPorIdInvestigador(id)
                .stream()
                .map(RepInvestigadorProyecto::getIdProyecto)
                .toList();

        return repo.findAll().stream()
                .filter(p -> idsInvestigador.contains(p.getIdProyecto()))
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


}

