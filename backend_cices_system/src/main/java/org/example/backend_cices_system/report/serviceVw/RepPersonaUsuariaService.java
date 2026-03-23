package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.report.dao.RepPersonaUsuariaRepository;
import org.example.backend_cices_system.report.dto.InvestigadorConsultaDTO;
import org.example.backend_cices_system.report.dto.PersonaUsuariaDTO;
import org.example.backend_cices_system.report.dto.UsuarioPersonaDTO;
import org.example.backend_cices_system.report.view.RepPersonaUsuaria;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RepPersonaUsuariaService {

    private final RepPersonaUsuariaRepository personaRepo;

    public RepPersonaUsuariaService(RepPersonaUsuariaRepository personaRepo) {
        this.personaRepo = personaRepo;
    }

    public List<PersonaUsuariaDTO> obtenerTodos(){
        return construirLista(null);
    }

    public List<PersonaUsuariaDTO> obtenerAsistentesAdministrativos(){
        Set<String> roles = Set.of("ASISTENTE", "ADMINISTRATIVO");
        return construirLista(roles);
    }

    private List<PersonaUsuariaDTO> construirLista(Set<String> rolesPermitidos){

        List<RepPersonaUsuaria> todos = personaRepo.findAll();
        Map<String, PersonaUsuariaDTO> mapaPersonas = new HashMap<>();

        for (RepPersonaUsuaria rep : todos){

            if(rolesPermitidos != null && !rolesPermitidos.contains(rep.getNombreRol().toUpperCase())){
                continue;
            }

            String id = rep.getIdentificacion();

            mapaPersonas.computeIfAbsent(id, k ->
                    new PersonaUsuariaDTO(
                            rep.getNombreCompleto(),
                            rep.getIdentificacion(),
                            rep.getPais(),
                            rep.getCorreo(),
                            rep.getNumeroTelefono(),
                            rep.getGradoAcademico(),
                            new ArrayList<>()
                    )
            );

            mapaPersonas.get(id).roles().add(rep.getNombreRol());
        }

        return new ArrayList<>(mapaPersonas.values());
    }

    public List<UsuarioPersonaDTO> todosUsuarios(){
        List<RepPersonaUsuaria> todos = personaRepo.findAll();
        Map<String, UsuarioPersonaDTO> mapaPersonas = new HashMap<>();

        for (RepPersonaUsuaria rep : todos){
            String id = rep.getIdentificacion();
            mapaPersonas.computeIfAbsent(id, k ->
                    new UsuarioPersonaDTO(
                            rep.getIdUsuario(),
                            rep.getNombreCompleto(),
                            rep.getNombreUsuario(),
                            rep.getActivo(),
                            new ArrayList<>()
                    )
            );
            mapaPersonas.get(id).roles().add(rep.getNombreRol());
        }
        return new ArrayList<>(mapaPersonas.values());
    }

    public List<InvestigadorConsultaDTO> obtenerInvestigadores(){
        List<RepPersonaUsuaria> todos = personaRepo.findAll();

        // Map para evitar duplicados por identificación
        Map<String, InvestigadorConsultaDTO> mapaPersonas = new HashMap<>();

        for (RepPersonaUsuaria rep : todos){
            String id = rep.getIdentificacion();

            // Solo agregamos si no existe
            mapaPersonas.computeIfAbsent(id, k ->
                    new InvestigadorConsultaDTO(
                            rep.getNombreCompleto(),
                            rep.getIdentificacion(),
                            rep.getPais(),
                            rep.getCorreo(),
                            rep.getNumeroTelefono(),
                            rep.getGradoAcademico(),
                            rep.getInstitucionOrigen(),
                            rep.getUnidadAcademica(),
                            rep.getTemaInteres()
                    )
            );
        }

        return new ArrayList<>(mapaPersonas.values());
    }

    public List<RepPersonaUsuaria> obtenerPorUsuario(String nombreUsuario) {
        return personaRepo.findByNombreUsuario(nombreUsuario);
    }

    public Integer idInvestigadorPorUsuario(Integer idUsuario){
        return personaRepo.findByIdUsuario(idUsuario)
                .stream()
                .map(RepPersonaUsuaria::getIdInvestigador)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
    }

    public Integer idUsuarioPorNombre(String nombre){
        return personaRepo.findDistinctFirstByNombreUsuario(nombre).getIdUsuario();
    }
}