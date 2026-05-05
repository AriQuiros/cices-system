package org.example.backend_cices_system.modules.gasto.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.export.dto.BitacoraGastoReporteDTO;
import org.example.backend_cices_system.modules.gasto.repository.GastoBitRepository;
import org.example.backend_cices_system.modules.gasto.dto.BitacoraDTO;
import org.example.backend_cices_system.modules.gasto.dto.GastoBitDTO;
import org.example.backend_cices_system.modules.gasto.model.Gasto;
import org.example.backend_cices_system.modules.gasto.model.GastoBit;
import org.example.backend_cices_system.modules.usuario.service.UsuarioService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GastoBitService {

    private final GastoBitRepository gastoBitRepository;
    private final UsuarioService usuarioService;

    public void registrarBitacora(Gasto gasto, Integer idUsuario, char accion) {

        GastoBit bit = new GastoBit();

        bit.setFecBit(LocalDate.now());
        bit.setUsuBit(idUsuario);

        // TRUE = Update, FALSE = Delete (siguiendo tu lógica actual boolean)
        bit.setAccBit(accion);

        bit.setIdGasto(gasto.getId());
        bit.setIdPresupuesto(
                gasto.getIdPresupuesto() != null ? gasto.getIdPresupuesto().getId() : null
        );

        // Valores anteriores
        bit.setMontoOld(gasto.getMonto());
        bit.setFechaGastoOld(gasto.getFechaGasto());
        bit.setDescripcionOld(gasto.getDescripcion());

        gastoBitRepository.save(bit);
    }

    public List<GastoBitDTO> obtenerUpdatesBitacoraGasto(Integer idGasto){
        return gastoBitRepository.findByIdGastoAndAccBit(idGasto, 'U').stream()
                .map(this::obtenerDTO).toList();

    }

    public Map<Integer, List<BitacoraGastoReporteDTO>> obtenerPorPresupuestos(List<Integer> idsPresupuesto) {

        return gastoBitRepository.findByIdPresupuestoIn(idsPresupuesto)
                .stream()
                .map(this::toReporteDTO)
                .peek(dto -> {
                    if (dto.idPresupuesto() == null) {
                        System.out.println("💣 GASTO BIT CON ID_PRESUPUESTO NULL: " + dto);
                    }
                })
                .collect(Collectors.groupingBy(BitacoraGastoReporteDTO::idPresupuesto));
    }

    private GastoBitDTO obtenerDTO (GastoBit gastoBit){
        return new GastoBitDTO(
                new BitacoraDTO(
                        gastoBit.getId(),
                        gastoBit.getFecBit(),
                        gastoBit.getAccBit(),
                        usuarioService.obtenerUsuario(gastoBit.getUsuBit()).getNombreUsuario()
                ),
                gastoBit.getIdGasto(),
                gastoBit.getMontoOld(),
                gastoBit.getFechaGastoOld(),
                gastoBit.getDescripcionOld()
        );
    }

    private BitacoraGastoReporteDTO toReporteDTO(GastoBit bit) {
        return new BitacoraGastoReporteDTO(
                bit.getFecBit() != null ? bit.getFecBit().toString() : "—",
                accionLabel(bit.getAccBit()),
                usuarioService.obtenerUsuario(bit.getUsuBit()).getNombreUsuario(),
                bit.getMontoOld() != null ? bit.getMontoOld().toPlainString() : "—",
                bit.getFechaGastoOld() != null ? bit.getFechaGastoOld().toString() : "—",
                bit.getDescripcionOld() != null ? bit.getDescripcionOld() : "—",
                bit.getIdPresupuesto(),
                bit.getIdGasto()
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