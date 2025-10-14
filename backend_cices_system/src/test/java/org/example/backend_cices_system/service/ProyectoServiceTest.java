package org.example.backend_cices_system.service;

import jakarta.persistence.EntityManager;
import org.example.backend_cices_system.data.*;
import org.example.backend_cices_system.dto.*;
import org.example.backend_cices_system.logic.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.*;import jakarta.persistence.Query;
import org.springframework.web.server.ResponseStatusException;



@ExtendWith(MockitoExtension.class)
public class ProyectoServiceTest {

    @Mock
    private ProyectoRepository proyectoRepo;
    @Mock
    private ObjetivoEspecificoRepository objetivoRepo;
    @Mock
    private MetaRepository metaRepo;
    @Mock
    private IndicadorRepository indicadorRepo;
    @Mock
    private EntidadRepository entidadRepo;
    @Mock
    private EntidadProyectoRepository entidadProyectoRepo;
    @Mock
    private CatalogoService catalogoService;
    @Mock
    private PresentacionInformeRepository presentacionInformeRepo;
    @Mock
    private PresupuestoRepository presupuestoRepo;
    @Mock
    private DocumentoRepository documentoRepo;
    @Mock
    private InvestigadorProyectoRepository investigadorProyectoRepo;

    @Mock
    EntityManager em;
    @Mock 
    private InvestigadorRepository invRepo;
    @Mock 
    private RolProyectoRepository rolProyectoRepo;
    @Mock 
    private HorasAsignadasRepository horasAsignadasRepo;

    @InjectMocks
    private ProyectoService proyectoService;

    private ProyectoDTO dto;

    @BeforeEach // inicializar un proyecto
    void setUp() {
        dto = new ProyectoDTO();
        dto.setNombre("Proyecto CICES");
        dto.setCodigo("PRJ-001");
        dto.setDescripcion("Proyecto de IA");
        dto.setObjetivoGeneral("Estudiar redes neuronales");
        dto.setFechaInicio(LocalDate.of(2025, 10, 1));
        dto.setFechaFinalizacion(LocalDate.of(2026, 10, 1));
        dto.setEstado("ACTIVO");
        dto.setTipo("SOCIOCULTURAL");
        dto.setLineaInvestigacion("Inteligencia Artificial");
        // todavia no se valida detalles, puede ser null

        MetaDTO meta = new MetaDTO();
        meta.setTipo("CUANTITATIVA");
        meta.setCantidad(BigDecimal.valueOf(3));
        meta.setDescripcion("Tres prototipos");
        meta.setIndicadores(List.of("Precisión", "Recall", "F1"));

        ObjetivoEspecificoDTO objetivo = new ObjetivoEspecificoDTO();
        objetivo.setCategoria("INVESTIGACIÓN");
        objetivo.setDescripcion("Desarrollar modelo IA");
        objetivo.setMetas(List.of(meta));

        dto.setObjetivosEspecificos(List.of(objetivo));

        EntidadVinculadaDTO entidad1 = new EntidadVinculadaDTO();
        entidad1.setNombre("Universidad Nacional");
        entidad1.setTipo("INSTITUCION");

        EntidadVinculadaDTO entidad2 = new EntidadVinculadaDTO();
        entidad2.setNombre("Laboratorio IA");
        entidad2.setTipo("UNIDAD");

        dto.setEntidadesVinculadas(List.of(entidad1, entidad2));
    }

