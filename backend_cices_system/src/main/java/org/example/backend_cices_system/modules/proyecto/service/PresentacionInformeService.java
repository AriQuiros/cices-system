package org.example.backend_cices_system.modules.proyecto.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.proyecto.repository.PresentacionInformeRepository;
import org.example.backend_cices_system.modules.proyecto.dto.InformeDTO;
import org.example.backend_cices_system.modules.proyecto.model.PresentacionInforme;
import org.example.backend_cices_system.modules.proyecto.model.Proyecto;
import org.example.backend_cices_system.shared.catalogo.CatalogoService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PresentacionInformeService {

    private final PresentacionInformeRepository presentacionInformeRepository;
    private final CatalogoService catalogoService;

    public void guardarPresentacionInforme(InformeDTO informeDTO, Proyecto proyecto) {
        var id = informeDTO.id();
        var presentacionInforme = id != null ? obtenerPorId(id) : new PresentacionInforme();
        presentacionInforme.setIdProyecto(proyecto);
        presentacionInforme.setFechaPresentacion(informeDTO.fechaPresentacion());
        presentacionInforme.setIdCodigoTipoInforme(informeDTO.tipoInforme().id());
        Short codigoEstadoInforme = obtenerCodigoEstadoInforme(informeDTO.fechaPresentacion());
        presentacionInforme.setIdCodigoTipoEstado(codigoEstadoInforme);

        presentacionInformeRepository.save(presentacionInforme);
    }

    public Short obtenerCodigoEstadoInforme(LocalDate fechaPresentacion) {
        var fechaActual = LocalDate.now();
        boolean entregado = fechaPresentacion.isAfter(fechaActual);
        if (!entregado)
            return catalogoService.codigoXNombreValor("ESTADO_INFORME", "PENDIENTE");
        else
            return catalogoService.codigoXNombreValor("ESTADO_INFORME", "ENTREGADO");
    }

    public PresentacionInforme obtenerPorId(Integer id){
        return presentacionInformeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("presentacion informe no encontrado para id: " + id));
    }

    public InformeDTO obtenerDTO ( PresentacionInforme presentacionInforme){
        return new InformeDTO(
                presentacionInforme.getId(),
                catalogoService.obtenerDto(presentacionInforme.getIdCodigoTipoInforme()),
                presentacionInforme.getFechaPresentacion(),
                catalogoService.obtenerDto(presentacionInforme.getIdCodigoTipoEstado())
        );
    }

    public List<InformeDTO> informeDTOList(Proyecto proyecto){
        return presentacionInformeRepository.findPresentacionInformeByIdProyecto(proyecto).stream()
                .map(this::obtenerDTO).toList();
    }

    public List<PresentacionInforme> buscarEntreFechas(LocalDate inicio, LocalDate fin) {
        return presentacionInformeRepository
                .findByFechaPresentacionBetween(inicio, fin);
    }
}
