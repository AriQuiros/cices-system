package org.example.backend_cices_system.service.audit;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.audit.PresupuestoBitRepository;
import org.example.backend_cices_system.logic.Presupuesto;
import org.example.backend_cices_system.logic.audit.PresupuestoBit;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class PresupuestoBitService {

    private final PresupuestoBitRepository presupuestoBitRepository;

    /**
     * Guarda bitácora de presupuesto
     * @param oldPresupuesto puede ser null (en INSERT)
     * @param usuario usuario del sistema
     * @param accion 'I', 'U', 'D'
     */
    public void registrarBitacora(Presupuesto oldPresupuesto,
                                  Integer usuario,
                                  char accion) {

        PresupuestoBit bit = new PresupuestoBit();

        bit.setFecBit(LocalDate.now());
        bit.setAccBit(accion);
        bit.setUsuBit(usuario);

        if (oldPresupuesto != null) {
            bit.setIdPresupuesto(oldPresupuesto.getId());
            bit.setIdProyecto(oldPresupuesto.getIdProyecto().getId());
        }

        // ========================
        // OLD VALUES
        // ========================
        if (oldPresupuesto != null) {
            bit.setMontoAsignadoOld(oldPresupuesto.getMontoAsignado());
            bit.setCantidadHorasMesOld(oldPresupuesto.getCantidadHorasMes());
            bit.setCantidadMesesOld(oldPresupuesto.getCantidadMeses());
        }

        presupuestoBitRepository.save(bit);
    }
}