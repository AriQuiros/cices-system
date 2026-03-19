package org.example.backend_cices_system.service;

import jakarta.transaction.Transactional;
import org.example.backend_cices_system.data.*;
import org.example.backend_cices_system.dto.*;
import org.example.backend_cices_system.logic.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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

    private final ObjetivoEspecificoRepository objetivoEspecificoRepository;
    private final MetaRepository metaRepository;
    private final PresentacionInformeRepository presentacionInformeRepository;
    private final PresupuestoRepository presupuestoRepository;
    private final InvestigadorProyectoRepository investigadorProyectoRepository;
    private final DocumentoRepository documentoRepository;


    public ProyectoService(ProyectoRepository proyectoRepository, EntidadProyectoRepository entidadProyectoRepository,
                           ObjetivosEspecificosService objetivosEspecificosService, EntidadService entidadService,
                           PresentacionInformeService presentacionInformeService, CatalogoService catalogoService,
                           PresupuestoService presupuestoService, InvestigadorProyectoService investigadorProyectoService,
                           InvestigadorService investigadorService, DocumentoService documentoService, ObjetivoEspecificoRepository objetivoEspecificoRepository,
                           MetaRepository metaRepository,
                           PresentacionInformeRepository presentacionInformeRepository,
                           PresupuestoRepository presupuestoRepository,
                           InvestigadorProyectoRepository investigadorProyectoRepository,
                           DocumentoRepository documentoRepository
    )  {
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

        this.objetivoEspecificoRepository = objetivoEspecificoRepository;
        this.metaRepository = metaRepository;
        this.presentacionInformeRepository = presentacionInformeRepository;
        this.presupuestoRepository = presupuestoRepository;
        this.investigadorProyectoRepository = investigadorProyectoRepository;
        this.documentoRepository = documentoRepository;

    }

    @Transactional
    public Proyecto guardarProyecto(ProyectoDTO proyectoDTO, List<MultipartFile> documentos) {
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

        for (var objetivoDTO : proyectoDTO.objetivosEspecificos()) {
            objetivosEspecificosService.guardarObjetivoEspecifico(objetivoDTO, proyecto);
        }

        guardarOpcionales(proyectoDTO, proyecto, documentos);

        return proyecto;
    }



    private void guardarOpcionales(ProyectoDTO dto, Proyecto proyecto, List<MultipartFile> documentos) {
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
                Investigador investigador = investigadorService.buscarPorIdentificacion(
                        investigadorDTO.identificacionInvestigador()
                );
                investigadorProyectoService.guardarInvestigadorProyecto(investigadorDTO, investigador, proyecto);
            }
        }

        if (documentos != null && !documentos.isEmpty()) {
            documentoService.guardarDocumentosMultipart(documentos,proyecto);
        }
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

    public Proyecto obtenerProyecto(Integer id){
        return proyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
    }

    private Short obtenerEstadoProyecto(LocalDate fechaFinalizacion) {
        LocalDate hoy = LocalDate.now();
        String estado = fechaFinalizacion.isBefore(hoy) ? "FINALIZADO" : "ACTIVO";
        return catalogoService.codigoXNombreValor("ESTADO_PROYECTO", estado);
    }

    public ProyectoDTO obtenerProyectoPorCodigo(String codigo) {
        Proyecto p = proyectoRepository.findByCodigoProyecto(codigo)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Proyecto no encontrado"));

        List<ObjetivoEspecificoDTO> objetivos = objetivoEspecificoRepository
                .findObjetivoEspecificoByIdProyecto(p)
                .stream()
                .map(obj -> {
                    List<MetaDTO> metas = metaRepository.findMetaByIdObjetivoEspecifico(obj)
                            .stream()
                            .map(meta -> new MetaDTO(
                                    meta.getId(),
                                    meta.getIdCodigoTipoMeta() != null
                                            ? new CodigoDTO(meta.getIdCodigoTipoMeta(), String.valueOf(meta.getIdCodigoTipoMeta()), null)
                                            : null,
                                    meta.getCantidad(),
                                    meta.getDescripcion(),
                                    List.of()
                            ))
                            .toList();

                    return new ObjetivoEspecificoDTO(
                            obj.getId(),
                            null,
                            obj.getDescripcion(),
                            metas
                    );
                })
                .toList();

        List<PresupuestoDTO> presupuestos = presupuestoRepository
                .findPresupuestosByIdProyecto_Id(p.getId())
                .stream()
                .map(pres -> new PresupuestoDTO(
                        pres.getId(),
                        pres.getDescripcion(),
                        pres.getIdCodigoTipoCategoria() != null
                                ? new CodigoDTO(pres.getIdCodigoTipoCategoria(), String.valueOf(pres.getIdCodigoTipoCategoria()), null)
                                : null,
                        pres.getFechaAsignacion(),
                        pres.getIdCodigoTipoPresupuesto() != null
                                ? new CodigoDTO(pres.getIdCodigoTipoPresupuesto(), String.valueOf(pres.getIdCodigoTipoPresupuesto()), null)
                                : null,
                        pres.getIdCodigoTipoFuenteFinanciamiento() != null
                                ? new CodigoDTO(pres.getIdCodigoTipoFuenteFinanciamiento(), String.valueOf(pres.getIdCodigoTipoFuenteFinanciamiento()), null)
                                : null,
                        pres.getMontoAsignado(),
                        pres.getCantidadHorasMes(),
                        pres.getCantidadMeses(),
                        List.of(),
                        List.of()
                ))
                .toList();

        List<DocumentoDTO> documentos = documentoRepository
                .findDocumentoByIdProyecto(p)
                .stream()
                .map(doc -> new DocumentoDTO(
                        doc.getId(),
                        doc.getNombreDocumento(),
                        doc.getDirectorio()
                ))
                .toList();

        List<EntidadDTO> entidades = entidadProyectoRepository
                .findEntidadProyectoByIdProyecto(p)
                .stream()
                .map(ep -> {
                    Entidad ent = ep.getIdEntidad();
                    return new EntidadDTO(
                            ent.getId(),
                            ent.getNombre(),
                            ent.getIdCodigoTipoEntidad() != null
                                    ? new CodigoDTO(ent.getIdCodigoTipoEntidad(), String.valueOf(ent.getIdCodigoTipoEntidad()), null)
                                    : null
                    );
                })
                .toList();

        List<InformeDTO> informes = presentacionInformeRepository
                .findPresentacionInformeByIdProyecto(p)
                .stream()
                .map(inf -> new InformeDTO(
                        inf.getId(),
                        inf.getIdCodigoTipoInforme() != null
                                ? new CodigoDTO(inf.getIdCodigoTipoInforme(), String.valueOf(inf.getIdCodigoTipoInforme()), null)
                                : null,
                        inf.getFechaPresentacion(),
                        inf.getIdCodigoTipoEstado() != null
                                ? new CodigoDTO(inf.getIdCodigoTipoEstado(), String.valueOf(inf.getIdCodigoTipoEstado()), null)
                                : null
                ))
                .toList();

        List<InvestigadorProyectoDTO> investigadores = investigadorProyectoRepository
                .findByIdProyecto(p)
                .stream()
                .map(inv -> new InvestigadorProyectoDTO(
                        inv.getId(),
                        inv.getIdInvestigador() != null ? inv.getIdInvestigador().getIdEmpleado().getIdentificacion() : null,
                        inv.getIdInvestigador() != null ? inv.getIdInvestigador().getIdEmpleado().getNombreCompleto() : null,
                        p.getCodigoProyecto(),
                        inv.getIdRolProyecto() != null
                                ? new RolProyectoDTO(
                                inv.getIdRolProyecto().getId(),
                                inv.getIdRolProyecto().getNombreRolProyecto()
                        )
                                : null,
                        inv.getActividadProyecto(),
                        inv.getFechaInicioInvestigador(),
                        inv.getFechaFinInvestigador()
                ))
                .toList();

        return new ProyectoDTO(
                p.getCodigoProyecto(),
                p.getNombreProyecto(),
                p.getDescripcionProyecto(),
                p.getObjetivoGeneral(),
                p.getFechaInicio(),
                p.getFechaFinalizacion(),
                p.getLineaInvestigacion(),
                p.getIdCodigoTipoProyecto() != null
                        ? new CodigoDTO(p.getIdCodigoTipoProyecto(), String.valueOf(p.getIdCodigoTipoProyecto()), null)
                        : null,
                p.getIdCodigoTipoEstado() != null
                        ? new CodigoDTO(p.getIdCodigoTipoEstado(), String.valueOf(p.getIdCodigoTipoEstado()), null)
                        : null,
                p.getDetallesProyectos(),
                objetivos,
                presupuestos,
                documentos,
                entidades,
                informes,
                investigadores
        );
    }

}