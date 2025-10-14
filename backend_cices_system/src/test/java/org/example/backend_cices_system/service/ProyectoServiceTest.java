package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.*;
import org.example.backend_cices_system.dto.*;
import org.example.backend_cices_system.logic.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

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





}

