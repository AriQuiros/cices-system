package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.*;
import org.example.backend_cices_system.dto.DirectorResumenDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

@Service
@Transactional(readOnly = true)
public class DirectorService {

    private final CertificacionRepository certRepo;
    private final RolUsuarioRepository rolUsuarioRepo;
    private final InvestigadorRepository invRepo;
    private final ProyectoRepository proyRepo;
    private final InvestigadorProyectoRepository invProyRepo;

    public DirectorService(
            CertificacionRepository certRepo,
            RolUsuarioRepository rolUsuarioRepo,
            InvestigadorRepository invRepo,
            ProyectoRepository proyRepo,
            InvestigadorProyectoRepository invProyRepo) {
        this.certRepo = certRepo;
        this.rolUsuarioRepo = rolUsuarioRepo;
        this.invRepo = invRepo;
        this.proyRepo = proyRepo;
        this.invProyRepo = invProyRepo;
    }

    public DirectorResumenDTO get(int diasVentana) {
        int d = diasVentana > 0 ? diasVentana : 30;
        LocalDate hoy = LocalDate.now();
        return new DirectorResumenDTO(
                certRepo.countByFechaExpiracionBetween(hoy, hoy.plusDays(d)),
                rolUsuarioRepo.countInvestigadoresActivos(),
                invRepo.count(),
                rolUsuarioRepo.countPersonalAdministrativo(),
                proyRepo.count(),
                invProyRepo.countInvestigadoresAsignados()
        );
    }
}
