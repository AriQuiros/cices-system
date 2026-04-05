package org.example.backend_cices_system.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.PresupuestoRepository;
import org.example.backend_cices_system.dto.PresupuestoDTO;
import org.example.backend_cices_system.logic.Presupuesto;
import org.example.backend_cices_system.logic.Proyecto;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.service.audit.PresupuestoBitService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PresupuestoService {
    private final PresupuestoRepository presupuestoRepository;
    private final PresupuestoBitService presupuestoBitService;
    private final CatalogoService catalogoService;


    public Integer guardarPresupuesto(List<PresupuestoDTO> listDTO, Proyecto proyecto) {
        for(PresupuestoDTO presupuestoDTO:listDTO) {
            System.out.println(presupuestoDTO.id());
            var presupuesto = new Presupuesto();
            presupuesto.setIdProyecto(proyecto);
            presupuesto.setDescripcion(presupuestoDTO.descripcion());
            presupuesto.setFechaAsignacion(presupuestoDTO.fechaAsignacion());

            presupuesto.setIdCodigoTipoPresupuesto(presupuestoDTO.tipoPresupuesto().id());
            presupuesto.setIdCodigoTipoCategoria(presupuestoDTO.categoria().id());

            if (presupuestoDTO.tipoPresupuesto().valor().equalsIgnoreCase("FINANCIERO")) {
                presupuesto.setIdCodigoTipoFuenteFinanciamiento(presupuestoDTO.fuenteFinanciamiento().id());
                presupuesto.setMontoAsignado(presupuestoDTO.monto());
            } else {
                presupuesto.setCantidadMeses(presupuestoDTO.cantidadMeses());
                presupuesto.setCantidadHorasMes(presupuestoDTO.cantidadHorasMes());
            }

            presupuestoRepository.save(presupuesto);
        }
        return listDTO.size();
    }

    public PresupuestoDTO actualizarPresupuesto(PresupuestoDTO presupuestoDTO, Usuario usuario){
        Presupuesto presupuesto = obtenerPresupuesto(presupuestoDTO.id());

        if(existenCambios(presupuestoDTO, presupuesto)) {
            presupuestoBitService.registrarBitacora(presupuesto,
                    usuario.getId(),
                    'U');
        }

        presupuesto.setDescripcion(presupuestoDTO.descripcion());
        presupuesto.setFechaAsignacion(presupuestoDTO.fechaAsignacion());

        presupuesto.setIdCodigoTipoPresupuesto(presupuestoDTO.tipoPresupuesto().id());
        presupuesto.setIdCodigoTipoCategoria(presupuestoDTO.categoria().id());

        if (presupuestoDTO.tipoPresupuesto().valor().equalsIgnoreCase("FINANCIERO")) {
            presupuesto.setIdCodigoTipoFuenteFinanciamiento(presupuestoDTO.fuenteFinanciamiento().id());
            presupuesto.setMontoAsignado(presupuestoDTO.monto());
        } else {
            presupuesto.setCantidadMeses(presupuestoDTO.cantidadMeses());
            presupuesto.setCantidadHorasMes(presupuestoDTO.cantidadHorasMes());
        }

        presupuestoRepository.save(presupuesto);

        return presupuestoDTO;
    }

    public List<PresupuestoDTO> obtenerPresupuestosPorProyecto(Proyecto proyecto) {
        return presupuestoRepository.findPresupuestoByIdProyecto(proyecto).stream()
                .map(this::obtenerDTO)
                .toList();
    }
    public PresupuestoDTO obtenerDTO(Presupuesto p){
        return new PresupuestoDTO(
                p.getId(),
                p.getDescripcion(),
                catalogoService.obtenerDto(p.getIdCodigoTipoCategoria()),
                p.getFechaAsignacion(),
                catalogoService.obtenerDto(p.getIdCodigoTipoPresupuesto()),
                p.getIdCodigoTipoFuenteFinanciamiento() != null
                        ? catalogoService.obtenerDto(p.getIdCodigoTipoFuenteFinanciamiento())
                        : null,
                p.getMontoAsignado(),
                p.getCantidadHorasMes(),
                p.getCantidadMeses(),
                null,
                null
        );
    }

    public Presupuesto buscarPresupuestoHorasXProyecto(Proyecto proyecto, String descripcion) {
        return presupuestoRepository.findByIdProyectoAndIdCodigoTipoPresupuestoAndDescripcion(proyecto,
                        catalogoService.codigoXNombreValor("TIPO_PRESUPUESTO", "HORAS"), descripcion)
                .orElseThrow(() -> new RuntimeException("Presupuesto de horas no encontrado para el proyecto dado"));
    }

    public Presupuesto obtenerPresupuesto(Integer idPresupuesto) {
        return presupuestoRepository.findById(idPresupuesto)
                .orElseThrow(() -> new RuntimeException("Presupuesto no encontrado para el ID: " + idPresupuesto));
    }

    private boolean existenCambios(PresupuestoDTO presupuestoDTO, Presupuesto presupuesto){
        var monto = presupuestoDTO.monto();
        var cantidadMeses = presupuestoDTO.cantidadMeses();
        var horasMes = presupuestoDTO.cantidadHorasMes();

        return monto != null ? !monto.equals(presupuesto.getMontoAsignado()) :
                !cantidadMeses.equals(presupuesto.getCantidadMeses()) ||
                        !horasMes.equals(presupuesto.getCantidadHorasMes());
    }
}
