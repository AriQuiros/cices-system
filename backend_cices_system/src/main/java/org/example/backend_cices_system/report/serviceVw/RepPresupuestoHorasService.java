package org.example.backend_cices_system.report.serviceVw;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.HorasAsignadasDTO;
import org.example.backend_cices_system.dto.InvestigadorProyectoDTO;
import org.example.backend_cices_system.report.dao.RepPresupuestoHorasRepository;
import org.example.backend_cices_system.report.view.RepPresupuestoBase;
import org.example.backend_cices_system.report.view.RepPresupuestoHoras;
import org.example.backend_cices_system.reportes.dto.HorasAsignadasReporteDTO;
import org.example.backend_cices_system.service.CatalogoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepPresupuestoHorasService {

    private final RepPresupuestoHorasRepository repo;

    public List<HorasAsignadasReporteDTO> buscarPorIdPresupuesto(Integer idPresupuesto){
        return repo.findByIdPresupuesto(idPresupuesto).stream()
                .map(this::obtenerHorasAsignadasReporteDTO)
                .toList();
    }

    public Map<Integer, List<HorasAsignadasReporteDTO>> agruparPorIdPresupuestos(List<Integer> idPresupuestos){
        return repo.findByIdPresupuestoIn(idPresupuestos)
                .stream()
                .collect(Collectors.groupingBy(
                        RepPresupuestoHoras::getIdPresupuesto,
                        Collectors.mapping(this::obtenerHorasAsignadasReporteDTO, Collectors.toList())
                ));
    }

    public Page<RepPresupuestoHoras> listarHoras(
            String ordenarPor, // "fecha", "horas"
            String direccion,
            int page
    ) {

        Sort sort = Sort.unsorted();

        if (ordenarPor != null) {
            Sort.Direction dir = "desc".equalsIgnoreCase(direccion)
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;

            switch (ordenarPor) {
                case "fecha" -> sort = Sort.by(dir, "fechaInicioInvestigador");
                case "horas" -> sort = Sort.by(dir, "totalHorasPlanificadas");
            }
        }

        Pageable pageable = PageRequest.of(page, 10, sort);

        return repo.findAll(pageable);
    }

    public HorasAsignadasReporteDTO obtenerHorasAsignadasReporteDTO(RepPresupuestoHoras horasAsignadas) {
        return new HorasAsignadasReporteDTO(
                horasAsignadas.getIdHorasAsignadas(),
                horasAsignadas.getNombreCompleto(),
                horasAsignadas.getModalidad(),
                horasAsignadas.getCantidadHorasMes(),
                horasAsignadas.getCantidadMeses(),
                horasAsignadas.getTotalHorasPlanificadas()
        );
    }

    // Metodo principal: obtener horas asignadas por varios proyectos
    public Map<Integer, List<HorasAsignadasReporteDTO>> obtenerPorProyectos(List<Integer> idsProyectos) {

        if (idsProyectos == null || idsProyectos.isEmpty()) return Map.of();

        List<RepPresupuestoHoras> filas = repo.findByIdProyectoIn(idsProyectos);

        return filas.stream()
                .collect(Collectors.groupingBy(
                        RepPresupuestoHoras::getIdPresupuesto,
                        Collectors.mapping(this::obtenerHorasAsignadasReporteDTO, Collectors.toList())
                ));
    }

    public List<HorasAsignadasReporteDTO> obtenerPorProyecto(Integer idProyecto) {
        if (idProyecto == null) return List.of();
        return repo.findByIdProyecto(idProyecto).stream()
                .map(this::obtenerHorasAsignadasReporteDTO)
                .toList();
    }
}
