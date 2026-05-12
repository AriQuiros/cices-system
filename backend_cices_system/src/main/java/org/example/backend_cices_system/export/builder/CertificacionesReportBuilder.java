package org.example.backend_cices_system.export.builder;

import org.example.backend_cices_system.consult.investigador.dto.FormacionDTO;
import org.example.backend_cices_system.export.model.ReportDocument;
import org.example.backend_cices_system.export.model.ReportSection;
import org.example.backend_cices_system.export.model.ReportTable;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.example.backend_cices_system.export.builder.ReportBuilderUtils.fmt;

@Component
public class CertificacionesReportBuilder implements ReportBuilder<List<FormacionDTO>> {

    @Override
    public ReportDocument build(List<FormacionDTO> certificaciones) {

        List<ReportSection> sections = new ArrayList<>();

        // =========================
        // 1. RESUMEN
        // =========================
        sections.add(buildResumen(certificaciones));

        // =========================
        // 2. TABLA PRINCIPAL
        // =========================
        sections.add(buildTabla(certificaciones));

        return new ReportDocument(
                "Reporte de Certificaciones",
                "CICES — Sistema de Gestión",
                LocalDate.now(),
                sections
        );
    }

    // -------------------------
    // RESUMEN CUANTITATIVO
    // -------------------------
    private ReportSection buildResumen(List<FormacionDTO> data) {

        long total = data.size();

        long vigentes = data.stream()
                .filter(c -> "VIGENTE".equalsIgnoreCase(c.estado()))
                .count();

        long vencidas = data.stream()
                .filter(c -> "VENCIDA".equalsIgnoreCase(c.estado()))
                .count();

        long proximas = data.stream()
                .filter(c -> "PROXIMA A VENCER".equalsIgnoreCase(c.estado()))
                .count();

        List<List<String>> rows = List.of(
                List.of("Vigentes", String.valueOf(vigentes)),
                List.of("Vencidas", String.valueOf(vencidas)),
                List.of("Próximas a vencer", String.valueOf(proximas)),
                List.of("Total certificaciones", String.valueOf(total))

        );

        return new ReportSection(
                "Resumen general",
                1,
                List.of(new ReportTable(null, rows)) // sin header
        );
    }

    // -------------------------
    // TABLA PRINCIPAL
    // -------------------------
    private ReportSection buildTabla(List<FormacionDTO> data) {

        List<String> headers = List.of(
                "Identificación",
                "Investigador",
                "Certificación",
                "Institución",
                "Tipo",
                "Estado",
                "Fecha Expiración"
        );

        List<List<String>> rows = data.stream()
                .map(c -> List.of(
                        safe(c.identificacionInvestigador()),
                        safe(c.nombreInvestigador()),
                        safe(c.nombre()),
                        safe(c.institucion()),
                        safe(c.tipo()),
                        safe(c.estado()),
                        fmt(c.fecha())
                ))
                .toList();

        return new ReportSection(
                "Listado de certificaciones",
                1,
                List.of(new ReportTable(headers, rows))
        );
    }

    private String safe(String val) {
        return val != null ? val : "";
    }
}
