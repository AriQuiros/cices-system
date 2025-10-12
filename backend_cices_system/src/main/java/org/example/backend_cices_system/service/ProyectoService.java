package org.example.backend_cices_system.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.*;
import org.example.backend_cices_system.dto.*;
import org.example.backend_cices_system.logic.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
    private final PresentacionInformeRepository presentacionInformeRepo;
    private final UsuarioRepository usuarioRepo;
    private final InvestigadorRepository invRepo;
    private final InvestigadorProyectoRepository invProyRepo;

    public Proyecto obtenerProyectoPorCodigo(String codigo) {
        return proyectoRepo.findByCodigoProyecto(codigo).orElse(null);
    }

    @Transactional
    public Proyecto guardarProyecto(ProyectoDTO dto) {
        if (proyectoRepo.findByCodigoProyecto(dto.getCodigo()).isPresent()) {
            throw new IllegalArgumentException("El código del proyecto ya se encuentra registrado");
        }
        // Guardar proyecto base
        Proyecto proyecto = new Proyecto();
        proyecto.setNombreProyecto(dto.getNombre());
        proyecto.setCodigoProyecto(dto.getCodigo());
        proyecto.setDescripcionProyecto(dto.getDescripcion());
        proyecto.setObjetivoGeneral(dto.getObjetivoGeneral());
        proyecto.setFechaInicio(dto.getFechaInicio());
        proyecto.setFechaFinalizacion(dto.getFechaFinalizacion());
        Short idEstado = catalogoService.obtenerIdCodigoPorTipoYValor("ESTADO PROYECTO", dto.getEstado());
        Short idTipoProyecto = catalogoService.obtenerIdCodigoPorTipoYValor("TIPO PROYECTO", dto.getTipo());

        proyecto.setIdCodigoEstado(idEstado);
        proyecto.setIdCodigoTipoProyecto(idTipoProyecto);
        proyecto.setLineaInvestigacion(dto.getLineaInvestigacion());
        proyecto.setDetallesProyectos(dto.getDetalles());

        proyecto = proyectoRepo.save(proyecto);

        // Guardar objetivos
        Set<ObjetivoEspecifico> objetivos = new HashSet<>();
        for (ObjetivoEspecificoDTO objetivoDTO : dto.getObjetivosEspecificos()) {
            ObjetivoEspecifico objetivo = new ObjetivoEspecifico();
            objetivo.setIdProyecto(proyecto);
            objetivo.setTipo(objetivoDTO.getCategoria());
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
        if (dto.getPresentacionesInformes() != null) {
            for (InformeDTO informeDTO : dto.getPresentacionesInformes()) {
                if (informeDTO.getFechaPresentacion() == null || informeDTO.getDescripcion().isEmpty()) {
                    continue;  // Si la fecha está vacía o nula, simplemente no se guarda este informe
                }
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

    public List<ProyectoDTO> obtenerProyectos_PresupuestoForm() {
        Short idEstado = catalogoService.obtenerIdCodigoPorTipoYValor("ESTADO PROYECTO", "ACTIVO");
        return proyectoRepo.findByIdCodigoEstado(idEstado).stream()
                .map(proyecto -> {
                    ProyectoDTO dto = new ProyectoDTO();
                    dto.setIdProyecto(proyecto.getId());
                    dto.setCodigo(proyecto.getCodigoProyecto());
                    dto.setNombre(proyecto.getNombreProyecto());
                    dto.setFechaInicio(proyecto.getFechaInicio());
                    dto.setFechaFinalizacion(proyecto.getFechaFinalizacion());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<ProyectoDTO> misProyectos(String username) {
        var u = usuarioRepo.findActiveByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no activo"));
        var inv = invRepo.findByIdEmpleado(u.getIdEmpleado())
                .orElseThrow(() -> new RuntimeException("No es investigador"));

        var ids = invProyRepo.findProyectoIdsByInvestigador(inv); // ← solo IDs (sin CLOB)
        if (ids.isEmpty()) return List.of();

        return proyectoRepo.findAllById(ids).stream()
                .map(this::toDTO)
                .toList();
    }

    private ProyectoDTO toDTO(Proyecto p) {
        var dto = new ProyectoDTO();
        dto.setCodigo(p.getCodigoProyecto());
        dto.setNombre(p.getNombreProyecto());
        dto.setFechaInicio(p.getFechaInicio());
        dto.setFechaFinalizacion(p.getFechaFinalizacion());
        dto.setLineaInvestigacion(p.getLineaInvestigacion());
        return dto;
    }

    /********CONSULTA DE PROYECTOS***********/

    /***********CONSULTA GENRERAL DE TODOS LOS PROYECTOS**********/
    public List<ProyectoDTO> obtenerTodosLosProyectos() {
        return proyectoRepo.findAll().stream()
                .map(this::obtenerDTO)
                .toList();
    }

    public ProyectoDTO obtenerDTO(Proyecto proyecto){

        ProyectoDTO proyectoDTO = new ProyectoDTO();
        proyectoDTO.setIdProyecto(proyecto.getId());
        proyectoDTO.setCodigo(proyecto.getCodigoProyecto());
        proyectoDTO.setNombre(proyecto.getNombreProyecto());
        proyectoDTO.setFechaInicio(proyecto.getFechaInicio());
        proyectoDTO.setFechaFinalizacion(proyecto.getFechaFinalizacion());
        proyectoDTO.setLineaInvestigacion(proyecto.getLineaInvestigacion());
        return proyectoDTO;
    }

    /**************CONSULTA DE UN PROYECTO ESPECIFICO***************/

    public Proyecto proyectoPorId(Short id){
        return proyectoRepo.findProyectoById(id);
    }

    public List<EntidadProyecto> listaDeEntidades(Proyecto proyecto) {
        return entidadProyectoRepo.findEntidadProyectoByIdProyecto(proyecto);
    }

    public CodigoDTO obtenerEstado(Short id){
        return catalogoService.obtenerCodigoPorId(id);
    }

    public CodigoDTO obtenerTipoUnidad(Short id){
        return catalogoService.obtenerCodigoPorId(id);
    }

    public ProyectoDTO obtenerProyectoDTOPorId(Short id){
        Proyecto proyecto = proyectoPorId(id);

        ProyectoDTO proyectoDTO = new ProyectoDTO();
        proyectoDTO.setCodigo(proyecto.getCodigoProyecto());
        proyectoDTO.setNombre(proyecto.getNombreProyecto());
        proyectoDTO.setFechaInicio(proyecto.getFechaInicio());
        proyectoDTO.setFechaFinalizacion(proyecto.getFechaFinalizacion());
        proyectoDTO.setLineaInvestigacion(proyecto.getLineaInvestigacion());
        proyectoDTO.setEstado(obtenerEstado(proyecto.getIdCodigoEstado()).getValor());
        proyectoDTO.setDescripcion(proyecto.getDescripcionProyecto());
        proyectoDTO.setObjetivoGeneral(proyecto.getObjetivoGeneral());
        proyectoDTO.setDetalles(proyecto.getDetallesProyectos());

        List<EntidadVinculadaDTO> entidadesDTO = listaDeEntidades(proyecto).stream()
                .map(ep -> new EntidadVinculadaDTO(ep.getIdEntidad().getNombre(),
                        obtenerTipoUnidad(ep.getIdEntidad().getIdCodigoTipo()).getValor()))
                .collect(Collectors.toList());
        proyectoDTO.setEntidadesVinculadas(entidadesDTO);

        return proyectoDTO;
    }

}
