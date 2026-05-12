package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.report.dao.RepInvestigadorProyectoRepository;
import org.example.backend_cices_system.report.dto.RepInvestigadoresParticipantesDTO;
import org.example.backend_cices_system.report.dto.RepInvestigadoresParticipantesFiltroDTO;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class RepInvestigadoresParticipantesService {

    private final RepInvestigadorProyectoRepository repo;

    public RepInvestigadoresParticipantesService(RepInvestigadorProyectoRepository repo) {
        this.repo = repo;
    }

    public List<RepInvestigadoresParticipantesDTO> obtenerDatosReporte(
            RepInvestigadoresParticipantesFiltroDTO filtros
    ) {
        List<Object[]> rows = repo.obtenerReporteInvestigadoresParticipantesFiltrado(
                normalizarTexto(filtros.getCodigoProyecto()),
                normalizarTexto(filtros.getNombreProyecto()),
                filtros.getIdTipoProyecto(),
                filtros.getIdEstadoProyecto(),
                normalizarTexto(filtros.getLineaInvestigacion())
        );

        return rows.stream()
                .map(this::mapearFila)
                .toList();
    }

    private RepInvestigadoresParticipantesDTO mapearFila(Object[] row) {
        return new RepInvestigadoresParticipantesDTO(
                toLong(row[0]),
                toStringSafe(row[1]),
                toStringSafe(row[2]),
                toLong(row[3]),
                toStringSafe(row[4]),
                toStringSafe(row[5]),
                toStringSafe(row[6]),
                toStringSafe(row[7]),
                toLong(row[8]),
                toLocalDate(row[9]),
                toLocalDate(row[10])
        );
    }

    private String normalizarTexto(String valor) {
        return valor == null || valor.trim().isEmpty() ? null : valor.trim();
    }

    private Long toLong(Object value) {
        if (value == null) return null;

        if (value instanceof BigDecimal bigDecimal) {
            return bigDecimal.longValue();
        }

        if (value instanceof Number number) {
            return number.longValue();
        }

        return Long.valueOf(value.toString());
    }

    private String toStringSafe(Object value) {
        return value == null ? null : value.toString();
    }

    private LocalDate toLocalDate(Object value) {
        if (value == null) return null;

        if (value instanceof Date date) {
            return date.toLocalDate();
        }

        if (value instanceof Timestamp timestamp) {
            return timestamp.toLocalDateTime().toLocalDate();
        }

        return LocalDate.parse(value.toString());
    }

    public long obtenerTotalInvestigadores(List<RepInvestigadoresParticipantesDTO> datos) {
        return datos.stream()
                .map(RepInvestigadoresParticipantesDTO::getIdInvestigador)
                .filter(id -> id != null)
                .distinct()
                .count();
    }

    public Map<String, Long> obtenerTotalPorRol(List<RepInvestigadoresParticipantesDTO> datos) {
        return datos.stream()
                .collect(Collectors.groupingBy(
                        item -> item.getRolProyecto() != null ? item.getRolProyecto() : "Sin rol",
                        Collectors.counting()
                ));
    }

    public Map<String, Long> obtenerTotalPorProyecto(List<RepInvestigadoresParticipantesDTO> datos) {
        return datos.stream()
                .collect(Collectors.groupingBy(
                        item -> {
                            String codigo = item.getCodigoProyecto() != null ? item.getCodigoProyecto() : "Sin código";
                            String nombre = item.getNombreProyecto() != null ? item.getNombreProyecto() : "Sin nombre";
                            return codigo + " - " + nombre;
                        },
                        Collectors.mapping(
                                RepInvestigadoresParticipantesDTO::getIdInvestigador,
                                Collectors.collectingAndThen(Collectors.toSet(), set -> (long) set.size())
                        )
                ));
    }
}