package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.MetaRepository;
import org.example.backend_cices_system.dto.CodigoDTO;
import org.example.backend_cices_system.dto.IndicadorDTO;
import org.example.backend_cices_system.dto.MetaDTO;
import org.example.backend_cices_system.logic.Meta;
import org.example.backend_cices_system.logic.ObjetivoEspecifico;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MetaServiceTest {

    @Mock
    private MetaRepository metaRepository;

    @Mock
    private CatalogoService catalogoService;

    @Mock
    private IndicadorService indicadorService;

    @InjectMocks
    private MetaService metaService;

    @Test
    void guardarMeta_debeGuardarMetaCuantitativaConCantidadEIndicador() {
        ObjetivoEspecifico objetivo = new ObjetivoEspecifico();
        objetivo.setId(301);

        IndicadorDTO indicador = new IndicadorDTO(
                null,
                "Cantidad de encuestas registradas en el sistema."
        );

        MetaDTO dto = new MetaDTO(
                null,
                new CodigoDTO((short) 10, "CUANTITATIVA", "Cuantitativa"),
                25,
                "Se registran 25 encuestas estructuradas.",
                List.of(indicador)
        );

        when(metaRepository.save(any(Meta.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Meta resultado = metaService.guardarMeta(dto, objetivo);

        ArgumentCaptor<Meta> captor = ArgumentCaptor.forClass(Meta.class);

        verify(metaRepository).save(captor.capture());

        Meta metaGuardada = captor.getValue();

        assertSame(resultado, metaGuardada);
        assertEquals(objetivo, metaGuardada.getIdObjetivoEspecifico());
        assertEquals((short) 10, metaGuardada.getIdCodigoTipoMeta());
        assertEquals(25, metaGuardada.getCantidad());
        assertEquals(
                "Se registran 25 encuestas estructuradas.",
                metaGuardada.getDescripcion()
        );

        verify(indicadorService).guardarIndicador(indicador, metaGuardada);
    }

    @Test
    void guardarMeta_debeGuardarMetaCualitativaSinCantidadEIndicador() {
        ObjetivoEspecifico objetivo = new ObjetivoEspecifico();
        objetivo.setId(301);

        IndicadorDTO indicador = new IndicadorDTO(
                null,
                "Descripción de hallazgos cualitativos documentados."
        );

        MetaDTO dto = new MetaDTO(
                null,
                new CodigoDTO((short) 11, "CUALITATIVA", "Cualitativa"),
                null,
                "Se documentan observaciones cualitativas del proyecto.",
                List.of(indicador)
        );

        when(metaRepository.save(any(Meta.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Meta resultado = metaService.guardarMeta(dto, objetivo);

        ArgumentCaptor<Meta> captor = ArgumentCaptor.forClass(Meta.class);

        verify(metaRepository).save(captor.capture());

        Meta metaGuardada = captor.getValue();

        assertSame(resultado, metaGuardada);
        assertEquals(objetivo, metaGuardada.getIdObjetivoEspecifico());
        assertEquals((short) 11, metaGuardada.getIdCodigoTipoMeta());
        assertNull(metaGuardada.getCantidad());
        assertEquals(
                "Se documentan observaciones cualitativas del proyecto.",
                metaGuardada.getDescripcion()
        );

        verify(indicadorService).guardarIndicador(indicador, metaGuardada);
    }
}