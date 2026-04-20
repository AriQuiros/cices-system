package org.example.backend_cices_system.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.CatalogoRepository;
import org.example.backend_cices_system.dto.CodigoDTO;
import org.example.backend_cices_system.logic.Codigo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CatalogoService {
    private final CatalogoRepository catalogoRepository;

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
                                        codigo.getDespliegue()
                                ),
                                Collectors.toList()
                        )
                ));
    }

    public Codigo obtenerCodigo(Short id){
        return catalogoRepository.findById(id).orElseThrow(() -> new RuntimeException("Código no encontrado para id: " + id));
    }

    public CodigoDTO obtenerDto(Short id){
        Codigo codigo = obtenerCodigo(id);
        return new CodigoDTO(codigo.getId(),codigo.getValor(),codigo.getDespliegue());
    }

    public List<String> obtenerGradosAcademicos() {
        List<Codigo> codigos = catalogoRepository.findCodigoByIdTipo_Nombre("GRADO_ACADEMICO");
        return codigos.stream().map(Codigo::getDespliegue).toList();
    }
}
