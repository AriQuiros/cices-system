package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.report.view.*;
import org.example.backend_cices_system.report.dao.*;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PerfilService {

    private final RepPersonaUsuariaRepository personaRepo;
    private final RepInvestigadorTitulosRepository titulosRepo;
    private final RepInvestigadorCertificacionesRepository certificacionesRepo;
    private final RepInvestigadorProyectoRepository proyectosRepo;

    public PerfilService(
            RepPersonaUsuariaRepository personaRepo,
            RepInvestigadorTitulosRepository titulosRepo,
            RepInvestigadorCertificacionesRepository certificacionesRepo,
            RepInvestigadorProyectoRepository proyectosRepo
    ) {
        this.personaRepo = personaRepo;
        this.titulosRepo = titulosRepo;
        this.certificacionesRepo = certificacionesRepo;
        this.proyectosRepo = proyectosRepo;
    }

    public List<RepPersonaUsuaria> obtenerPerfilEmpleado(String identificacion) {
        return personaRepo.findByIdentificacion(identificacion);
    }

    public Map<String, Object> obtenerPerfilUsuario(String identificacion) {

        List<RepPersonaUsuaria> persona = obtenerPerfilEmpleado(identificacion);

        List<String> roles = persona.stream().map(RepPersonaUsuaria::getNombreRol).toList();

        Map<String, Object> response = new HashMap<>();
        response.put("persona", persona.getFirst());
        response.put("roles", roles);

        return response;
    }

    public Map<String, Object> obtenerPerfilInvestigador(String identificacion) {

        RepPersonaUsuaria persona = obtenerPerfilEmpleado(identificacion).getFirst();

        Map<String, Object> response = new HashMap<>();
        response.put("persona", persona);

        // Si NO es investigador
        if (persona.getIdInvestigador() == null) {
            response.put("titulos", List.of());
            response.put("certificaciones", List.of());
            response.put("proyectos", List.of());
            return response;
        }

        Integer idInvestigador = persona.getIdInvestigador();

        response.put(
                "titulos",
                titulosRepo.findByIdInvestigador(idInvestigador)
        );

        response.put(
                "certificaciones",
                certificacionesRepo.findByIdInvestigador(idInvestigador)
        );

        response.put(
                "proyectos",
                proyectosRepo.findByIdInvestigador(idInvestigador)
        );

        return response;
    }
}
