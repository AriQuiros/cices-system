package org.example.backend_cices_system.service.auditory;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.export.BitacoraPresupuestoReporteDTO;
import org.example.backend_cices_system.dto.auditory.BitacoraDTO;
import org.example.backend_cices_system.dto.auditory.PresupuestoBitDTO;
import org.example.backend_cices_system.repository.auditory.PresupuestoBitRepository;
import org.example.backend_cices_system.model.entity.Presupuesto;
import org.example.backend_cices_system.model.auditory.PresupuestoBit;
import org.example.backend_cices_system.service.entity.UsuarioService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PresupuestoBitService {

    private final PresupuestoBitRepository presupuestoBitRepository;
    private final UsuarioService usuarioService;

    public void registrarBitacora(Presupuesto presupuesto, Integer idUsuario, char accion) {

        PresupuestoBit bit = new PresupuestoBit();

        bit.setFecBit(LocalDate.now());
        bit.setUsuBit(idUsuario);
        bit.setAccBit(accion);

        bit.setIdPresupuesto(presupuesto.getId());
        bit.setIdProyecto(
                presupuesto.getIdProyecto() != null
                        ? presupuesto.getIdProyecto().getId()
                        : null
        );

        bit.setMontoAsignadoOld(presupuesto.getMontoAsignado());
        bit.setCantidadHorasMesOld(presupuesto.getCantidadHorasMes());
        bit.setCantidadMesesOld(presupuesto.getCantidadMeses());

        presupuestoBitRepository.save(bit);
    }

    public List<PresupuestoBitDTO> obtenerUpdatesBitacora(Integer idPresupuesto){
        return presupuestoBitRepository
                .findByIdPresupuestoAndAccBit(idPresupuesto, 'U').stream()
                .map(this::toDTO)
                .toList();
    }

    public Map<Integer, List<BitacoraPresupuestoReporteDTO>> obtenerPorPresupuestos(List<Integer> idsPresupuesto) {

        return presupuestoBitRepository.findByIdPresupuestoIn(idsPresupuesto)
                .stream()
                .map(this::toReporteDTO)
                .peek(dto -> {
                    if (dto.idPresupuesto() == null) {
                        System.out.println("💣 PRESUPUESTO BIT CON ID_PRESUPUESTO NULL: " + dto);
                    }
                })
                .collect(Collectors.groupingBy(BitacoraPresupuestoReporteDTO::idPresupuesto));
    }

    private PresupuestoBitDTO toDTO(PresupuestoBit bit){
        return new PresupuestoBitDTO(
                new BitacoraDTO(
                        bit.getId(),
                        bit.getFecBit(),
                        bit.getAccBit(),
                        usuarioService.obtenerUsuario(bit.getUsuBit()).getNombreUsuario()
                ),
                bit.getIdPresupuesto(),
                bit.getIdProyecto(),
                bit.getMontoAsignadoOld(),
                bit.getCantidadHorasMesOld(),
                bit.getCantidadMesesOld()
        );
    }

    public BitacoraPresupuestoReporteDTO toReporteDTO(PresupuestoBit bit) {
        return new BitacoraPresupuestoReporteDTO(
                bit.getFecBit(),
                accionLabel(bit.getAccBit()),
                usuarioService.obtenerUsuario(bit.getUsuBit()).getNombreUsuario(),
                bit.getMontoAsignadoOld() != null ? bit.getMontoAsignadoOld().toPlainString() : "—",
                bit.getCantidadHorasMesOld() != null ? bit.getCantidadHorasMesOld().toPlainString() : "—",
                bit.getCantidadMesesOld() != null ? bit.getCantidadMesesOld().toString() : "—",
                bit.getIdPresupuesto()
        );
    }

    private String accionLabel(Character acc) {
        if (acc == null) return "—";
        return switch (acc) {
            case 'I' -> "Inserción";
            case 'U' -> "Actualización";
            case 'D' -> "Eliminación";
            default  -> String.valueOf(acc);
        };
    }
}