package org.example.backend_cices_system.consult.presupuesto.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.consult.presupuesto.repository.RepPresupuestoBaseRepository;
import org.example.backend_cices_system.consult.presupuesto.dto.PresupuestoDatosDTO;
import org.example.backend_cices_system.consult.presupuesto.dto.PresupuestoFiltroDTO;
import org.example.backend_cices_system.consult.presupuesto.specification.PresupuestoSpecification;
import org.example.backend_cices_system.consult.presupuesto.view.RepPresupuestoBase;
import org.example.backend_cices_system.export.dto.GastoReporteDTO;
import org.example.backend_cices_system.export.dto.HorasAsignadasReporteDTO;
import org.example.backend_cices_system.export.dto.PresupuestoReporteDTO;
import org.example.backend_cices_system.export.dto.PresupuestoResumenReporteDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepPresupuestoBaseService {

    private final RepPresupuestoBaseRepository repo;
    private final RepPresupuestoGastosService repPresupuestoGastosService;
    private final RepPresupuestoHorasService repPresupuestoHorasService;

    private RepPresupuestoBase obtenerPorIdPresupuesto(Integer idPresupuesto){
        return repo.findById(idPresupuesto).orElseThrow(
                () -> new RuntimeException("Presupuesto no encontrado con id: " + idPresupuesto));
    }

    public Page<RepPresupuestoBase> buscarPresupuestosBase(
            PresupuestoFiltroDTO filtro,
            String ordenarPor,
            String direccion,
            Pageable pageable
    ) {

        Specification<RepPresupuestoBase> spec =
                PresupuestoSpecification.filtrar(filtro);

        Sort sort = Sort.unsorted();

        if (ordenarPor != null && direccion != null) {
            Sort.Direction dir = "desc".equalsIgnoreCase(direccion)
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;

            sort = switch (ordenarPor) {
                case "fecha" -> Sort.by(dir, "fechaAsignacion");
                case "monto" -> Sort.by(dir, "montoAsignado");
                case "horas" -> Sort.by(dir, "horasAsignadas");
                default -> Sort.unsorted();
            };
        }

        Pageable finalPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sort
        );

        return repo.findAll(spec, finalPageable);
    }

    public PresupuestoReporteDTO obtenerPresupuestoReporteDTOPorIdPresupuesto(Integer idPresupuesto){
        var presupuesto = obtenerPorIdPresupuesto(idPresupuesto);
        if (presupuesto.getTipoPresupuesto().equalsIgnoreCase("HORAS")){
            var horas = repPresupuestoHorasService.buscarPorIdPresupuesto(idPresupuesto);
            return obtenerPresupuestoReporteDTO(presupuesto, null, horas);
        }
        else {
            var gastos = repPresupuestoGastosService.buscarPorIdPresupuesto(idPresupuesto);
            return obtenerPresupuestoReporteDTO(presupuesto, gastos, null);
        }
    }

    public Page<PresupuestoReporteDTO> consultaPorProyectoYTipo(
            PresupuestoFiltroDTO filtro,
            String ordenarPorPresupuesto,
            String direccionPresupuesto,
            String ordenarPorGasto,
            String direccionGasto,
            Pageable pageable
    ){
        Page<RepPresupuestoBase> page = buscarPresupuestosBase(
                filtro,
                ordenarPorPresupuesto,
                direccionPresupuesto,
                pageable
        );

        return page.map(rep -> {

            Integer idPresupuesto = rep.getIdPresupuesto();

            if (filtro.tipoPresupuesto().equalsIgnoreCase("HORAS")) {

                var horasPage = repPresupuestoHorasService.buscarPorIdPresupuestoPaginado(
                        idPresupuesto,
                        PageRequest.of(0, 10),
                        ordenarPorGasto,
                        direccionGasto
                );

                return obtenerPresupuestoReporteDTO(
                        rep,
                        null,
                        horasPage.getContent()
                );

            } else {

                var gastosPage = repPresupuestoGastosService.buscarPorIdPresupuestoPaginado(
                        idPresupuesto,
                        PageRequest.of(0, 10),
                        ordenarPorGasto,
                        direccionGasto
                );

                return obtenerPresupuestoReporteDTO(
                        rep,
                        gastosPage.getContent(),
                        null
                );
            }
        });
    }

    public PresupuestoReporteDTO obtenerPresupuestoReporteDTO(RepPresupuestoBase presupuestoBase,
                                                              List<GastoReporteDTO> gastos,
                                                              List<HorasAsignadasReporteDTO> horas){
        var resumen = obtenerResumenPresupuesto(presupuestoBase);
        return new PresupuestoReporteDTO(
                presupuestoBase.getIdPresupuesto(),
                presupuestoBase.getCategoriaPresupuesto(),
                presupuestoBase.getDescripcionPresupuesto(),
                presupuestoBase.getTipoPresupuesto(),
                presupuestoBase.getFechaAsignacion(),
                presupuestoBase.getFuenteFinanciamiento(),
                presupuestoBase.getCantidadHoras(),
                presupuestoBase.getCantidadMeses(),
                presupuestoBase.getMontoAsignado(),
                resumen,
                gastos,
                horas
        );
    }

    // DESPUÉS:
    PresupuestoResumenReporteDTO obtenerResumenPresupuesto(RepPresupuestoBase presupuestoBase) {
        String tipo = presupuestoBase.getTipoPresupuesto();
        if (tipo != null && tipo.equalsIgnoreCase("Horas"))
            return new PresupuestoResumenReporteDTO(
                    presupuestoBase.getHorasAsignadas(),
                    presupuestoBase.getHorasUsadas(),
                    presupuestoBase.getHorasDisponibles(),
                    presupuestoBase.getCantidadRegistrosHoras()
            );
        else
            return new PresupuestoResumenReporteDTO(
                    presupuestoBase.getMontoAsignado(),
                    presupuestoBase.getTotalGastado(),
                    presupuestoBase.getMontoDisponible(),
                    presupuestoBase.getCantidadGastos()
            );
    }

    public PresupuestoDatosDTO obtenerPresupuestoDatosDTO(RepPresupuestoBase presupuestoBase){
        return new PresupuestoDatosDTO(
              presupuestoBase.getIdPresupuesto(),
              presupuestoBase.getCategoriaPresupuesto(),
                presupuestoBase.getDescripcionPresupuesto(),
                presupuestoBase.getFechaAsignacion()
        );
    }

    /**
     * Obtener presupuestos (vista) agrupados por idProyecto.
     */
    public Map<Integer, List<RepPresupuestoBase>> obtenerPorProyectos(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) return Map.of();

        List<RepPresupuestoBase> filas = repo.findByIdProyectoIn(ids);

        return filas.stream()
                .collect(Collectors.groupingBy(RepPresupuestoBase::getIdProyecto));
    }

    public List<RepPresupuestoBase> obtenerPorProyecto(Integer idProyecto) {
        if (idProyecto == null) return List.of();
        return repo.findByIdProyecto(idProyecto); // o findByIdProyecto si existe
    }
}

