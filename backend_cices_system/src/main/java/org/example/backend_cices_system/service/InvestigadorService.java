package org.example.backend_cices_system.service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.InvestigadorProyectoRepository;
import org.example.backend_cices_system.data.InvestigadorRepository;
import org.example.backend_cices_system.data.ProyectoRepository;
import org.example.backend_cices_system.data.UsuarioRepository;
import org.example.backend_cices_system.dto.*;
import org.example.backend_cices_system.logic.Certificacion;
import org.example.backend_cices_system.logic.Empleado;
import org.example.backend_cices_system.logic.Investigador;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.math.BigDecimal;
import java.sql.Date;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InvestigadorService {
    private final EntityManager em;
    private final UsuarioRepository usuarioRepo;
    private final InvestigadorRepository invRepo;
    private final InvestigadorProyectoRepository invProyRepo;
    private final ProyectoRepository proyectoRepo;


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

    @SuppressWarnings("unchecked")
    public List<ProyectoDTO> getProyectosInvestigadorPrincipal(String nombreUsuario) {
        try {
            String query = """
                    SELECT p.ID_PROYECTO, p.NOMBRE_PROYECTO
                    FROM PROYECTO p
                    INNER JOIN INVESTIGADOR_PROYECTO ip ON p.ID_PROYECTO = ip.ID_PROYECTO
                    INNER JOIN ROL_PROYECTO rp ON ip.ID_ROL_PROYECTO = rp.ID_ROL_PROYECTO
                    INNER JOIN INVESTIGADOR i ON ip.ID_INVESTIGADOR = i.ID_INVESTIGADOR
                    INNER JOIN EMPLEADO e ON i.ID_EMPLEADO = e.ID_EMPLEADO
                    INNER JOIN USUARIO u ON e.ID_EMPLEADO = u.ID_EMPLEADO
                    WHERE UPPER(u.NOMBRE_USUARIO) = UPPER(?1)
                    AND UPPER(rp.NOMBRE_PERMISO) = 'INVESTIGADOR_PRINCIPAL'
                    """;

            List<Object[]> results = em.createNativeQuery(query)
                    .setParameter(1, nombreUsuario)
                    .getResultList();

            return results.stream()
                    .map(row -> {
                        ProyectoDTO proyecto = new ProyectoDTO();
                        proyecto.setIdProyecto(((Number) row[0]).shortValue());
                        proyecto.setNombre((String) row[1]);
                        return proyecto;
                    })
                    .toList();
        } catch (Exception e) {
            System.err.println("Error al obtener proyectos del investigador principal: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al cargar proyectos como investigador principal", e);
        }
    }

    @SuppressWarnings("unchecked")
    public PresupuestoDTO getPresupuestoProyecto(Integer idProyecto) {
        String query = """
                SELECT
                    p.ID_PRESUPUESTO,
                    p.ID_PROYECTO,
                    p.MONTO,
                    p.DESCRIPCION,
                    COALESCE(SUM(g.MONTO), 0) as GASTOS_REALIZADOS
                FROM PRESUPUESTO p
                LEFT JOIN GASTO g ON p.ID_PRESUPUESTO = g.ID_PRESUPUESTO
                WHERE p.ID_PROYECTO = ?1
                GROUP BY p.ID_PRESUPUESTO, p.ID_PROYECTO, p.MONTO, p.DESCRIPCION
                """;

        List<Object[]> results = em.createNativeQuery(query)
                .setParameter(1, idProyecto)
                .getResultList();

        if (results.isEmpty()) {
            return null; // No hay presupuesto para este proyecto
        }

        Object[] row = results.get(0);
        PresupuestoDTO presupuesto = new PresupuestoDTO();
        presupuesto.setIdPresupuesto(((Number) row[0]).shortValue());
        presupuesto.setIdProyecto(((Number) row[1]).shortValue());

        BigDecimal montoTotal = (BigDecimal) row[2];
        BigDecimal gastosRealizados = (BigDecimal) row[4];
        BigDecimal montoDisponible = montoTotal.subtract(gastosRealizados);

        presupuesto.setMonto(montoTotal);
        presupuesto.setDescripcion((String) row[3]);
        presupuesto.setGastosRealizados(gastosRealizados);
        presupuesto.setMontoDisponible(montoDisponible);

        return presupuesto;
    }

    public boolean validarMontoGasto(Integer idProyecto, BigDecimal montoNuevoGasto) {
        PresupuestoDTO presupuesto = getPresupuestoProyecto(idProyecto);
        if (presupuesto == null) {
            return false; // No hay presupuesto
        }

        // Verificar que el nuevo gasto no exceda el monto disponible
        return presupuesto.getMontoDisponible().compareTo(montoNuevoGasto) >= 0;
    }

    @Transactional
    public boolean registrarGasto(GastoDTO gastoDTO) {
        try {
            // Obtener el presupuesto (una sola vez)
            PresupuestoDTO presupuesto = getPresupuestoProyecto(gastoDTO.getIdProyecto());
            if (presupuesto == null) {
                return false; // No hay presupuesto para este proyecto
            }

            // Validar que el monto no exceda el presupuesto disponible
            if (presupuesto.getMontoDisponible().compareTo(gastoDTO.getMonto()) < 0) {
                return false; // Monto excede el presupuesto disponible
            }

            // Insertar el gasto
            String insertQuery = """
                    INSERT INTO GASTO (ID_GASTO, ID_PRESUPUESTO, MONTO, FECHA_GASTO, CATEGORIA_GASTO, DESCRIPCION)
                    VALUES (SEC_GASTO.NEXTVAL, ?, ?, ?, ?, ?)
                    """;

            int result = em.createNativeQuery(insertQuery)
                    .setParameter(1, presupuesto.getIdPresupuesto())
                    .setParameter(2, gastoDTO.getMonto())
                    .setParameter(3, Date.valueOf(gastoDTO.getFechaGasto()))
                    .setParameter(4, gastoDTO.getCategoriaGasto())
                    .setParameter(5, gastoDTO.getDescripcion())
                    .executeUpdate();

            return result > 0;

        } catch (Exception e) {
            System.err.println("Error al registrar gasto: " + e.getMessage());
            return false;
        }
    }

    public List<ProyectoDTO> misProyectos(String username) {
        try {
            var u = usuarioRepo.findActiveByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no activo"));

            var inv = invRepo.findByIdEmpleado(u.getIdEmpleado())
                    .orElseThrow(() -> new RuntimeException("No es investigador"));

            var ids = invProyRepo.findProyectoIdsVigentesByInvestigador(inv);
            if (ids.isEmpty()) return List.of();

            return proyectoRepo.findAllById(ids).stream()
                    .map(this::toDTO)
                    .toList();

        } catch (RuntimeException e) {
            // 👇 deja pasar errores esperados
            if ("Usuario no activo".equals(e.getMessage()) || "No es investigador".equals(e.getMessage())) {
                throw e;
            }
            // 👇 solo envuelve los demás
            System.err.println("Error al obtener mis proyectos para el usuario: " + username + " - " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al cargar mis proyectos", e);
        }
    }


    public ProyectoDTO toDTO(Proyecto p) {
        var dto = new ProyectoDTO();
        dto.setIdProyecto(p.getId());
        dto.setCodigo(p.getCodigoProyecto());
        dto.setNombre(p.getNombreProyecto());
        dto.setFechaInicio(p.getFechaInicio());
        dto.setFechaFinalizacion(p.getFechaFinalizacion());
        dto.setLineaInvestigacion(p.getLineaInvestigacion());
        return dto;
    }

    public List<InvestigadorDTO> buscarInvestigadores(String q) {
        return invRepo.buscarInvestigadores((q == null || q.isBlank()) ? null : q);
    }


}
