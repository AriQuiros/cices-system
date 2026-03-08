package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.CatalogoRepository;
import org.example.backend_cices_system.dto.CodigoDTO;
import org.example.backend_cices_system.logic.Codigo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CatalogoService {
    private final CatalogoRepository catalogoRepository;

    public CatalogoService(CatalogoRepository catalogoRepository) {
        this.catalogoRepository = catalogoRepository;
    }

    public Short codigoXNombreValor(String nombre, String valor) {
        return catalogoRepository.findByIdTipoNombreIgnoreCaseAndValorIgnoreCase(nombre, valor)
                .orElseThrow(() -> new RuntimeException("Código no encontrado para nombre: " + nombre + " y valor: " + valor))
                .getId();
    }

    public Map<String, List<CodigoDTO>> obtenerCodigosPorTipos(List<String> nombresTipos) {
        List<Codigo> codigos = catalogoRepository.findByIdTipoNombreIn(nombresTipos);
        return codigos.stream()
                .collect(Collectors.groupingBy(
                        codigo -> codigo.getIdTipo().getNombre(),
                        Collectors.mapping(
                                codigo -> new CodigoDTO(
                                        codigo.getId(),
                                        codigo.getValor(),
                                        codigo.getDespliegue().toLowerCase()
                                ),
                                Collectors.toList()
                        )
                ));
    }

    public String obtenerDespliegueXCodigo(Short idCodigo) {
        return catalogoRepository.findById(idCodigo)
                .orElseThrow(() -> new RuntimeException("Código no encontrado para id: " + idCodigo))
                .getDespliegue();
    }
}
