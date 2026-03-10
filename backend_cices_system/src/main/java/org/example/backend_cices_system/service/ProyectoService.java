package org.example.backend_cices_system.service;

import jakarta.transaction.Transactional;
import org.example.backend_cices_system.data.EntidadProyectoRepository;
import org.example.backend_cices_system.data.ProyectoRepository;
import org.example.backend_cices_system.dto.ProyectoDTO;
import org.example.backend_cices_system.dto.ProyectoDatosDTO;
import org.example.backend_cices_system.logic.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ProyectoService {
    private final EntidadService entidadService;
    private final ProyectoRepository proyectoRepository;
    private final EntidadProyectoRepository entidadProyectoRepository;
    private final ObjetivosEspecificosService objetivosEspecificosService;
    private final PresentacionInformeService presentacionInformeService;
    private final CatalogoService catalogoService;
    /// -------------------------------------------
    private final PresupuestoService presupuestoService;
    private final InvestigadorService investigadorService;
    private final InvestigadorProyectoService investigadorProyectoService;
    private final DocumentoService documentoService;

    public ProyectoService(ProyectoRepository proyectoRepository, EntidadProyectoRepository entidadProyectoRepository,
                           ObjetivosEspecificosService objetivosEspecificosService, EntidadService entidadService,
                           PresentacionInformeService presentacionInformeService, CatalogoService catalogoService,
                           PresupuestoService presupuestoService, InvestigadorProyectoService investigadorProyectoService,
                           InvestigadorService investigadorService, DocumentoService documentoService) {
        this.catalogoService = catalogoService;
        this.proyectoRepository = proyectoRepository;
        this.entidadService = entidadService;
        this.entidadProyectoRepository = entidadProyectoRepository;
        this.objetivosEspecificosService = objetivosEspecificosService;
        this.presentacionInformeService = presentacionInformeService;

        this.investigadorService = investigadorService;
        this.investigadorProyectoService = investigadorProyectoService;
        this.presupuestoService = presupuestoService;
        this.documentoService = documentoService;
    }

    @Transactional
    public Proyecto guardarProyecto(ProyectoDTO proyectoDTO) {
        var proyecto = new Proyecto();

        proyecto.setCodigoProyecto(proyectoDTO.codigoProyecto());
        proyecto.setNombreProyecto(proyectoDTO.nombreProyecto());
        proyecto.setDescripcionProyecto(proyectoDTO.descripcion());
        proyecto.setObjetivoGeneral(proyectoDTO.objetivoGeneral());
        proyecto.setLineaInvestigacion(proyectoDTO.lineaInvestigacion());
        proyecto.setFechaInicio(proyectoDTO.fechaInicio());
        proyecto.setFechaFinalizacion(proyectoDTO.fechaFinalizacion());
        proyecto.setDetallesProyectos(proyectoDTO.detalles());

        proyecto.setIdCodigoTipoProyecto(proyectoDTO.tipoProyecto().id());
        var estado = obtenerEstadoProyecto(proyectoDTO.fechaFinalizacion());
        proyecto.setIdCodigoTipoEstado(estado);

        proyectoRepository.save(proyecto);

        for(var objetivoDTO : proyectoDTO.objetivosEspecificos()) {
            objetivosEspecificosService.guardarObjetivoEspecifico(objetivoDTO, proyecto);
        }

        guardarOpcionales(proyectoDTO, proyecto);

        return proyecto;
    }

    private void guardarOpcionales(ProyectoDTO dto, Proyecto proyecto) {
        if (dto.entidadesVinculadas() != null && !dto.entidadesVinculadas().isEmpty()) {
            for (var entidadDTO : dto.entidadesVinculadas()) {
                var entidadProyecto = new EntidadProyecto();
                entidadProyecto.setIdProyecto(proyecto);
                Entidad entidad = entidadService.guardarEntidad(entidadDTO);
                entidadProyecto.setIdEntidad(entidad);
                entidadProyectoRepository.save(entidadProyecto);
            }
        }

        if (dto.presentacionesInformes() != null && !dto.presentacionesInformes().isEmpty()) {
            for (var informeDTO : dto.presentacionesInformes()) {
                presentacionInformeService.guardarPresentacionInforme(informeDTO, proyecto);
            }
        }

        if (dto.presupuestos() != null && !dto.presupuestos().isEmpty()) {
            presupuestoService.guardarPresupuesto(dto.presupuestos(), proyecto);
        }

        if (dto.investigadoresVinculados() != null && !dto.investigadoresVinculados().isEmpty()) {
            for (var investigadorDTO : dto.investigadoresVinculados()) {
                Investigador investigador = investigadorService.buscarPorIdentificacion(investigadorDTO.identificacionInvestigador());
                investigadorProyectoService.guardarInvestigadorProyecto(investigadorDTO, investigador, proyecto);
            }
        }

        // documentos
    }

    public Proyecto buscarProyectoPorCodigo(String codigoProyecto) {
        return proyectoRepository.findByCodigoProyecto(codigoProyecto)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
    }

    public List<Proyecto> obtenerProyectos() {
        return proyectoRepository.findAll();
    }

    public List<String> obtenerLineasInvestigacion() {
        return proyectoRepository.findDistinctLineasInvestigacion();
    }

    public List<ProyectoDatosDTO> obtenerProyectosDatos() {
        return proyectoRepository.findAll().stream()
                .map(p -> new ProyectoDatosDTO(p.getId(),
                        p.getCodigoProyecto(),
                        p.getNombreProyecto(),
                        p.getLineaInvestigacion(),
                        catalogoService.obtenerDto(p.getIdCodigoTipoProyecto()),
                        catalogoService.obtenerDto(p.getIdCodigoTipoEstado()),
                        p.getFechaInicio(),
                        p.getFechaFinalizacion()
                ))
                .toList();
    }

    public Proyecto obtenerProyecto(Integer id){
        return proyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
    }

    private Short obtenerEstadoProyecto(LocalDate fechaFinalizacion) {
        LocalDate hoy = LocalDate.now();
        String estado = fechaFinalizacion.isBefore(hoy) ? "FINALIZADO" : "ACTIVO";
        return catalogoService.codigoXNombreValor("ESTADO_PROYECTO", estado);
    }

}