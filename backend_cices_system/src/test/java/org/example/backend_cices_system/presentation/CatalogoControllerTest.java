package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.data.RolRepository;
import org.example.backend_cices_system.dto.CodigoDTO;
import org.example.backend_cices_system.logic.Rol;
import org.example.backend_cices_system.service.CatalogoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CatalogoControllerTest {

    @Mock
    private RolRepository rolRepository;

    @Mock
    private CatalogoService catalogoService;

    @InjectMocks
    private CatalogoController catalogoController;

    //se hace un test por cada peticion
    @Test
    void testObtenerRoles(){

        Rol rol1 = new Rol();
        rol1.setId(Short.valueOf("1"));
        rol1.setNombreRol("DIRECTOR");

        Rol rol2 = new Rol();
        rol2.setId(Short.valueOf("2"));
        rol2.setNombreRol("ADMINISTRADOR");

        // Arrange: simulamos la lista de roles devuelta por el repositorio
        List<Rol> roles = List.of(rol1, rol2);
        when(rolRepository.findAll()).thenReturn(roles);

        // Act
        ResponseEntity<List<Rol>> response = catalogoController.obtenerRoles();

        // Assert
        assertNotNull(response);
        assertEquals(roles, response.getBody());
        verify(rolRepository, times(1)).findAll();
    }

    @Test
    void obtenerPorTipos() {
        // Arrange: simulamos la respuesta del service
        List<String> tipos = List.of("Identificacion", "GradoAcademico");
        Map<String, List<CodigoDTO>> codigos = Map.of(
                "Identificacion", List.of(new CodigoDTO(Short.valueOf("1"), "test1","test1" )),
                "GradoAcademico", List.of(new CodigoDTO(Short.valueOf("2"), "test2","test2" ))
        );

        when(catalogoService.obtenerCodigosPorTipos(tipos)).thenReturn(codigos);

        // Act
        ResponseEntity<Map<String, List<CodigoDTO>>> response = catalogoController.obtenerPorTipos(tipos);

        // Assert
        assertNotNull(response);
        assertEquals(codigos, response.getBody());
        verify(catalogoService, times(1)).obtenerCodigosPorTipos(tipos);
    }

    @Test
    void obtenerGradosAcademicos() {
        // Arrange
        List<CodigoDTO> grados = List.of(new CodigoDTO(Short.valueOf("1"), "Bachillerato", "Bachillerato"));
        when(catalogoService.obtenerGradosAcademicos()).thenReturn(grados);

        // Act
        ResponseEntity<List<CodigoDTO>> response = catalogoController.obtenerGradosAcademicos();

        // Assert
        assertNotNull(response);
        assertEquals(grados, response.getBody());
        verify(catalogoService, times(1)).obtenerGradosAcademicos();
    }

    @Test
    void obtenerTiposIdentificacion() {
        // Arrange
        List<CodigoDTO> tipos = List.of(new CodigoDTO(Short.valueOf("1"), "Nacional", "Nacional"), new CodigoDTO(Short.valueOf("2"), "DIMEX", "DIMEX"));
        when(catalogoService.obtenerTiposIdentificacion()).thenReturn(tipos);

        // Act
        ResponseEntity<List<CodigoDTO>> response = catalogoController.obtenerTiposIdentificacion();

        // Assert
        assertNotNull(response);
        assertEquals(tipos, response.getBody());
        verify(catalogoService, times(1)).obtenerTiposIdentificacion();
    }

    @Test
    void obtenerTiposCertificacion() {
        // Arrange
        List<CodigoDTO> tipos = List.of(new CodigoDTO(Short.valueOf("1"), "Certificación A", "Certificación A"));
        when(catalogoService.obtenerTiposCertificacion()).thenReturn(tipos);

        // Act
        ResponseEntity<List<CodigoDTO>> response = catalogoController.obtenerTiposCertificacion();

        // Assert
        assertNotNull(response);
        assertEquals(tipos, response.getBody());
        verify(catalogoService, times(1)).obtenerTiposCertificacion();
    }
}

