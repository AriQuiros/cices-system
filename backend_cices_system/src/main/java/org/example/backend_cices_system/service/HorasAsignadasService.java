// service/HorasAsignadasServiceImpl.java
package org.example.backend_cices_system.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.HorasAsignadasRepository;
import org.example.backend_cices_system.data.InvestigadorProyectoRepository;
import org.example.backend_cices_system.data.ProyectoRepository;
import org.example.backend_cices_system.dto.InvestigadorHorasDTO;
import org.example.backend_cices_system.dto.ResumenHorasProyectoDTO;
import org.example.backend_cices_system.logic.HorasAsignada;
import org.example.backend_cices_system.logic.InvestigadorProyecto;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.DoubleStream;

@Service
@RequiredArgsConstructor

public class HorasAsignadasService {

    @Autowired
    private final InvestigadorProyectoRepository invProjRepo;
    private final ProyectoRepository proyectoRepo;
    private final HorasAsignadasRepository horasRepo;

    public ResumenHorasProyectoDTO obtenerHorasPorProyecto(Short proyectoId) {


        // 1) Traer relacion investigador-proyecto (para nombres)
        List<InvestigadorProyecto> ips = invProjRepo.findByIdProyecto_Id(proyectoId);

        // 2) Traer horas asignadas (para horas/mes, meses y tipo horas)
        List<HorasAsignada> horas = horasRepo.findByIdInvestigadorProyecto_IdProyecto_Id(proyectoId);

        // Agrupar horas por investigador
        Map<Short, List<HorasAsignada>> horasPorInvestigador = horas.stream()
                .collect(Collectors.groupingBy(h ->
                        h.getIdInvestigadorProyecto().getIdInvestigador().getId()
                ));

        // Sumar horas/mes y meses por investigador
        List<InvestigadorHorasDTO> investigadores = new ArrayList<>();
        for (InvestigadorProyecto ip : ips) {
            Short idInv = ip.getIdInvestigador().getId();
            String nombre = ip.getIdInvestigador().getIdEmpleado().getNombreCompleto();
            Short tipoHoras = horas.stream()
                    .map(HorasAsignada::getIdCodigoTipoHoras)
                    .findFirst()
                    .orElse(null); // o un valor por defecto, por ejemplo (short) 0

            double sumHorasMes = 0d;
            int sumMeses = 0;

            List<HorasAsignada> lista = horasPorInvestigador.getOrDefault(idInv, Collections.emptyList());
            for (HorasAsignada h : lista) {
                sumHorasMes += Optional.ofNullable(h.getCantidadHorasMes()).orElse(0d);
                sumMeses    += Optional.ofNullable(h.getCantidadMeses()).orElse((short)0);
            }

            investigadores.add(new InvestigadorHorasDTO(idInv,cargaHoraria(tipoHoras), nombre, sumHorasMes, sumMeses));
        }

        // 3) Total horas asignadas (suma de todas las filas)
        double totalHorasAsignadas = horas.stream()
                .map(HorasAsignada::getCantidadHorasMes)
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .sum();

        // 4) Total horas disponibles
        // Regla por investigador: si tiene varias filas con distintos tipos,
        // tomamos el MÁXIMO disponible entre sus tipos (19->40, 20/22->20, 21->10, otro->0)
        Map<Short, Integer> disponiblePorInvestigador = new HashMap<>();
        for (HorasAsignada h : horas) {
            Short idInv = h.getIdInvestigadorProyecto().getIdInvestigador().getId();
            int disp = mapTipoHoras(h.getIdCodigoTipoHoras());
            disponiblePorInvestigador.merge(idInv, disp, Math::max);
        }

        int totalHorasDisponibles = disponiblePorInvestigador.values().stream()
                .mapToInt(Integer::intValue)
                .sum();

        // 5) Construir DTO
        ResumenHorasProyectoDTO dto = new ResumenHorasProyectoDTO();
        dto.setProyectoNombre(proyectoRepo.findProyectoById(proyectoId).getNombreProyecto());
        dto.setProyectoId(proyectoId);
        dto.setInvestigadores(investigadores);
        dto.setTotalHorasAsignadas(totalHorasAsignadas);
        dto.setTotalHorasDisponibles(totalHorasDisponibles);
        System.out.println("DTO completo: " + dto);

        return dto;

    }

    private int mapTipoHoras(Short codigo) {
        if (codigo == null) return 0;
        return switch (codigo) {
            case 19 -> 40;         // TIEMPO COMPLETO
            case 20, 22 -> 20;     // MEDIO TIEMPO / (p. ej. tipo horas de presupuesto)
            case 21 -> 10;         // CUARTO TIEMPO
            default -> 0;
        };
    }

    private String cargaHoraria(Short codigo) {
        if (codigo == null) return "";
        return switch (codigo) {
            case 19 -> "Tiempo Completo";
            case 20 -> "Medio Tiempo";
            case 21 -> "Cuarto Tiempo";
            case  22 -> "Apoyo Estudiantil";
            default -> "";
        };
    }

}

