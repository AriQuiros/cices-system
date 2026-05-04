package org.example.backend_cices_system.modules.presupuesto.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.gasto.dto.BitacoraDTO;
import org.example.backend_cices_system.modules.presupuesto.dto.PresupuestoBitDTO;
import org.example.backend_cices_system.modules.presupuesto.repository.PresupuestoBitRepository;
import org.example.backend_cices_system.modules.presupuesto.model.Presupuesto;
import org.example.backend_cices_system.modules.presupuesto.model.PresupuestoBit;
import org.example.backend_cices_system.modules.usuario.service.UsuarioService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

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
}