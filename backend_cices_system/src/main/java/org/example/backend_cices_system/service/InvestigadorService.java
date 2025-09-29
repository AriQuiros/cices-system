package org.example.backend_cices_system.service;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.logic.Certificacion;
import org.example.backend_cices_system.logic.Empleado;
import org.example.backend_cices_system.logic.Investigador;
import org.springframework.stereotype.Service;
import org.example.backend_cices_system.dto.RegistroInvestigadorDTO;
import org.example.backend_cices_system.dto.CertificacionDTO;

@Service
@RequiredArgsConstructor
public class InvestigadorService {
    private final EntityManager em;

    @Transactional
    public Short registrarInvestigadorConCerts(RegistroInvestigadorDTO dto) {
        // 1) INVESTIGADOR
        Investigador inv = new Investigador();
        inv.setIdEmpleado(em.getReference(Empleado.class, dto.idEmpleado())); // FK a EMPLEADO
        inv.setInstitucionOrigen(dto.institucionOrigen());
        inv.setUnidadAcademica(dto.unidadAcademica());
        inv.setIdCodigoGradoAcademico(dto.idCodigoGradoAcademico());
        em.persist(inv);
        em.flush(); // garantiza ID generado
        Short invId = inv.getId();

        // 2) CERTIFICACIONES con el mismo id_investigador
        if (dto.acreditaciones() != null) {
            for (CertificacionDTO c : dto.acreditaciones()) {
                Certificacion cert = new Certificacion();
                cert.setIdInvestigador(inv); // FK correcta
                cert.setNombreCertificacion(c.nombreCertificacion());
                cert.setIdCodigoTipoCertificacion(c.idCodigoTipoCertificacion());
                cert.setFechaExpiracion(c.fechaExpiracion());
                cert.setIdCodigoTipoEstado(c.idCodigoTipoEstado());
                em.persist(cert);
            }
        }
        return invId;
    }
}