    @Test // guardar un proyecto exitosamente
    void testGuardarProyecto_exitoso() {
        when(proyectoRepo.findByCodigoProyecto("PRJ-001")).thenReturn(Optional.empty());
        when(catalogoService.obtenerIdCodigoPorTipoYValor("ESTADO PROYECTO", "ACTIVO")).thenReturn((short) 1);
        when(catalogoService.obtenerIdCodigoPorTipoYValor("TIPO PROYECTO", "SOCIOCULTURAL")).thenReturn((short) 2);
        when(catalogoService.obtenerIdCodigoPorTipoYValor("TIPO META", "CUANTITATIVA")).thenReturn((short) 3);
        when(catalogoService.obtenerIdCodigoPorTipoYValor("TIPO ENTIDAD", "INSTITUCION")).thenReturn((short) 4);
        when(catalogoService.obtenerIdCodigoPorTipoYValor("TIPO ENTIDAD", "UNIDAD")).thenReturn((short) 5);

        when(entidadRepo.findByNombreIgnoreCase(any())).thenReturn(Optional.empty());
        when(entidadRepo.save(any())).thenAnswer(inv -> inv.getArguments()[0]);
        when(proyectoRepo.save(any())).thenAnswer(inv -> inv.getArguments()[0]);
        when(objetivoRepo.save(any())).thenAnswer(inv -> inv.getArguments()[0]);
        when(metaRepo.save(any())).thenAnswer(inv -> inv.getArguments()[0]);
        when(indicadorRepo.save(any())).thenAnswer(inv -> inv.getArguments()[0]);
        when(entidadProyectoRepo.save(any())).thenAnswer(inv -> inv.getArguments()[0]);

        Proyecto saved = proyectoService.guardarProyecto(dto);

        assertNotNull(saved);
        verify(proyectoRepo).save(any(Proyecto.class));
        verify(objetivoRepo).save(any(ObjetivoEspecifico.class));
        verify(metaRepo).save(any(Meta.class));
        verify(indicadorRepo, times(3)).save(any(Indicador.class));
        verify(entidadRepo, times(2)).save(any(Entidad.class));
        verify(entidadProyectoRepo, times(2)).save(any(EntidadProyecto.class));
    }

    @Test //Lanzar excepcion en caso de coigo ya existente
    void testGuardarProyecto_codigoDuplicado() {
        when(proyectoRepo.findByCodigoProyecto("PRJ-001")).thenReturn(Optional.of(new Proyecto()));

        assertThrows(IllegalArgumentException.class, () ->
                proyectoService.guardarProyecto(dto));

    }

    @Test //Guardar un proyecto sin entidades vinculadas
    void testGuardarProyecto_sinEntidades() {
        // Sin entidades, en el frontend se maneja como lista vacia
        dto.setEntidadesVinculadas(Collections.emptyList());

        // Mocks comunes no se guardan entidades
        when(proyectoRepo.findByCodigoProyecto("PRJ-001")).thenReturn(Optional.empty());
        when(catalogoService.obtenerIdCodigoPorTipoYValor(anyString(), anyString())).thenReturn((short) 1);
        when(proyectoRepo.save(any())).thenAnswer(inv -> inv.getArguments()[0]);
        when(objetivoRepo.save(any())).thenAnswer(inv -> inv.getArguments()[0]);
        when(metaRepo.save(any())).thenAnswer(inv -> inv.getArguments()[0]);
        when(indicadorRepo.save(any())).thenAnswer(inv -> inv.getArguments()[0]);

        // Act
        Proyecto proyecto = proyectoService.guardarProyecto(dto);

        // Assert
        assertNotNull(proyecto);
        verify(proyectoRepo).save(any(Proyecto.class));
        verify(objetivoRepo).save(any(ObjetivoEspecifico.class));
        verify(metaRepo).save(any(Meta.class));
        verify(indicadorRepo, times(3)).save(any(Indicador.class));

        //que no se guarden entidades
        verify(entidadRepo, never()).save(any());
        verify(entidadProyectoRepo, never()).save(any());
    }

    @Test
    void testGuardarProyecto_conFechasDeInformes() {
        when(proyectoRepo.findByCodigoProyecto("PRJ-001")).thenReturn(Optional.empty());
        when(catalogoService.obtenerIdCodigoPorTipoYValor("ESTADO PROYECTO", "ACTIVO")).thenReturn((short) 1);
        when(catalogoService.obtenerIdCodigoPorTipoYValor("TIPO PROYECTO", "SOCIOCULTURAL")).thenReturn((short) 2);
        when(catalogoService.obtenerIdCodigoPorTipoYValor("TIPO META", "CUANTITATIVA")).thenReturn((short) 3);
        when(catalogoService.obtenerIdCodigoPorTipoYValor("TIPO ENTIDAD", "INSTITUCION")).thenReturn((short) 4);
        when(catalogoService.obtenerIdCodigoPorTipoYValor("TIPO ENTIDAD", "UNIDAD")).thenReturn((short) 5);
        when(catalogoService.obtenerIdCodigoPorTipoYValor(eq("ESTADO INFORME"), anyString()))
                .thenAnswer(invocation -> {
                    String estado = invocation.getArgument(1);
                    if ("ENTREGADO".equals(estado)) return (short) 10;
                    if ("PENDIENTE".equals(estado)) return (short) 20;
                    return (short) 0;
                });

        when(entidadRepo.findByNombreIgnoreCase(any())).thenReturn(Optional.empty());
        when(entidadRepo.save(any())).thenAnswer(inv -> inv.getArguments()[0]);
        when(proyectoRepo.save(any())).thenAnswer(inv -> inv.getArguments()[0]);
        when(objetivoRepo.save(any())).thenAnswer(inv -> inv.getArguments()[0]);
        when(metaRepo.save(any())).thenAnswer(inv -> inv.getArguments()[0]);
        when(indicadorRepo.save(any())).thenAnswer(inv -> inv.getArguments()[0]);
        when(entidadProyectoRepo.save(any())).thenAnswer(inv -> inv.getArguments()[0]);
        when(presentacionInformeRepo.save(any())).thenAnswer(inv -> inv.getArguments()[0]);

        // Agregar informes a dto
        InformeDTO informeEntregado = new InformeDTO();
        informeEntregado.setDescripcion("Informe entregado");
        informeEntregado.setFechaPresentacion(LocalDate.now().minusDays(1)); // fecha pasada

        InformeDTO informePendiente = new InformeDTO();
        informePendiente.setDescripcion("Informe pendiente");
        informePendiente.setFechaPresentacion(LocalDate.now().plusDays(5)); // fecha futura

        dto.setPresentacionesInformes(List.of(informeEntregado, informePendiente));

        Proyecto saved = proyectoService.guardarProyecto(dto);

        assertNotNull(saved);
        verify(presentacionInformeRepo, times(2)).save(any(PresentacionInforme.class));
    }

