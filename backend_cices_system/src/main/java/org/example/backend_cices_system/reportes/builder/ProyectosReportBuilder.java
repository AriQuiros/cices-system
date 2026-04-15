package org.example.backend_cices_system.reportes.builder;

import org.example.backend_cices_system.dto.ProyectoDatosDTO;
import org.example.backend_cices_system.reportes.model.*;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class ProyectosReportBuilder implements ReportBuilder<List<ProyectoDatosDTO>> {

    @Override
    public ReportDocument build(List<ProyectoDatosDTO> proyectos) {

        List<ReportSection> sections = new ArrayList<>();

        // =========================
        // 1. SECCIÓN RESUMEN
        // =========================
        sections.add(buildResumen(proyectos));

        // =========================
        // 2. SECCIÓN POR PROYECTO
        // =========================
        for (ProyectoDatosDTO p : proyectos) {
            sections.add(buildProyecto(p));
        }

        return new ReportDocument(
                "Reporte de Proyectos",
                "CICES — Sistema de Gestión",
                LocalDate.now(),
                sections
        );
    }

    private ReportSection buildResumen(List<ProyectoDatosDTO> proyectos) {

        List<ReportElement> elements = new ArrayList<>();

        elements.add(buildTablaResumen(proyectos));

        return new ReportSection(
                "Resumen general",
                1,
                elements
        );
    }

    private ReportTable buildTablaResumen(List<ProyectoDatosDTO> proyectos) {

        long total = proyectos.size();

        long activos = proyectos.stream()
                .filter(p -> "ACTIVO".equalsIgnoreCase(p.estado()))
                .count();

        long finalizados = proyectos.stream()
                .filter(p -> "FINALIZADO".equalsIgnoreCase(p.estado()))
                .count();


        List<List<String>> rows = List.of(
                List.of("Activos", String.valueOf(activos)),
                List.of("Finalizados", String.valueOf(finalizados)),
                List.of("Total de proyectos", String.valueOf(total))
        );

        return new ReportTable(null, rows);
    }
    private ReportSection buildProyecto(ProyectoDatosDTO p) {

        List<ReportElement> elements = new ArrayList<>();

        elements.add(new ReportParagraph("Nombre: " + p.nombreProyecto()));
        elements.add(new ReportParagraph("Estado: " + p.estado()));
        elements.add(new ReportParagraph(
                "Período: " + p.fechaInicio() + " al " + p.fechaFinalizacion()
        ));
        elements.add(new ReportParagraph("Tipo: " + p.tipoProyecto()));
        elements.add(new ReportParagraph("Linea de investigación: " + p.lineaInvestigacion()));


        return new ReportSection(
                p.codigoProyecto(),
                1, // Heading1 en Word
                elements
        );
    }

}
