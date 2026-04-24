package org.example.backend_cices_system.modules.investigador.dto;

import org.example.backend_cices_system.shared.entidad.EntidadDTO;
import org.example.backend_cices_system.modules.persona.dto.EmpleadoDTO;

import java.util.List;

public record InvestigadorDTO(
        Integer id,
        EmpleadoDTO empleado,
        EntidadDTO institucionOrigen,
        EntidadDTO unidadAcademica,
        String temaInteres,
        List<TituloDTO> titulos,
        List<CertificacionDTO> certificaciones
) {}

