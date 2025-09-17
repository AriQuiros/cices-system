package org.example.backend_cices_system.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.*;
import org.example.backend_cices_system.dto.*;
import org.example.backend_cices_system.logic.*;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

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
}
