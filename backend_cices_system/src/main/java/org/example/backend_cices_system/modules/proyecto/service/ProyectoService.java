package org.example.backend_cices_system.modules.proyecto.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.presupuesto.service.PresupuestoService;
import org.example.backend_cices_system.modules.proyecto.model.Proyecto;
import org.example.backend_cices_system.modules.proyecto.repository.ProyectoRepository;
import org.example.backend_cices_system.modules.proyecto.dto.ProyectoDTO;
import org.example.backend_cices_system.shared.catalogo.CatalogoService;
import org.example.backend_cices_system.shared.entidad.Entidad;
import org.example.backend_cices_system.shared.entidad.EntidadService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProyectoService {
    private final EntidadService entidadService;
    private final ProyectoRepository proyectoRepository;
    private final EntidadProyectoService entidadProyectoService;
    private final ObjetivosEspecificosService objetivosEspecificosService;
    private final PresentacionInformeService presentacionInformeService;
    private final CatalogoService catalogoService;
    /// -------------------------------------------
    private final PresupuestoService presupuestoService;
    private final DocumentoService documentoService;

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

    private boolean existeProyecto(String codigoProyecto){
        return proyectoRepository.existsByCodigoProyecto(codigoProyecto);
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

        if (documentos != null && !documentos.isEmpty()) {
            documentoService.guardarDocumentos(proyecto, documentos);
        }
    }

    private Short obtenerEstadoProyecto(LocalDate fechaFinalizacion) {
        LocalDate hoy = LocalDate.now();
        String estado = fechaFinalizacion.isBefore(hoy) ? "FINALIZADO" : "ACTIVO";
        return catalogoService.codigoXNombreValor("ESTADO_PROYECTO", estado);
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

}