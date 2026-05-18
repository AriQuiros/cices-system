package org.example.backend_cices_system.export.builder;

import org.example.backend_cices_system.export.dto.HorasAsignadasReporteDTO;
import org.example.backend_cices_system.export.dto.ReporteParticipantesDTO;
import org.example.backend_cices_system.export.model.*;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.example.backend_cices_system.export.builder.ReportBuilderUtils.*;

@Component
public class ParticipantesReportBuilder implements ReportBuilder<List<ReporteParticipantesDTO>> {

    private static final int H1 = 1;
    private static final int H2 = 2;

    @Override
    public ReportDocument build(List<ReporteParticipantesDTO> datos) {
        List<ReportSection> sections = new ArrayList<>();
        sections.add(buildResumenGlobal(datos));
        datos.forEach(item -> sections.addAll(buildProyecto(item)));

        return new ReportDocument(
                "Reporte de Participantes",
                "CICES — Sistema de Gestión",
                LocalDate.now(),
                sections
        );
    }

    // H0 — Resumen global
    private ReportSection buildResumenGlobal(List<ReporteParticipantesDTO> datos) {
        long totalProyectos = datos.size();
        long totalParticipantes = datos.stream()
                .mapToLong(ReporteParticipantesDTO::totalParticipantes)
                .sum();

        return section("Resumen General del Reporte", 0, List.of(
                new ReportTable(
                        List.of("Indicador", "Cantidad"),
                        List.of(
                                row("Total proyectos", safe(totalProyectos)),
                                row("Total participantes", safe(totalParticipantes))
                        )
                )
        ));
    }

    // H1 — Por proyecto
    private List<ReportSection> buildProyecto(ReporteParticipantesDTO item) {
        List<ReportSection> sections = new ArrayList<>();

        // H1: código del proyecto
        List<ReportElement> datosBase = new ArrayList<>();
        datosBase.add(para(safe(item.proyecto().nombreProyecto())));
        datosBase.add(para("Período: " + fmt(item.proyecto().fechaInicio())
                + " — " + fmt(item.proyecto().fechaFinalizacion())));

        sections.add(section(safe(item.proyecto().codigoProyecto()), H1, datosBase));

        // H2: participantes
        sections.add(buildTablaParticipantes(item));

        return sections;
    }

    // H2 — Tabla de participantes
    private ReportSection buildTablaParticipantes(ReporteParticipantesDTO item) {

        if (item.participantes() == null || item.participantes().isEmpty()) {
            return section("Participantes", H2,
                    List.of(para("Sin participantes registrados.")));
        }

        List<ReportElement> elementos = new ArrayList<>(buildResumenParticipantes(item));

        elementos.add(new ReportTable(
                List.of("Investigador", "Rol", "Carga académica", "Tiempo",
                        "Horas/mes", "Meses", "Total horas", "Inicio", "Fin"),
                item.participantes().stream()
                        .map(this::participanteAFila)
                        .collect(Collectors.toList())
        ));

        return section("Participantes", H2, elementos);
    }

    private List<ReportElement> buildResumenParticipantes(ReporteParticipantesDTO item) {

        long total = item.participantes().size();

        // Agrupar por rol
        var porRol = item.participantes().stream()
                .collect(Collectors.groupingBy(
                        HorasAsignadasReporteDTO::rolProyecto,
                        Collectors.counting()
                ));

        List<ReportElement> elementos = new ArrayList<>();

        elementos.add(para("Total participantes: " + total));

        porRol.forEach((rol, cantidad) ->
                elementos.add(para("• " + safe(normalizarRol(rol)) + ": " + cantidad))
        );

        return elementos;
    }

    private List<String> participanteAFila(HorasAsignadasReporteDTO p) {
        return List.of(
                safe(p.investigador()),
                safe(normalizarRol(p.rolProyecto())),
                safe(p.modalidad()),
                safe(p.tiempo()),
                fmt(p.horasMes()),
                safe(p.meses()),
                fmt(p.totalHorasAsignadas()),
                fmt(p.fechaInicio()),
                p.fechaFin() != null ? fmt(p.fechaFin()) : "—"
        );
    }

    private String normalizarRol(String rol) {
        if (rol == null || rol.isBlank()) return "—";

        return java.util.Arrays.stream(rol.toLowerCase().split("\\s+"))
                .map(palabra -> palabra.substring(0, 1).toUpperCase() + palabra.substring(1))
                .collect(Collectors.joining(" "));
    }
}