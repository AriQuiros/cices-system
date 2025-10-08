package org.example.backend_cices_system.service;

import org.example.backend_cices_system.dto.PresupuestoDTO;
import org.example.backend_cices_system.data.PresupuestoRepository;
import org.example.backend_cices_system.logic.Presupuesto;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PresupuestoService {

    @Autowired
    private PresupuestoRepository presupuestoRepository;

    @Autowired
    private CatalogoService catalogoService;

    @Transactional
    public void guardarPresupuestos(List<PresupuestoDTO> presupuestoDTOs, Proyecto proyecto) {
        for (PresupuestoDTO presupuestoDTO : presupuestoDTOs) {
            System.out.println("Registrando presupuestos....");
            Presupuesto presupuesto = new Presupuesto();
            presupuesto.setIdProyecto(proyecto);
            presupuesto.setFechaAsignacion(presupuestoDTO.getFechaAsignacion());
            presupuesto.setDescripcion(presupuestoDTO.getDescripcion());
            presupuesto.setIdCodigoTipoPresupuesto(catalogoService.obtenerIdCodigoPorTipoYValor("TIPO PRESUPUESTO",presupuestoDTO.getTipoPresupuesto()));

            // Verificar y asignar los valores correctos para el presupuesto financiero o de horas
            if ("FINANCIERO".equals(presupuestoDTO.getTipoPresupuesto())) {
                Short idFuente = catalogoService.obtenerIdCodigoPorTipoYValor("FUENTE FINANCIAMIENTO", presupuestoDTO.getFuenteFinanciamiento());
                presupuesto.setIdCodigoFuenteFinanciamiento(idFuente);
                presupuesto.setMonto(presupuestoDTO.getMonto());
            } else if ("HORAS".equals(presupuestoDTO.getTipoPresupuesto())) {
                presupuesto.setCantidadHorasMes(presupuestoDTO.getCantidadHorasMes());
                presupuesto.setCantidadMeses(presupuestoDTO.getCantidadMeses());
            }

            presupuestoRepository.save(presupuesto);
        }
    }
}
