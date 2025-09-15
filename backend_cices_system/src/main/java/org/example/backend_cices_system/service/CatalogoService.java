package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.CatalogoRepository;
import org.example.backend_cices_system.dto.CodigoDTO;
import org.example.backend_cices_system.logic.Codigo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CatalogoService {
    @Autowired
    private CatalogoRepository catalogoRepository;

    public Short obtenerIdCodigoPorTipoYValor(String nombreTipo, String valor) {
        return catalogoRepository.findByIdTipoNombreAndValor(nombreTipo, valor)
                .map(Codigo::getId)
                .orElseThrow(() -> new RuntimeException("Código no encontrado: " + valor));
    }

    public Map<String, List<CodigoDTO>> obtenerCodigosPorTipos(List<String> nombresTipos) {
        List<Codigo> codigos = catalogoRepository.findByIdTipoNombreIn(nombresTipos);
        return codigos.stream()
                .collect(Collectors.groupingBy(
                        codigo -> codigo.getIdTipo().getNombre(),
                        Collectors.mapping(
                                codigo -> new CodigoDTO(
                                        codigo.getId(),
                                        codigo.getDespliegue().substring(0,1).toUpperCase() + codigo.getDespliegue().substring(1).toLowerCase(),
                                        codigo.getValor()
                                ),
                                Collectors.toList()
                        )
                ));
    }
    public List<CodigoDTO> obtenerGradosAcademicos() {
        List<Codigo> codigos = catalogoRepository.findByIdTipoId((short)2);
        return codigos.stream()
                .map(c -> new CodigoDTO(c.getId(), c.getDespliegue(), c.getValor()))
                .collect(Collectors.toList());
    }
    public List<CodigoDTO> obtenerTiposIdentificacion() {
        List<Codigo> codigos = catalogoRepository.findByIdTipoId((short)1);
        return codigos.stream()
                .map(c -> new CodigoDTO(c.getId(), c.getDespliegue(), c.getValor()))
                .collect(Collectors.toList());
    }
}

