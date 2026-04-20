package org.example.backend_cices_system.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.IndicadorRepository;
import org.example.backend_cices_system.dto.IndicadorDTO;
import org.example.backend_cices_system.logic.Indicador;
import org.example.backend_cices_system.logic.Meta;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IndicadorService {

    private final IndicadorRepository indicadorRepository;

    @Transactional
    public Indicador guardarIndicador(IndicadorDTO indicadorDTO, Meta meta) {
        var id = indicadorDTO.id();
        var indicador = id != null ? obtenerIndicadorPorId(id) : new Indicador();

        indicador.setIdMeta(meta);
        indicador.setDescripcion(indicadorDTO.descripcion());

        return indicadorRepository.save(indicador);
    }

    public Indicador obtenerIndicadorPorId(Integer id) {
        return indicadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Indicador no encontrado para id: " + id));
    }

    public IndicadorDTO obtenerDTO(Indicador indicador) {
        return new IndicadorDTO(indicador.getId(), indicador.getDescripcion());
    }

    public List<IndicadorDTO> obtenerDTOList(Meta meta) {
        return indicadorRepository.findIndicadorByIdMeta(meta).stream()
                .map(this::obtenerDTO)
                .toList();
    }
}