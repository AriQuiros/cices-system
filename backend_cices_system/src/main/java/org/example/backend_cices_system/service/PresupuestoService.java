package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.PresupuestoRepository;
import org.example.backend_cices_system.dto.PresupuestoDTO;
import org.example.backend_cices_system.logic.Presupuesto;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PresupuestoService {
    private final PresupuestoRepository presupuestoRepository;
    private final CatalogoService catalogoService;

    public PresupuestoService(PresupuestoRepository presupuestoRepository, CatalogoService catalogoService) {
        this.catalogoService = catalogoService;
        this.presupuestoRepository = presupuestoRepository;
    }

    public Presupuesto guardarPresupuesto(PresupuestoDTO presupuestoDTO, Proyecto proyecto) {

        var presupuesto = new org.example.backend_cices_system.logic.Presupuesto();
        presupuesto.setIdProyecto(proyecto);
        presupuesto.setDescripcion(presupuestoDTO.descripcion());
        presupuesto.setFechaAsignacion(presupuestoDTO.fechaAsignacion());

        presupuesto.setIdCodigoTipoPresupuesto(catalogoService.codigoXNombreValor("TIPO_PRESUPUESTO", presupuestoDTO.tipoPresupuesto()));
        presupuesto.setIdCodigoTipoCategoria(catalogoService.codigoXNombreValor("CATEGORIA_PRESUPUESTO", presupuestoDTO.categoria()));

        if(presupuestoDTO.tipoPresupuesto().equalsIgnoreCase("FINANCIERO"))
            presupuesto.setIdCodigoTipoFuenteFinanciamiento(catalogoService.codigoXNombreValor("FUENTE_FINANCIAMIENTO", presupuestoDTO.fuenteFinanciamiento()));

        presupuesto.setMontoAsignado(presupuestoDTO.monto());
        presupuesto.setCantidadMeses(presupuestoDTO.cantidadMeses());
        presupuesto.setCantidadHorasMes(presupuestoDTO.cantidadHorasMes());

        presupuestoRepository.save(presupuesto);

        return presupuesto;
    }

    public List<PresupuestoDTO> obtenerPresupuestosPorProyecto(Proyecto proyecto) {
        return presupuestoRepository.findPresupuestoByIdProyecto(proyecto).stream()
                .map(p -> new PresupuestoDTO(
                        p.getDescripcion(),
                        catalogoService.obtenerDespliegueXCodigo(p.getIdCodigoTipoCategoria()),
                        p.getFechaAsignacion(),
                        catalogoService.obtenerDespliegueXCodigo(p.getIdCodigoTipoPresupuesto()),
                        catalogoService.obtenerDespliegueXCodigo(p.getIdCodigoTipoFuenteFinanciamiento()),
                        p.getMontoAsignado(),
                        p.getCantidadHorasMes(),
                        p.getCantidadMeses()
                ))
                .toList();
    }

    public Presupuesto buscarPresupuestoHorasXProyecto(Proyecto proyecto, String descripcion) {
        return presupuestoRepository.findByIdProyectoAndIdCodigoTipoPresupuestoAndDescripcion(proyecto,
                        catalogoService.codigoXNombreValor("TIPO_PRESUPUESTO", "HORAS"), descripcion)
                .orElseThrow(() -> new RuntimeException("Presupuesto de horas no encontrado para el proyecto dado"));
    }

    public Presupuesto obtenerPorCodigoYCategoria(String codigo, String categoria){
        Short idCategoria = catalogoService.codigoXNombreValor("CATEGORIA_PRESUPUESTO", categoria);
        return presupuestoRepository.findByIdProyecto_CodigoProyectoAndIdCodigoTipoCategoria(codigo, idCategoria)
                .orElseThrow(() -> new RuntimeException("Presupuesto no encontrado para proyecto y categoria"));
    }

    public Presupuesto obtenerPresupuestoXId(Integer idPresupuesto) {
        return presupuestoRepository.findById(idPresupuesto)
                .orElseThrow(() -> new RuntimeException("Presupuesto no encontrado para el ID: " + idPresupuesto));
    }
}
