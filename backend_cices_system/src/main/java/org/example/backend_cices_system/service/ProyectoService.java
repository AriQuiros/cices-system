package org.example.backend_cices_system.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.*;
import org.example.backend_cices_system.dto.*;
import org.example.backend_cices_system.logic.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class ProyectoService {

    private final ProyectoRepository proyectoRepo;
    private final ObjetivoEspecificoRepository objetivoRepo;
    private final MetaRepository metaRepo;
    private final IndicadorRepository indicadorRepo;
    private final EntidadRepository entidadRepo;
    private final EntidadProyectoRepository entidadProyectoRepo;
    private final CatalogoService catalogoService;
    private final DocumentoService documentoService;
    private final PresentacionInformeRepository presentacionInformeRepo;

    @Transactional
    public Proyecto guardarProyecto(ProyectoDTO dto) {
        if (proyectoRepo.findByCodigoProyecto(dto.getCodigoProyecto()).isPresent()) {
            throw new IllegalArgumentException("El código del proyecto ya se encuentra registrado");
        }
        // Guardar proyecto base
        Proyecto proyecto = new Proyecto();
        proyecto.setNombreProyecto(dto.getNombreProyecto());
        proyecto.setCodigoProyecto(dto.getCodigoProyecto());
        proyecto.setDescripcionProyecto(dto.getDescripcionProyecto());
        proyecto.setObjetivoGeneral(dto.getObjetivoGeneralProyecto());
        proyecto.setFechaInicio(dto.getFechaInicio());
        proyecto.setFechaFinalizacion(dto.getFechaFinalizacion());

        Short idEstado = catalogoService.obtenerIdCodigoPorTipoYValor("ESTADO PROYECTO", dto.getEstado());
        Short idTipoProyecto = catalogoService.obtenerIdCodigoPorTipoYValor("TIPO PROYECTO", dto.getTipoProyecto());

        proyecto.setIdCodigoEstado(idEstado);
        proyecto.setIdCodigoTipoProyecto(idTipoProyecto);
        proyecto.setLineaInvestigacion(dto.getLineaInvestigacion());
        proyecto.setDetallesProyectos(dto.getDetallesProyectos());

        proyecto = proyectoRepo.save(proyecto);

        // Guardar objetivos
        Set<ObjetivoEspecifico> objetivos = new HashSet<>();
        for (ObjetivoEspecificoDTO objetivoDTO : dto.getObjetivosEspecificos()) {
            ObjetivoEspecifico objetivo = new ObjetivoEspecifico();
            objetivo.setIdProyecto(proyecto);
            objetivo.setTipo(objetivoDTO.getTipo());
            objetivo.setDescripcion(objetivoDTO.getDescripcion());
            objetivo = objetivoRepo.save(objetivo);

            // Guardar metas
            for (MetaDTO metaDTO : objetivoDTO.getMetas()) {
                Meta meta = new Meta();
                meta.setIdObjetivo(objetivo);
                meta.setDescripcion(metaDTO.getDescripcion());

                Short tipoCodigo = catalogoService.obtenerIdCodigoPorTipoYValor("TIPO META", metaDTO.getTipo());
                meta.setIdCodigoTipo(tipoCodigo);
                meta.setCantidad(metaDTO.getCantidad().abs());

                meta = metaRepo.save(meta);

                // Guardar indicadores
                for (String indicadorDesc : metaDTO.getIndicadores()) {
                    Indicador indicador = new Indicador();
                    indicador.setIdMeta(meta);
                    indicador.setDescripcion(indicadorDesc);
                    indicadorRepo.save(indicador);
                }
            }

            objetivos.add(objetivo);
        }

        // Guardar entidades vinculadas
        for (EntidadVinculadaDTO entidadDTO : dto.getEntidadesVinculadas()) {
            Entidad entidad = obtenerEntidadPorNombreORegistrar(entidadDTO.getNombre(), entidadDTO.getTipo());

            EntidadProyecto entidadProyecto = new EntidadProyecto();
            entidadProyecto.setIdEntidad(entidad);
            entidadProyecto.setIdProyecto(proyecto);
            entidadProyectoRepo.save(entidadProyecto);
        }

        // Guardar presentaciones de informe
        if (dto.getPresentacionesInforme() != null) {
            for (InformeDTO informeDTO : dto.getPresentacionesInforme()) {
                PresentacionInforme informe = new PresentacionInforme();
                informe.setDescripcion(informeDTO.getDescripcion());
                informe.setFechaPresentacion(informeDTO.getFechaPresentacion());
                informe.setIdProyecto(proyecto);

                // Lógica para determinar si el informe ya fue entregado
                LocalDate hoy = LocalDate.now();
                String estado;

                if (informeDTO.getFechaPresentacion() != null && informeDTO.getFechaPresentacion().isBefore(hoy)) {
                    estado = "ENTREGADO";
                } else {
                    estado = "PENDIENTE";
                }

                Short idEstadoInforme = catalogoService.obtenerIdCodigoPorTipoYValor("ESTADO INFORME", estado);
                informe.setIdCodigoEstado(idEstadoInforme);

                presentacionInformeRepo.save(informe);
            }
        }

        return proyecto;
    }

    private Entidad obtenerEntidadPorNombreORegistrar(String nombre, String tipo) {
        String nombreLimpio = nombre.trim();
        return entidadRepo.findByNombreIgnoreCase(nombreLimpio)
                .orElseGet(() -> {
                    Entidad nuevaEntidad = new Entidad();
                    nuevaEntidad.setNombre(nombreLimpio);

                    Short tipoEntidad = catalogoService.obtenerIdCodigoPorTipoYValor("TIPO ENTIDAD", tipo);
                    nuevaEntidad.setIdCodigoTipo(tipoEntidad);

                    return entidadRepo.save(nuevaEntidad);
                });
    }

    public List<ProyectoDTO> obtenerTodosLosProyectos() {
        return proyectoRepo.findAll().stream()
                .map(this::obtenerDTO)
                .toList();
    }

    private ProyectoDTO obtenerDTO(Proyecto proyecto){
            ProyectoDTO proyectoDTO = new ProyectoDTO();
            proyectoDTO.setCodigoProyecto(proyecto.getCodigoProyecto());
            proyectoDTO.setNombreProyecto(proyecto.getNombreProyecto());
            proyectoDTO.setFechaInicio(proyecto.getFechaInicio());
            proyectoDTO.setFechaFinalizacion(proyecto.getFechaFinalizacion());
            proyectoDTO.setLineaInvestigacion(proyecto.getLineaInvestigacion());
            return proyectoDTO;
    }
}
