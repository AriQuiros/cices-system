package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.ObjetivoEspecificoRepository;
import org.example.backend_cices_system.dto.CodigoDTO;
import org.example.backend_cices_system.dto.IndicadorDTO;
import org.example.backend_cices_system.dto.MetaDTO;
import org.example.backend_cices_system.dto.ObjetivoEspecificoDTO;
import org.example.backend_cices_system.logic.ObjetivoEspecifico;
import org.example.backend_cices_system.logic.Proyecto;
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
class ObjetivosEspecificosServiceTest {

    @Mock
    private ObjetivoEspecificoRepository objetivoEspecificoRepository;

    @Mock
    private MetaService metaService;

    @InjectMocks
    private ObjetivosEspecificosService objetivosEspecificosService;

    @Test
    void guardarObjetivoEspecifico_debeGuardarObjetivoYDelegarMetas() {
        Proyecto proyecto = new Proyecto();
        proyecto.setId(1001);
        proyecto.setCodigoProyecto("CICES-CUST-001");

        MetaDTO metaCuantitativa = new MetaDTO(
                null,
                new CodigoDTO((short) 10, "CUANTITATIVA", "Cuantitativa"),
                25,
                "Se registran 25 encuestas estructuradas.",
                List.of(new IndicadorDTO(null, "Cantidad de encuestas registradas."))
        );

        MetaDTO metaCualitativa = new MetaDTO(
                null,
                new CodigoDTO((short) 11, "CUALITATIVA", "Cualitativa"),
                null,
                "Se documentan observaciones cualitativas del proyecto.",
                List.of(new IndicadorDTO(null, "Descripción de hallazgos cualitativos."))
        );

        ObjetivoEspecificoDTO dto = new ObjetivoEspecificoDTO(
                null,
                "",
                "Objetivo específico actualizado con datos cuantitativos y cualitativos.",
                List.of(metaCuantitativa, metaCualitativa)
        );

        when(objetivoEspecificoRepository.save(any(ObjetivoEspecifico.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        objetivosEspecificosService.guardarObjetivoEspecifico(dto, proyecto);

        ArgumentCaptor<ObjetivoEspecifico> captor =
                ArgumentCaptor.forClass(ObjetivoEspecifico.class);

        verify(objetivoEspecificoRepository).save(captor.capture());

        ObjetivoEspecifico objetivoGuardado = captor.getValue();

        assertEquals(proyecto, objetivoGuardado.getIdProyecto());
        assertEquals(
                "Objetivo específico actualizado con datos cuantitativos y cualitativos.",
                objetivoGuardado.getDescripcion()
        );

        verify(metaService).guardarMeta(metaCuantitativa, objetivoGuardado);
        verify(metaService).guardarMeta(metaCualitativa, objetivoGuardado);
        verifyNoMoreInteractions(metaService);
    }
}