    @Test
    void testObtenerTodosLosProyectos() {
        Proyecto proyecto = new Proyecto();
        proyecto.setId((short) 1);
        proyecto.setCodigoProyecto("P001");
        proyecto.setNombreProyecto("Proyecto Test");
        when(proyectoRepo.findAll()).thenReturn(List.of(proyecto));

        List<ProyectoDTO> result = proyectoService.obtenerTodosLosProyectos();

        assertEquals(1, result.size());
        assertEquals("P001", result.get(0).getCodigo());
        verify(proyectoRepo).findAll();
    }

    @Test
    void testProyectoPorId() {
        Proyecto p = new Proyecto();
        p.setId((short) 10);
        when(proyectoRepo.findProyectoById((short) 10)).thenReturn(p);

        Proyecto result = proyectoService.proyectoPorId((short) 10);

        assertNotNull(result);
        assertEquals(10, result.getId().shortValue());
    }

    @Test
    void testListaEntidadesDTO() {
        Proyecto proyecto = new Proyecto();
        Entidad entidad = new Entidad();
        entidad.setNombre("UCR");
        entidad.setIdCodigoTipo((short) 5);

        EntidadProyecto ep = new EntidadProyecto();
        ep.setIdEntidad(entidad);
        ep.setIdProyecto(proyecto);

        when(entidadProyectoRepo.findEntidadProyectoByIdProyecto(proyecto)).thenReturn(List.of(ep));
        when(catalogoService.obtenerCodigoPorId((short) 5)).thenReturn(new CodigoDTO((short) 5, "UNIDAD","UNIDAD" ));

        List<EntidadVinculadaDTO> result = proyectoService.listaEntidadesDTO(proyecto);

        assertEquals(1, result.size());
        assertEquals("UCR", result.get(0).getNombre());
        assertEquals("UNIDAD", result.get(0).getTipo());
    }

    void testListaDeMetasDTO() {
        ObjetivoEspecifico objetivo = new ObjetivoEspecifico();
        Meta meta = new Meta();
        meta.setDescripcion("Meta 1");
        meta.setIdCodigoTipo((short) 2);
        meta.setCantidad(BigDecimal.TEN);
        when(metaRepo.findMetaByIdObjetivo(objetivo)).thenReturn(List.of(meta));
        when(indicadorRepo.findIndicadorByIdMeta(meta)).thenReturn(Collections.emptyList());
        when(catalogoService.obtenerCodigoPorId((short) 2)).thenReturn(new CodigoDTO((short) 2, "CUALITATIVA", "CUALITATIVA"));

        List<MetaDTO> result = proyectoService.listaDeMetasDTO(objetivo);

        assertEquals(1, result.size());
        assertEquals("Meta 1", result.get(0).getDescripcion());
        assertEquals(BigDecimal.TEN, result.get(0).getCantidad());
    }

