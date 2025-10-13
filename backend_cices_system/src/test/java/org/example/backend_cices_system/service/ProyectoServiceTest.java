package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.*;
import org.example.backend_cices_system.dto.EntidadVinculadaDTO;
import org.example.backend_cices_system.dto.MetaDTO;
import org.example.backend_cices_system.dto.ObjetivoEspecificoDTO;
import org.example.backend_cices_system.dto.ProyectoDTO;
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

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
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
    private DocumentoService documentoService;

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
       // meta.setIndicadores(List.of("Precisión", "Recall", "F1"));

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

}

