package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.*;
import org.example.backend_cices_system.dto.CodigoDTO;
import org.example.backend_cices_system.logic.Codigo;
import org.example.backend_cices_system.logic.Tipo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CatalogoServiceTest {
    @Mock
    private CatalogoRepository catalogoRepository;

    @InjectMocks
    private CatalogoService catalogoService;

    @Test
    void obtenerIdCodigoPorTipoYValor() {
        // Arrange
        Codigo codigo = new Codigo();
        codigo.setId(Short.valueOf("10"));
        when(catalogoRepository.findByIdTipoNombreAndValor("TIPO1", "VALOR1"))
                .thenReturn(Optional.of(codigo));

        // Act
        Short id = catalogoService.obtenerIdCodigoPorTipoYValor("TIPO1", "VALOR1");

        // Assert
        assertEquals(Short.valueOf("10"), id);
    }

    @Test
    void obtenerIdCodigoPorTipoYValor_NotFound_Throws() {
        // Arrange
        when(catalogoRepository.findByIdTipoNombreAndValor("TIPO1", "VALOR1"))
                .thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> catalogoService.obtenerIdCodigoPorTipoYValor("TIPO1", "VALOR1"));
        assertTrue(ex.getMessage().contains("Código no encontrado"));
    }

    @Test
    void obtenerCodigosPorTipos() {
        // Arrange
        Tipo tipo1 = new Tipo();
        tipo1.setNombre("TIPO1");

        Codigo c1 = new Codigo();
        c1.setId(Short.valueOf("1"));
        c1.setDespliegue("primer");
        c1.setValor("VAL1");
        c1.setIdTipo(tipo1);

        Codigo c2 = new Codigo();
        c2.setId(Short.valueOf("2"));
        c2.setDespliegue("segundo");
        c2.setValor("VAL2");
        c2.setIdTipo(tipo1);

        when(catalogoRepository.findByIdTipoNombreIn(List.of("TIPO1")))
                .thenReturn(List.of(c1, c2));

        // Act
        Map<String, List<CodigoDTO>> result = catalogoService.obtenerCodigosPorTipos(List.of("TIPO1"));

        // Assert
        assertEquals(1, result.size());
        assertEquals(2, result.get("TIPO1").size());
        assertEquals("Primer", result.get("TIPO1").get(0).getDespliegue());
        assertEquals("Segundo", result.get("TIPO1").get(1).getDespliegue());
    }

    @Test
    void obtenerGradosAcademicos_ReturnsList() {
        // Arrange
        Codigo c = new Codigo();
        c.setId(Short.valueOf("2"));
        c.setDespliegue("Bachillerato");
        c.setValor("Bachillerato");

        when(catalogoRepository.findByIdTipoId((short)2))
                .thenReturn(List.of(c));

        // Act
        List<CodigoDTO> result = catalogoService.obtenerGradosAcademicos();

        // Assert
        assertEquals(1, result.size());
        assertEquals("Bachillerato", result.get(0).getDespliegue());
    }

    @Test
    void obtenerTiposIdentificacion_ReturnsList() {
        // Arrange
        Codigo c = new Codigo();
        c.setId(Short.valueOf("3"));
        c.setDespliegue("Nacional");
        c.setValor("Nacional");

        when(catalogoRepository.findByIdTipoId((short)1))
                .thenReturn(List.of(c));

        // Act
        List<CodigoDTO> result = catalogoService.obtenerTiposIdentificacion();

        // Assert
        assertEquals(1, result.size());
        assertEquals("Nacional", result.get(0).getDespliegue());
    }

    @Test
    void obtenerTiposCertificacion_ReturnsList() {
        // Arrange
        Codigo c = new Codigo();
        c.setId(Short.valueOf("4"));
        c.setDespliegue("Certificación A");
        c.setValor("Certificación A");

        when(catalogoRepository.findByIdTipoId((short)3))
                .thenReturn(List.of(c));

        // Act
        List<CodigoDTO> result = catalogoService.obtenerTiposCertificacion();

        // Assert
        assertEquals(1, result.size());
        assertEquals("Certificación A", result.get(0).getDespliegue());
    }
}