    @Test
    void testListaDePresupuestosDTO() {
        Proyecto proyecto = new Proyecto();
        Presupuesto p = new Presupuesto();
        p.setId((short) 1);
        p.setIdCodigoFuenteFinanciamiento((short) 1);
        p.setIdCodigoTipoPresupuesto((short) 2);
        p.setMonto(BigDecimal.valueOf(5000));
        p.setDescripcion("Compra de equipo");

        when(presupuestoRepo.findPresupuestoByIdProyecto(proyecto)).thenReturn(List.of(p));
        when(catalogoService.obtenerCodigoPorId((short) 1)).thenReturn(new CodigoDTO((short) 1, "CONCURSABLE", "CONCURSABLE"));
        when(catalogoService.obtenerCodigoPorId((short) 2)).thenReturn(new CodigoDTO((short) 2, "FINANCIERO", "FINANCIERO"));

        List<PresupuestoDTO> result = proyectoService.listaDePresupuestosDTO(proyecto);

        assertEquals(1, result.size());
        assertEquals("CONCURSABLE", result.get(0).getFuenteFinanciamiento());
        assertEquals("FINANCIERO", result.get(0).getTipoPresupuesto());
        assertEquals(BigDecimal.valueOf(5000), result.get(0).getMonto());
    }

    @Test
    void testObtenerProyectoDTOPorId() {
        Proyecto proyecto = new Proyecto();
        proyecto.setId((short) 3);
        proyecto.setCodigoProyecto("2025");
        proyecto.setNombreProyecto("Test Proyecto Investigacion");
        proyecto.setFechaInicio(LocalDate.now());
        proyecto.setFechaFinalizacion(LocalDate.now().plusMonths(3));
        proyecto.setLineaInvestigacion("Basica");
        proyecto.setIdCodigoTipoProyecto((short) 1);
        proyecto.setIdCodigoEstado((short) 2);
        proyecto.setDescripcionProyecto("Descripción del proyecto");
        proyecto.setObjetivoGeneral("Objetivo General");
        proyecto.setDetallesProyectos("Detalles");

        when(proyectoRepo.findProyectoById((short) 3)).thenReturn(proyecto);
        when(catalogoService.obtenerCodigoPorId((short) 1)).thenReturn(new CodigoDTO((short) 1, "SOCIOCULTURAL", "SOCIOCULTURAL"));
        when(catalogoService.obtenerCodigoPorId((short) 2)).thenReturn(new CodigoDTO((short) 2, "ACTIVO", "ACTIVO"));

        // mocks de listas relacionadas
        when(entidadProyectoRepo.findEntidadProyectoByIdProyecto(proyecto)).thenReturn(Collections.emptyList());
        when(objetivoRepo.findObjetivoEspecificoByIdProyecto(proyecto)).thenReturn(Collections.emptyList());
        when(presupuestoRepo.findPresupuestoByIdProyecto(proyecto)).thenReturn(Collections.emptyList());
        when(documentoRepo.findDocumentoByIdProyecto(proyecto)).thenReturn(Collections.emptyList());
        when(presentacionInformeRepo.findPresentacionInformeByIdProyecto(proyecto)).thenReturn(Collections.emptyList());
        when(investigadorProyectoRepo.findInvestigadoresByIdProyecto(proyecto)).thenReturn(Collections.emptyList());

        ProyectoDTO dto = proyectoService.obtenerProyectoDTOPorId((short) 3);

        assertNotNull(dto);
        assertEquals("2025", dto.getCodigo());
        assertEquals("Test Proyecto Investigacion", dto.getNombre());
        assertEquals("SOCIOCULTURAL", dto.getTipoProyecto());
        assertEquals("ACTIVO", dto.getEstado());
        verify(proyectoRepo).findProyectoById((short) 3);
    }

    @Test
    void testObtenerProyectoDTOPorId_NoExiste() {
        when(proyectoRepo.findProyectoById((short) 99)).thenReturn(null);

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                proyectoService.obtenerProyectoDTOPorId((short) 99));

