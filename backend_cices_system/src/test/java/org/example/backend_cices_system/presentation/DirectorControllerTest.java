package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.dto.DirectorResumenDTO;
import org.example.backend_cices_system.service.DirectorService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DirectorControllerTest {

    @Mock
    private DirectorService service;

    @InjectMocks
    private DirectorController controller;

    @Test
    void resumen_defaultDias() {
        DirectorResumenDTO dto = new DirectorResumenDTO(2,10,20,5,3,15);
        when(service.get(30)).thenReturn(dto);

        DirectorResumenDTO result = controller.resumen(30);

        assertSame(dto, result);
        verify(service).get(30);
        verifyNoMoreInteractions(service);
    }

    @Test
    void resumen_customDias() {
        DirectorResumenDTO dto = new DirectorResumenDTO(1,5,10,2,1,7);
        when(service.get(7)).thenReturn(dto);

        DirectorResumenDTO result = controller.resumen(7);

        assertSame(dto, result);
        verify(service).get(7);
        verifyNoMoreInteractions(service);
    }
}
