package org.example.backend_cices_system.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.HorasAsignadasRepository;
import org.example.backend_cices_system.dto.HorasAsignadasDTO;
import org.example.backend_cices_system.dto.InvestigadorProyectoDTO;
import org.example.backend_cices_system.logic.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HorasAsignadasService {
    private final HorasAsignadasRepository horasAsignadasRepository;
    private final PresupuestoService presupuestoService;
    private final InvestigadorProyectoService investigadorProyectoService;
    private final CatalogoService catalogoService;

    public HorasAsignada obtenerHoraAsignada(Integer id){
        return horasAsignadasRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hora Asignada no encontrada para el ID: " + id));
    }

    public int guardarHorasAsignadas(List<HorasAsignadasDTO> horasDTO) {
        for (HorasAsignadasDTO dto:horasDTO) {
            var horasAsignadas = new HorasAsignada();
            var investigadorProyecto = investigadorProyectoService.obtenerInvestigadorProyecto(dto.investigador().id());

            horasAsignadas.setIdInvestigadorProyecto(investigadorProyecto);
            Presupuesto presupuesto = presupuestoService.obtenerPresupuesto(dto.idPresupuesto());
            horasAsignadas.setIdPresupuesto(presupuesto);
            horasAsignadas.setIdCodigoTipoModalidad(dto.modalidad().id());
            horasAsignadas.setCantidadHorasMes(dto.cantidadHorasMes());
            horasAsignadas.setCantidadMeses(dto.cantidadMeses());

            horasAsignadasRepository.save(horasAsignadas);
        }
        return horasDTO.size();
    }

    public HorasAsignadasDTO actualizarHora(HorasAsignadasDTO dto){
        var hora = obtenerHoraAsignada(dto.id());
        hora.setIdCodigoTipoModalidad(dto.modalidad().id());
        hora.setCantidadHorasMes(dto.cantidadHorasMes());
        hora.setCantidadMeses(dto.cantidadMeses());

        horasAsignadasRepository.save(hora);
        return dto;
    }

    public String eliminarHora(Integer id){
        var hora = obtenerHoraAsignada(id);
        var investigador = hora.getIdInvestigadorProyecto().getIdInvestigador().getIdEmpleado().getNombreCompleto();
        horasAsignadasRepository.deleteById(id);
        return investigador;
    }

    public boolean existInvProyecto (Integer id){
        return horasAsignadasRepository.existsByIdInvestigadorProyecto_Id(id);
    }

    public HorasAsignadasDTO obtenerHoraAsignadaDTO (HorasAsignada horasAsignada){
        return new HorasAsignadasDTO(
                horasAsignada.getId(),
                investigadorProyectoService.obtenerDTO(horasAsignada.getIdInvestigadorProyecto()),
                horasAsignada.getIdPresupuesto().getId(),
                catalogoService.obtenerDto(horasAsignada.getIdCodigoTipoModalidad()),
                null,
                horasAsignada.getCantidadHorasMes(),
                horasAsignada.getCantidadMeses()
        );
    }
}
