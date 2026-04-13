package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.CertificacionRepository;
import org.example.backend_cices_system.dto.CertificacionDTO;
import org.example.backend_cices_system.dto.CodigoDTO;
import org.example.backend_cices_system.dto.EntidadDTO;
import org.example.backend_cices_system.logic.Certificacion;
import org.example.backend_cices_system.logic.Entidad;
import org.example.backend_cices_system.logic.Investigador;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CertificacionServiceTest {

    @Mock
    private CertificacionRepository certificacionRepository;

    @Mock
    private CatalogoService catalogoService;

    @Mock
    private EntidadService entidadService;

    @InjectMocks
    private CertificacionService certificacionService;

    @Captor
    private ArgumentCaptor<Certificacion> certificacionCaptor;

    @Test
    void guardarCertificacion_debeActualizarUnaExistenteYCalcularEstado() {
        CodigoDTO tipoEntidad = new CodigoDTO((short) 1, "INSTITUCION", "Institución");
        CodigoDTO tipoCertificacion = new CodigoDTO((short) 20, "ACREDITACION", "Acreditación");

        EntidadDTO entidadDto = new EntidadDTO(3, "Colegio Federado", tipoEntidad);

        LocalDate fechaExpiracion = LocalDate.now().plusDays(30);

        CertificacionDTO dto = new CertificacionDTO(
                55,
                entidadDto,
                "Acreditación ISO 27001",
                tipoCertificacion,
                fechaExpiracion,
                null
        );

        Investigador investigador = new Investigador();
        investigador.setId(100);

        Entidad entidad = new Entidad();
        entidad.setId(3);
        entidad.setNombre("Colegio Federado");

        Certificacion existente = new Certificacion();
        existente.setId(55);

        when(certificacionRepository.findById(55))
                .thenReturn(Optional.of(existente));
        when(entidadService.guardarEntidad(entidadDto))
                .thenReturn(entidad);
        when(catalogoService.codigoXNombreValor(
                "ESTADO_CERTIFICACION",
                "PROXIMA A VENCER"
        )).thenReturn((short) 99);
        when(certificacionRepository.save(any(Certificacion.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Certificacion resultado = certificacionService.guardarCertificacion(dto, investigador);

        assertNotNull(resultado);
        assertEquals(55, resultado.getId());
        assertEquals("Acreditación ISO 27001", resultado.getNombreCertificacion());
        assertEquals(fechaExpiracion, resultado.getFechaExpiracion());
        assertEquals((short) 20, resultado.getIdCodigoTipoCertificacion());
        assertEquals((short) 99, resultado.getIdCodigoTipoEstado());
        assertSame(investigador, resultado.getIdInvestigador());
        assertSame(entidad, resultado.getIdEntidad());

        verify(certificacionRepository).save(certificacionCaptor.capture());
        Certificacion guardada = certificacionCaptor.getValue();
        assertEquals("Acreditación ISO 27001", guardada.getNombreCertificacion());
    }

    @Test
    void guardarCertificacion_conFechaNula_debeMarcarVigente() {
        CodigoDTO tipoEntidad = new CodigoDTO((short) 1, "INSTITUCION", "Institución");
        CodigoDTO tipoCertificacion = new CodigoDTO((short) 20, "ACREDITACION", "Acreditación");

        EntidadDTO entidadDto = new EntidadDTO(3, "Colegio Federado", tipoEntidad);

        CertificacionDTO dto = new CertificacionDTO(
                null,
                entidadDto,
                "Licencia profesional",
                tipoCertificacion,
                null,
                null
        );

        Investigador investigador = new Investigador();
        investigador.setId(100);

        Entidad entidad = new Entidad();
        entidad.setId(3);
        entidad.setNombre("Colegio Federado");

        when(entidadService.guardarEntidad(entidadDto))
                .thenReturn(entidad);
        when(catalogoService.codigoXNombreValor(
                "ESTADO_CERTIFICACION",
                "VIGENTE"
        )).thenReturn((short) 10);
        when(certificacionRepository.save(any(Certificacion.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Certificacion resultado = certificacionService.guardarCertificacion(dto, investigador);

        assertNotNull(resultado);
        assertNull(resultado.getId());
        assertEquals("Licencia profesional", resultado.getNombreCertificacion());
        assertNull(resultado.getFechaExpiracion());
        assertEquals((short) 10, resultado.getIdCodigoTipoEstado());

        verify(catalogoService).codigoXNombreValor("ESTADO_CERTIFICACION", "VIGENTE");
    }

    @Test
    void obtenerEstadoCertificacion_debeRetornarVencidaVigenteOProximaAVencer() {
        assertEquals(
                "VENCIDA",
                certificacionService.obtenerEstadoCertificacion(LocalDate.now().minusDays(1))
        );

        assertEquals(
                "PROXIMA A VENCER",
                certificacionService.obtenerEstadoCertificacion(LocalDate.now().plusDays(30))
        );

        assertEquals(
                "VIGENTE",
                certificacionService.obtenerEstadoCertificacion(LocalDate.now().plusDays(120))
        );
    }
}