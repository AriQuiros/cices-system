package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.TituloRepository;
import org.example.backend_cices_system.dto.TituloDTO;
import org.example.backend_cices_system.logic.Entidad;
import org.example.backend_cices_system.logic.Investigador;
import org.example.backend_cices_system.logic.Titulo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TituloService {

    private final TituloRepository tituloRepository;
    private final CatalogoService catalogoService;
    private final EntidadService entidadService;

    public TituloService(TituloRepository tituloRepository, CatalogoService catalogoService, EntidadService entidadService) {
        this.entidadService = entidadService;
        this.catalogoService = catalogoService;
        this.tituloRepository = tituloRepository;
    }

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
