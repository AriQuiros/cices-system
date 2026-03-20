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
        var titulo = new Titulo();
        titulo.setIdInvestigador(investigador);

        Entidad idEntidadEmisora = entidadService.guardarEntidad(tituloDTO.entidadEmisora());

        titulo.setIdEntidad(idEntidadEmisora);
        titulo.setNombreTitulo(tituloDTO.nombreTitulo());

        titulo.setIdCodigoTipoNivelTitulo(tituloDTO.nivelTitulo().id());

        titulo.setFechaEmision(tituloDTO.fechaEmision());

        tituloRepository.save(titulo);
        return titulo;
    }


}