        assertEquals("Proyecto no encontrado con ID: 99", ex.getMessage());
    }

    @Test
    void suggest_null_o_blanco_devuelve_vacio() {
        var pg = PageRequest.of(0, 5);
        assertThat(proyectoService.suggest(null, pg)).isEmpty();
        assertThat(proyectoService.suggest("   ", pg)).isEmpty();
        verifyNoInteractions(proyectoRepo);
    }

    @Test
    void suggest_ok_llama_repo() {
        var pg = PageRequest.of(0, 5);
        var esperado = List.of(
                new ProyectoMiniDTO((short)1, "P-001", "A"),
                new ProyectoMiniDTO((short)2, "P-002", "B")
        );
        when(proyectoRepo.suggest("bio", pg)).thenReturn(esperado);

        var out = proyectoService.suggest("bio", pg);

        assertThat(out).hasSize(2);
        assertThat(out.get(0).codigo()).isEqualTo("P-001");
        verify(proyectoRepo).suggest("bio", pg);
    }

    /* ---------- buscarResumen ---------- */

    @Test
    void buscarResumen_ret_first_o_null() {
        var dto = new ProyectoResumenDTO((short)7,"P-007","X","ACTIVO","Bio",
                LocalDate.of(2025,1,1), LocalDate.of(2025,12,31),200,3,150);

        when(proyectoRepo.buscarResumen("q", PageRequest.of(0,1))).thenReturn(List.of(dto));
        assertThat(proyectoService.buscarResumen(" q ")).isEqualTo(dto);

        when(proyectoRepo.buscarResumen("z", PageRequest.of(0,1))).thenReturn(List.of());
        assertThat(proyectoService.buscarResumen("z")).isNull();
    }

    /* ---------- listarAsignados ---------- */

    interface AsignadoRowMock extends ProyectoRepository.AsignadoRow {}
    @Test
    void listarAsignados_mapea_row_a_dto() {
        var row = mock(AsignadoRowMock.class);
        when(row.getId()).thenReturn((short)3);
        when(row.getNombre()).thenReturn("Ana");
        when(row.getRol()).thenReturn("INVESTIGADOR");
        when(row.getIni()).thenReturn(LocalDate.of(2025,1,1));
        when(row.getFin()).thenReturn(LocalDate.of(2025,12,31));
        when(row.getHoras()).thenReturn(new BigDecimal("100.0"));
        when(row.getEstado()).thenReturn("ACTIVO");

        when(proyectoRepo.asignados(10, "")).thenReturn(List.of(row));

        var out = proyectoService.listarAsignados(10, "   ");

        assertThat(out).hasSize(1);
        var a0 = out.get(0);
        assertThat(a0.id()).isEqualTo((short)3);
        assertThat(a0.nombre()).isEqualTo("Ana");
        assertThat(a0.rol()).isEqualTo("INVESTIGADOR");
        assertThat(a0.estado()).isEqualTo("ACTIVO");
        verify(proyectoRepo).asignados(10, "");
    }

    /* ---------- agregarAsignacion ---------- */

    @Test
    void agregarAsignacion_ok_crea_ip_y_horas_si_corresponde() {
        short proyectoId = 9;
        var req = new AsignacionReqDTO((short)3,(short)2,40,6,null,null);

        var p = new Proyecto(); p.setId(proyectoId); p.setFechaInicio(LocalDate.of(2025,1,1));
        when(proyectoRepo.findProyectoById(proyectoId)).thenReturn(p);

        var inv = new Investigador(); inv.setId((short)3);
        when(invRepo.findById((short)3)).thenReturn(Optional.of(inv));

        when(investigadorProyectoRepo.existsByIdProyectoAndIdInvestigador(p, inv)).thenReturn(false);

        var rol = new RolProyecto(); rol.setId((short)2);
        when(rolProyectoRepo.findById((short)2)).thenReturn(Optional.of(rol));

        // secuencias
        var q = mock(Query.class);
        when(em.createNativeQuery(startsWith("SELECT SEC_INVESTIGADOR_PROYECTO.NEXTVAL"))).thenReturn(q);
        when(em.createNativeQuery(startsWith("SELECT SEC_HORAS_ASIGNADAS.NEXTVAL"))).thenReturn(q);
        when(q.getSingleResult()).thenReturn(1).thenReturn(2);

        // presupuesto HORAS
        when(catalogoService.obtenerIdCodigoPorTipoYValor("TIPO PRESUPUESTO", "HORAS")).thenReturn((short)11);
        var pres = new Presupuesto();
        when(presupuestoRepo.findFirstByIdProyectoAndIdCodigoTipoPresupuesto(p, (short)11)).thenReturn(Optional.of(pres));
        when(catalogoService.obtenerIdCodigoPorTipoYValor("TIPO HORAS", "TIEMPO COMPLETO")).thenReturn((short)22);

        proyectoService.agregarAsignacion(proyectoId, req);

        ArgumentCaptor<InvestigadorProyecto> ipCap = ArgumentCaptor.forClass(InvestigadorProyecto.class);
        verify(investigadorProyectoRepo).save(ipCap.capture());
        var ip = ipCap.getValue();
        assertThat(ip.getIdProyecto()).isEqualTo(p);
        assertThat(ip.getIdInvestigador()).isEqualTo(inv);
        assertThat(ip.getIdRolProyecto()).isEqualTo(rol);
        assertThat(ip.getFechaInicioInvestigador()).isEqualTo(LocalDate.of(2025,1,1));
        assertThat(ip.getFechaFinInvestigador()).isNull();

        ArgumentCaptor<HorasAsignada> haCap = ArgumentCaptor.forClass(HorasAsignada.class);
        verify(horasAsignadasRepo).save(haCap.capture());
        var ha = haCap.getValue();
        assertThat(ha.getIdInvestigadorProyecto()).isEqualTo(ip);
        assertThat(ha.getIdPresupuesto()).isEqualTo(pres);
        assertThat(ha.getCantidadHorasMes()).isEqualTo(40.0);
        assertThat(ha.getCantidadMeses()).isEqualTo((short)6);
        assertThat(ha.getIdCodigoTipoHoras()).isEqualTo((short)22);
    }

    @Test
    void agregarAsignacion_conflicto_ya_asignado_lanza_409() {
        short proyectoId = 9;
        var req = new AsignacionReqDTO((short)3,(short)2,null,null,null,null);

        var p = new Proyecto(); p.setId(proyectoId); p.setFechaInicio(LocalDate.now());
        when(proyectoRepo.findProyectoById(proyectoId)).thenReturn(p);

        var inv = new Investigador(); inv.setId((short)3);
        when(invRepo.findById((short)3)).thenReturn(Optional.of(inv));

        when(investigadorProyectoRepo.existsByIdProyectoAndIdInvestigador(p, inv)).thenReturn(true);

        assertThatThrownBy(() -> proyectoService.agregarAsignacion(proyectoId, req))
                .isInstanceOf(ResponseStatusException.class);

        verify(investigadorProyectoRepo, never()).save(any());
        verify(horasAsignadasRepo, never()).save(any());
    }

    @Test
    void agregarAsignacion_sin_presupuesto_horas_lanza_IllegalState() {
        short proyectoId = 9;
        var req = new AsignacionReqDTO((short)3,(short)2,10,2,null,null);

        var p = new Proyecto(); p.setId(proyectoId); p.setFechaInicio(LocalDate.now());
        when(proyectoRepo.findProyectoById(proyectoId)).thenReturn(p);

        var inv = new Investigador(); inv.setId((short)3);
        when(invRepo.findById((short)3)).thenReturn(Optional.of(inv));
        when(investigadorProyectoRepo.existsByIdProyectoAndIdInvestigador(p, inv)).thenReturn(false);

        var rol = new RolProyecto(); rol.setId((short)2);
        when(rolProyectoRepo.findById((short)2)).thenReturn(Optional.of(rol));

        var q = mock(Query.class);
        when(em.createNativeQuery(anyString())).thenReturn(q);
        when(q.getSingleResult()).thenReturn(1).thenReturn(2);

        when(catalogoService.obtenerIdCodigoPorTipoYValor("TIPO PRESUPUESTO", "HORAS")).thenReturn((short)11);
        when(presupuestoRepo.findFirstByIdProyectoAndIdCodigoTipoPresupuesto(p, (short)11)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> proyectoService.agregarAsignacion(proyectoId, req))
                .isInstanceOf(IllegalStateException.class);

        verify(investigadorProyectoRepo).save(any(InvestigadorProyecto.class));
        verify(horasAsignadasRepo, never()).save(any());
    }

    /* ---------- quitarAsignacion ---------- */

    @Test
    void quitarAsignacion_ok_borra_horas_y_asignacion() {
        short proyectoId = 9, investigadorId = 3;

        var p = new Proyecto(); p.setId(proyectoId);
        when(proyectoRepo.findProyectoById(proyectoId)).thenReturn(p);

        var inv = new Investigador(); inv.setId(investigadorId);
        when(invRepo.findById(investigadorId)).thenReturn(Optional.of(inv));

        var ip = new InvestigadorProyecto();
        when(investigadorProyectoRepo.findByIdProyectoAndIdInvestigador(p, inv)).thenReturn(Optional.of(ip));

        proyectoService.quitarAsignacion(proyectoId, investigadorId);

        verify(horasAsignadasRepo).deleteByIdInvestigadorProyecto(ip);
        verify(investigadorProyectoRepo).delete(ip);
    }




}

