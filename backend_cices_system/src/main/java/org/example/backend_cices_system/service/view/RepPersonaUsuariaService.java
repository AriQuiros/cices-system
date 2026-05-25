package org.example.backend_cices_system.service.view;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.repository.view.RepPersonaUsuariaRepository;
import org.example.backend_cices_system.repository.specification.PersonaSpecification;
import org.example.backend_cices_system.dto.filter.PersonaFiltroDTO;
import org.example.backend_cices_system.dto.view.InvestigadorConsultaDTO;
import org.example.backend_cices_system.dto.view.PersonaUsuariaDTO;
import org.example.backend_cices_system.dto.view.UsuarioPersonaDTO;
import org.example.backend_cices_system.model.view.RepPersonaUsuaria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RepPersonaUsuariaService {

    private final RepPersonaUsuariaRepository personaRepo;

    public RepPersonaUsuaria obtenerPorIdUsuario(Integer idUsuario){
        return personaRepo.findFirstByIdUsuario(idUsuario).orElseThrow(() ->
                new RuntimeException("No existe persona con el id " + idUsuario));
    }

    public RepPersonaUsuaria obtenerPorIdentificacion(String identificacion){
        return personaRepo.findFirstByIdentificacion(identificacion).orElseThrow(() ->
                new RuntimeException("No existe persona con la identificacion " + identificacion));
    }

    public Page<UsuarioPersonaDTO> todosUsuarios(PersonaFiltroDTO filtro, Pageable pageable) {

        Page<RepPersonaUsuaria> page = filtrar(filtro, pageable);

        List<Integer> ids = page.getContent()
                .stream()
                .map(RepPersonaUsuaria::getIdUsuario)
                .toList();

        Map<Integer, List<String>> rolesMap = obtenerRolesMap(ids);

        return page.map(rep -> new UsuarioPersonaDTO(
                rep.getIdUsuario(),
                rep.getNombreCompleto(),
                rep.getNombreUsuario(),
                rep.getActivo(),
                rolesMap.getOrDefault(rep.getIdUsuario(), List.of())
        ));
    }

    public Page<PersonaUsuariaDTO> obtenerPersonaPorRoles(
            PersonaFiltroDTO filtro,
            Pageable pageable
    ) {

        Page<RepPersonaUsuaria> page = filtrar(filtro, pageable);
        List<Integer> ids = page.getContent()
                .stream()
                .map(RepPersonaUsuaria::getIdUsuario)
                .toList();
        Map<Integer, List<String>> rolesMap = obtenerRolesMap(ids);

        return page.map( rep -> construirPersonaDTO(rep, rolesMap));
    }

    public Page<InvestigadorConsultaDTO> obtenerInvestigadoresPorRoles(
            PersonaFiltroDTO filtro,
            Pageable pageable
    ) {

        Page<RepPersonaUsuaria> page = filtrar(filtro, pageable);
        List<Integer> ids = page.getContent()
                .stream()
                .map(RepPersonaUsuaria::getIdUsuario)
                .toList();
        Map<Integer, List<String>> rolesMap = obtenerRolesMap(ids);

        return page.map( rep -> construirInvestigadorConsultaDTO(rep, rolesMap));
    }

    public Page<RepPersonaUsuaria> filtrar(PersonaFiltroDTO filtro, Pageable pageable){
        Specification<RepPersonaUsuaria> spec =
                PersonaSpecification.filtrar(filtro);

        return personaRepo.findAll(spec, pageable);
    }

    public PersonaUsuariaDTO construirPersonaDTO(RepPersonaUsuaria rep, Map<Integer, List<String>> rolesMap){
        return new PersonaUsuariaDTO(
                rep.getNombreCompleto(),
                rep.getIdentificacion(),
                rep.getPais(),
                rep.getCorreo(),
                rep.getNumeroTelefono(),
                rep.getGradoAcademico(),
                rolesMap.getOrDefault(rep.getIdUsuario(), List.of())
        );
    }

    public InvestigadorConsultaDTO construirInvestigadorConsultaDTO(RepPersonaUsuaria rep, Map<Integer, List<String>> rolesMap){
        return new InvestigadorConsultaDTO(
                construirPersonaDTO(rep, rolesMap),
                rep.getInstitucionOrigen(),
                rep.getUnidadAcademica(),
                rep.getTemaInteres());
    }

    private Map<Integer, List<String>> obtenerRolesMap(List<Integer> ids) {

        List<Object[]> rolesData = personaRepo.findRolesByUsuarios(ids);

        Map<Integer, List<String>> rolesMap = new HashMap<>();

        for (Object[] row : rolesData) {
            Integer idUsuario = (Integer) row[0];
            String rol = (String) row[1];

            rolesMap.computeIfAbsent(idUsuario, k -> new ArrayList<>())
                    .add(rol);
        }

        return rolesMap;
    }
}