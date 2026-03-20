package org.example.backend_cices_system.service;

import jakarta.transaction.Transactional;
import org.example.backend_cices_system.data.HorasAsignadasRepository;
import org.example.backend_cices_system.data.ProyectoRepository;
import org.example.backend_cices_system.dto.InvestigadorHorasDTO;
import org.example.backend_cices_system.dto.ProyectoDTO;
import org.example.backend_cices_system.dto.ResumenHorasProyectoDTO;
import org.example.backend_cices_system.logic.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProyectoService {
    private final EntidadService entidadService;
    private final ProyectoRepository proyectoRepository;
    private final HorasAsignadasRepository horasRepository;
    private final EntidadProyectoService entidadProyectoService;
    private final ObjetivosEspecificosService objetivosEspecificosService;
    private final PresentacionInformeService presentacionInformeService;
    private final CatalogoService catalogoService;
    /// -------------------------------------------
    private final PresupuestoService presupuestoService;
    private final InvestigadorService investigadorService;
    private final InvestigadorProyectoService investigadorProyectoService;
    private final DocumentoService documentoService;


    public ProyectoService(ProyectoRepository proyectoRepository, HorasAsignadasRepository horasRepository, EntidadProyectoService entidadProyectoService,
                           ObjetivosEspecificosService objetivosEspecificosService, EntidadService entidadService,
                           PresentacionInformeService presentacionInformeService, CatalogoService catalogoService,
                           PresupuestoService presupuestoService, InvestigadorProyectoService investigadorProyectoService,
                           InvestigadorService investigadorService, DocumentoService documentoService) {
        this.horasRepository = horasRepository;
        this.catalogoService = catalogoService;
        this.proyectoRepository = proyectoRepository;
        this.entidadService = entidadService;
        this.entidadProyectoService = entidadProyectoService;
        this.objetivosEspecificosService = objetivosEspecificosService;
        this.presentacionInformeService = presentacionInformeService;

        this.investigadorService = investigadorService;
        this.investigadorProyectoService = investigadorProyectoService;
        this.presupuestoService = presupuestoService;
        this.documentoService = documentoService;
    }

    @Transactional
    public Proyecto guardarProyecto(ProyectoDTO proyectoDTO, List<MultipartFile> documentos) {
        var codigo = proyectoDTO.codigoProyecto();
        var idProyecto = proyectoDTO.id();
        if(existeProyecto(codigo) && idProyecto == null)
            throw new IllegalStateException("El codigo de proyecto '" + codigo + "' ya se encuentra registrado");

        var proyecto = idProyecto!=null ? obtenerProyecto(idProyecto):new Proyecto();

        proyecto.setCodigoProyecto(codigo);
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

        guardarOpcionales(proyectoDTO, proyecto, documentos);

        return proyecto;
    }

    private void guardarOpcionales(ProyectoDTO dto, Proyecto proyecto, List<MultipartFile> documentos) {
        if (dto.entidadesVinculadas() != null && !dto.entidadesVinculadas().isEmpty()) {
            for (var entidadDTO : dto.entidadesVinculadas()) {
                Entidad entidad = entidadService.guardarEntidad(entidadDTO);
                entidadProyectoService.guardarEntidadProyecto(proyecto, entidad);
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
                var investigador = investigadorService.buscarPorIdentificacion(investigadorDTO.identificacionInvestigador());
                investigadorProyectoService.guardarInvestigadorProyecto(investigadorDTO, investigador, proyecto);
            }
        }

        if (documentos != null && !documentos.isEmpty()) {
            documentoService.guardarDocumentos(proyecto, documentos);
        }
    }

    public Proyecto buscarProyectoPorCodigo(String codigoProyecto) {
        return proyectoRepository.findByCodigoProyecto(codigoProyecto)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado para codigo " + codigoProyecto));
    }

    public List<Proyecto> obtenerProyectos() {
        return proyectoRepository.findAll();
    }

    public List<String> obtenerLineasInvestigacion() {
        return proyectoRepository.findDistinctLineasInvestigacion();
    }

    public Proyecto obtenerProyecto(Integer id){
        return proyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
    }

    public Proyecto obtenerProyectoPorCodigo(String codigo){
        return proyectoRepository.findByCodigoProyecto(codigo)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado para codigo: " + codigo));
    }

    private Short obtenerEstadoProyecto(LocalDate fechaFinalizacion) {
        LocalDate hoy = LocalDate.now();
        String estado = fechaFinalizacion.isBefore(hoy) ? "FINALIZADO" : "ACTIVO";
        return catalogoService.codigoXNombreValor("ESTADO_PROYECTO", estado);
    }

    private boolean existeProyecto(String codigoProyecto){
        return proyectoRepository.existsByCodigoProyecto(codigoProyecto);
    }

    private ProyectoDTO obtenerDTO (Proyecto proyecto){
        return new ProyectoDTO(
                proyecto.getId(),
                proyecto.getCodigoProyecto(),
                proyecto.getNombreProyecto(),
                proyecto.getDescripcionProyecto(),
                proyecto.getObjetivoGeneral(),
                proyecto.getFechaInicio(),
                proyecto.getFechaFinalizacion(),
                proyecto.getLineaInvestigacion(),
                catalogoService.obtenerDto(proyecto.getIdCodigoTipoProyecto()),
                catalogoService.obtenerDto(proyecto.getIdCodigoTipoEstado()),
                proyecto.getDetallesProyectos(),
                objetivosEspecificosService.objetivoEspecificoDTOList(proyecto),
                new ArrayList<>(),
                documentoService.documentoDTOList(proyecto),
                entidadProyectoService.obtenerEntidadesProyecto(proyecto),
                presentacionInformeService.informeDTOList(proyecto),
                new ArrayList<>()
        );
    }

    public ProyectoDTO obtenerProyectoCompleto(String codigo){
        var proyecto = obtenerProyectoPorCodigo(codigo);
        return obtenerDTO(proyecto);
    }

    public ResumenHorasProyectoDTO obtenerResumenHoras(Integer idProyecto) {

        Proyecto proyecto = proyectoRepository.findById(idProyecto)
                .orElseThrow();

        List<Object[]> filas = horasRepository.obtenerHorasAsignadasProyecto(idProyecto);

        List<InvestigadorHorasDTO> lista = filas.stream()
                .map(f -> new InvestigadorHorasDTO(
                        ((Number) f[0]).intValue(),
                        (String) f[1],
                        (String) f[2],
                        ((Number) f[3]).doubleValue(),
                        ((Number) f[4]).shortValue()
                ))
                .toList();

        Double totalAsignadas = horasRepository.totalHorasAsignadas(idProyecto);
        Double totalPresupuesto = horasRepository.totalHorasPresupuestadas(idProyecto);

        Double disponibles = totalPresupuesto - totalAsignadas;

        return new ResumenHorasProyectoDTO(
                proyecto.getNombreProyecto(),
                totalAsignadas,
                disponibles,
                lista
        );
    }
}