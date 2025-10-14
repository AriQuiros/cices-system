package org.example.backend_cices_system.service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.*;
import org.example.backend_cices_system.dto.*;
import org.example.backend_cices_system.logic.*;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;


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
    private final PresupuestoRepository presupuestoRepo;
    private final DocumentoRepository documentoRepo;
    private final RolProyectoRepository rolProyectoRepo;
    private final HorasAsignadasRepository horasAsignadasRepo;
    private final EntityManager em;
    private final CertificacionRepository certificacionRepo;

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

    public List<EntidadVinculadaDTO> listaEntidadesDTO(Proyecto proyecto) {
        return listaDeEntidades(proyecto).stream()
                .map(ep -> new EntidadVinculadaDTO(ep.getIdEntidad().getNombre(),
                        obtenerTipo(ep.getIdEntidad().getIdCodigoTipo()).getValor()))
                .collect(Collectors.toList());
    }

    public CodigoDTO obtenerTipo(Short id){
        return Optional.ofNullable(catalogoService.obtenerCodigoPorId(id)).orElse(null);
    }

    public List<ObjetivoEspecifico> listaDeObjetivosEspecificos(Proyecto proyecto) {
        return objetivoRepo.findObjetivoEspecificoByIdProyecto(proyecto);
    }

    public List<ObjetivoEspecificoDTO> listaDeObjetivosEspecificosDTO(Proyecto proyecto) {
        return listaDeObjetivosEspecificos(proyecto).stream()
                .map(ob -> {
                    ObjetivoEspecificoDTO dto = new ObjetivoEspecificoDTO(ob.getId(), ob.getTipo(), ob.getDescripcion());
                    dto.setMetas(listaDeMetasDTO(ob));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<Meta> listaDeMetas(ObjetivoEspecifico objetivoEspecifico){
        return metaRepo.findMetaByIdObjetivo(objetivoEspecifico);
    }

    public List<Indicador> listaDeIndicadores(Meta meta){
        return indicadorRepo.findIndicadorByIdMeta(meta);
    }

    public List<String> listaDeIndicadoresDTO(Meta meta){
        return listaDeIndicadores(meta).stream().map(Indicador::getDescripcion).collect(Collectors.toList());
    }

    public List<MetaDTO> listaDeMetasDTO(ObjetivoEspecifico objetivoEspecifico){
        return listaDeMetas(objetivoEspecifico).stream()
                .map(m -> {
                    String tipo = obtenerTipo(m.getIdCodigoTipo()).getValor();
                    BigDecimal cantidad = "cuantitativa".equalsIgnoreCase(tipo) ? m.getCantidad() : null;
                    MetaDTO dto = new MetaDTO(tipo, m.getDescripcion(), cantidad);
                    dto.setIndicadores(listaDeIndicadoresDTO(m));
                    return dto;
                })
                .collect(Collectors.toList());

    }


    public List<Presupuesto> listaDePresupuestos(Proyecto proyecto){
        return Optional.ofNullable(presupuestoRepo.findPresupuestoByIdProyecto(proyecto)).orElse(Collections.emptyList());
    }

    public List<PresupuestoDTO> listaDePresupuestosDTO(Proyecto proyecto){
        return listaDePresupuestos(proyecto).stream()
                .map(p -> {
                    String fuente = Optional.ofNullable(obtenerTipo(p.getIdCodigoFuenteFinanciamiento()))
                            .map(CodigoDTO::getValor)
                            .orElse("Desconocido");
                    String tipo = Optional.ofNullable(obtenerTipo(p.getIdCodigoTipoPresupuesto()))
                            .map(CodigoDTO::getValor)
                            .orElse("Desconocido");

                    return new PresupuestoDTO(p.getId(), fuente, p.getMonto(), tipo, p.getDescripcion());
                })
                .collect(Collectors.toList());
    }
    public List<Documento> listaDeDocumentos(Proyecto proyecto){
        return Optional.ofNullable(documentoRepo.findDocumentoByIdProyecto(proyecto)).orElse(Collections.emptyList());
    }

    public List<DocumentoDTO> listaDeDocumentosDTO(Proyecto proyecto){
        return listaDeDocumentos(proyecto).stream()
                .map(d -> new DocumentoDTO(d.getId(),d.getNombreDocumento(), d.getDirectorio()))
                .collect(Collectors.toList());
    }

    public List<PresentacionInforme> listaDePresentaciones(Proyecto proyecto){
        return Optional.ofNullable(presentacionInformeRepo.findPresentacionInformeByIdProyecto(proyecto)).orElse(Collections.emptyList());
    }


    public List<InformeDTO> listaDeInformesDTO(Proyecto proyecto){
        return listaDePresentaciones(proyecto).stream()
                .map(i -> new InformeDTO(i.getId(),i.getDescripcion(), i.getFechaPresentacion()))
                .collect(Collectors.toList());
    }

    public List<Certificacion> listaDeCertificaciones(Investigador investigador){
        return Optional.ofNullable(certificacionRepo.findCertificacionByIdInvestigador(investigador)).orElse(Collections.emptyList());
    }

    public List<CertificacionesDTO> listaDeCertificacionesDTO(Investigador investigador){
        return listaDeCertificaciones(investigador).stream().map(c -> new CertificacionesDTO(c.getNombreCertificacion(),
                obtenerTipo(c.getIdCodigoTipoCertificacion()).getValor(),
                c.getFechaExpiracion(),obtenerTipo(c.getIdCodigoTipoEstado()).getValor() )).collect(Collectors.toList());
    }

    public List<InvestigadorProyecto> listaDeInvestigadoresProyecto(Proyecto proyecto){
        return Optional.ofNullable(invProyRepo.findInvestigadoresByIdProyecto(proyecto)).orElse(Collections.emptyList());
    }

    public List<InvestigadorProyectoDTO> listaDeInvestigadoresDTO(Proyecto proyecto){
        return listaDeInvestigadoresProyecto(proyecto).stream()
                .map(i -> {
                    InvestigadorProyectoDTO dto =  new InvestigadorProyectoDTO(i.getIdRolProyecto().getNombrePermiso(),
                            i.getIdInvestigador().getIdEmpleado().getNombreCompleto(), i.getIdInvestigador().getIdEmpleado().getIdentificacion(),
                            obtenerTipo(i.getIdInvestigador().getIdCodigoGradoAcademico()).getValor(), i.getIdInvestigador().getInstitucionOrigen(),
                            i.getIdInvestigador().getUnidadAcademica(), listaDeCertificacionesDTO(i.getIdInvestigador()));
                    return dto;
                }).collect(Collectors.toList());
    }

    public ProyectoDTO obtenerProyectoDTOPorId(Short id){
        Proyecto proyecto = proyectoPorId(id);

        if (proyecto == null) {
            throw new RuntimeException("Proyecto no encontrado con ID: " + id);
        }

        ProyectoDTO proyectoDTO = new ProyectoDTO();
        proyectoDTO.setCodigo(proyecto.getCodigoProyecto());
        proyectoDTO.setNombre(proyecto.getNombreProyecto());
        proyectoDTO.setFechaInicio(proyecto.getFechaInicio());
        proyectoDTO.setFechaFinalizacion(proyecto.getFechaFinalizacion());
        proyectoDTO.setLineaInvestigacion(proyecto.getLineaInvestigacion());
        proyectoDTO.setTipoProyecto(obtenerTipo(proyecto.getIdCodigoTipoProyecto()).getValor());
        proyectoDTO.setTipoProyecto(obtenerTipo(proyecto.getIdCodigoTipoProyecto()).getValor());
        proyectoDTO.setEstado(obtenerTipo(proyecto.getIdCodigoEstado()).getValor());
        proyectoDTO.setDescripcion(proyecto.getDescripcionProyecto());
        proyectoDTO.setObjetivoGeneral(proyecto.getObjetivoGeneral());
        proyectoDTO.setDetalles(proyecto.getDetallesProyectos());
        proyectoDTO.setEntidadesVinculadas(listaEntidadesDTO(proyecto));
        proyectoDTO.setObjetivosEspecificos(listaDeObjetivosEspecificosDTO(proyecto));
        proyectoDTO.setPresupuestos(listaDePresupuestosDTO(proyecto));
        proyectoDTO.setDocumentos(listaDeDocumentosDTO(proyecto));
        proyectoDTO.setPresentacionesInformes(listaDeInformesDTO(proyecto));
        proyectoDTO.setInvestigadoresProyectos(listaDeInvestigadoresDTO(proyecto));
        return proyectoDTO;
    }

    public List<ProyectoMiniDTO> suggest(String q, Pageable pg) {
        String qq = (q == null) ? null : q.trim();
        if (qq == null || qq.isEmpty()) return List.of();
        return proyectoRepo.suggest(qq, pg);
    }
    public ProyectoResumenDTO buscarResumen(String q) {
        var list = proyectoRepo.buscarResumen(q.trim(), org.springframework.data.domain.PageRequest.of(0,1));
        return list.isEmpty() ? null : list.get(0);
    }

    // Servicio
    public List<AsignadoDTO> listarAsignados(int proyectoId, String q) {
        return proyectoRepo.asignados(proyectoId, q == null ? "" : q.trim())
                .stream()
                .map(AsignadoDTO::of) // of(ProyectoRepository.AsignadoRow r)
                .toList();
    }

    // ProyectoService.java
    @Transactional
    public void agregarAsignacion(short proyectoId, AsignacionReqDTO req) {
        Proyecto p = Optional.ofNullable(proyectoRepo.findProyectoById(proyectoId))
                .orElseThrow(() -> new IllegalArgumentException("Proyecto no existe"));

        Investigador inv = invRepo.findById(req.investigadorId())
                .orElseThrow(() -> new IllegalArgumentException("Investigador no existe"));

        if (invProyRepo.existsByIdProyectoAndIdInvestigador(p, inv)) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.CONFLICT,
                    "El investigador ya está asignado a este proyecto"
            );
        }

        RolProyecto rol = rolProyectoRepo.findById(req.rolProyectoId())
                .orElseThrow(() -> new IllegalArgumentException("Rol inválido"));

        // en ProyectoService.agregarAsignacion(...)
        LocalDate ini = Optional.ofNullable(req.ini()).orElse(p.getFechaInicio());
        LocalDate fin = req.fin(); // puede ser null

        InvestigadorProyecto ip = new InvestigadorProyecto();
        ip.setId(nextVal("SEC_INVESTIGADOR_PROYECTO"));
        ip.setIdInvestigador(inv);
        ip.setIdProyecto(p);
        ip.setIdRolProyecto(rol);
        ip.setFechaInicioInvestigador(ini);          // ← LocalDate
        ip.setFechaFinInvestigador(fin);             // ← LocalDate
        invProyRepo.save(ip);

        Integer horasMes = req.horasMes();
        Integer meses = req.meses();
        if (horasMes != null && horasMes > 0 && meses != null && meses > 0) {
            Short idTipoHorasPresupuesto =
                    catalogoService.obtenerIdCodigoPorTipoYValor("TIPO PRESUPUESTO", "HORAS");
            Presupuesto pres = presupuestoRepo
                    .findFirstByIdProyectoAndIdCodigoTipoPresupuesto(p, idTipoHorasPresupuesto)
                    .orElseThrow(() -> new IllegalStateException("No hay presupuesto de HORAS para el proyecto"));

            HorasAsignada ha = new HorasAsignada();          // usa la clase real de tu modelo
            ha.setId(nextVal("SEC_HORAS_ASIGNADAS"));
            ha.setIdInvestigadorProyecto(ip);
            ha.setIdPresupuesto(pres);
            ha.setCantidadHorasMes(horasMes.doubleValue());
            ha.setCantidadMeses(meses.shortValue());
            Short idTipoHoras =
                    catalogoService.obtenerIdCodigoPorTipoYValor("TIPO HORAS", "TIEMPO COMPLETO");
            ha.setIdCodigoTipoHoras(idTipoHoras);
            horasAsignadasRepo.save(ha);
        }

    }

    @Transactional
    public void quitarAsignacion(short proyectoId, short investigadorId) {
        Proyecto p = Optional.ofNullable(proyectoRepo.findProyectoById(proyectoId))
                .orElseThrow(() -> new IllegalArgumentException("Proyecto no existe"));

        Investigador inv = invRepo.findById(investigadorId)
                .orElseThrow(() -> new IllegalArgumentException("Investigador no existe"));

        InvestigadorProyecto ip = invProyRepo
                .findByIdProyectoAndIdInvestigador(p, inv)
                .orElseThrow(() -> new IllegalArgumentException("Asignación no existe"));

        // elimina horas primero por FK
        horasAsignadasRepo.deleteByIdInvestigadorProyecto(ip);
        invProyRepo.delete(ip);
    }

    private Short nextVal(String seq) {
        Number n = (Number) em.createNativeQuery("SELECT " + seq + ".NEXTVAL FROM DUAL").getSingleResult();
        return n.shortValue();
    }




}



