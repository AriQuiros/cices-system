package org.example.backend_cices_system.dto;

import org.example.backend_cices_system.data.ProyectoRepository;

import java.math.BigDecimal;
import java.time.LocalDate;

public record AsignadoDTO(
        Short id, String nombre, String rol,
        LocalDate ini, LocalDate fin,
        BigDecimal horas, String estado) {

    public static AsignadoDTO of(ProyectoRepository.AsignadoRow r){
        return new AsignadoDTO(r.getId(), r.getNombre(), r.getRol(),
                r.getIni(), r.getFin(), r.getHoras(), r.getEstado());
    }
}
