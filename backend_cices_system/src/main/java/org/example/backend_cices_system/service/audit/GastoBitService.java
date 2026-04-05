package org.example.backend_cices_system.service.audit;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.audit.GastoBitRepository;
import org.example.backend_cices_system.dto.audit.BitacoraDTO;
import org.example.backend_cices_system.dto.audit.GastoBitDTO;
import org.example.backend_cices_system.logic.Gasto;
import org.example.backend_cices_system.logic.audit.GastoBit;
import org.example.backend_cices_system.service.UsuarioService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

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
}