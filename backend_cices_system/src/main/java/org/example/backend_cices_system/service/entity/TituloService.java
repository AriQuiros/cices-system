package org.example.backend_cices_system.service.entity;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.repository.entity.TituloRepository;
import org.example.backend_cices_system.dto.entity.TituloDTO;
import org.example.backend_cices_system.model.entity.Entidad;
import org.example.backend_cices_system.model.entity.Investigador;
import org.example.backend_cices_system.model.entity.Titulo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TituloService {

    private final TituloRepository tituloRepository;
    private final CatalogoService catalogoService;
    private final EntidadService entidadService;

    public Titulo guardarTitulo(TituloDTO tituloDTO, Investigador investigador){
        var id = tituloDTO.id();
        var titulo = id != null ? obtenerPorId(id) : new Titulo();
        titulo.setIdInvestigador(investigador);

        Entidad idEntidadEmisora = entidadService.guardarEntidad(tituloDTO.entidadEmisora());

        titulo.setIdEntidad(idEntidadEmisora);
        titulo.setNombreTitulo(tituloDTO.nombreTitulo());

        titulo.setIdCodigoTipoNivelTitulo(tituloDTO.nivelTitulo().id());

        titulo.setFechaEmision(tituloDTO.fechaEmision());

        tituloRepository.save(titulo);
        return titulo;
    }

    public List<Titulo> obtenerTitulosInvestigador(Investigador investigador){
        return tituloRepository.findByIdInvestigador(investigador);
    }

    public TituloDTO obtenerDTO (Titulo titulo){
        return new TituloDTO(
                titulo.getId(),
                entidadService.obtenerDTO(titulo.getIdEntidad()),
                titulo.getNombreTitulo(),
                catalogoService.obtenerDto(titulo.getIdCodigoTipoNivelTitulo()),
                titulo.getFechaEmision()
        );
    }

    public List<TituloDTO> tituloDTOList(Investigador investigador){
        return obtenerTitulosInvestigador(investigador).stream()
                .map(this::obtenerDTO).toList();
    }

    public Titulo obtenerPorId(Integer id){
        return tituloRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException
                        ("No se encontró titulo con id '" + id + "'"));
    }

    public TituloDTO eliminarTitulo(Integer id){
        var tituloDto = obtenerDTO(obtenerPorId(id));
        tituloRepository.deleteById(id);
        return tituloDto;
    }

}
