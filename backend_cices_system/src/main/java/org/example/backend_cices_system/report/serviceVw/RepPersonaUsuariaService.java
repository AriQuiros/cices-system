package org.example.backend_cices_system.report.serviceVw;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.dao.RepPersonaUsuariaRepository;
import org.example.backend_cices_system.report.dto.PersonaUsuariaDTO;
import org.example.backend_cices_system.report.dto.UsuarioPersonaDTO;
import org.example.backend_cices_system.report.filter.PersonaFiltroDTO;
import org.example.backend_cices_system.report.specification.PersonaSpecification;
import org.example.backend_cices_system.report.view.RepPersonaUsuaria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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

        return page.map(rep -> new PersonaUsuariaDTO(
                rep.getNombreCompleto(),
                rep.getIdentificacion(),
                rep.getPais(),
                rep.getCorreo(),
                rep.getNumeroTelefono(),
                rep.getGradoAcademico(),
                rolesMap.getOrDefault(rep.getIdUsuario(), List.of())
        ));
    }

    public Page<RepPersonaUsuaria> filtrar(PersonaFiltroDTO filtro, Pageable pageable){
        Specification<RepPersonaUsuaria> spec =
                PersonaSpecification.filtrar(filtro);

        return personaRepo.findAll(spec, pageable);
    }

    public Page<PersonaUsuariaDTO> construirPersonaDTO(Page<RepPersonaUsuaria> page) {

        return page.map(rep -> new PersonaUsuariaDTO(
                rep.getNombreCompleto(),
                rep.getIdentificacion(),
                rep.getPais(),
                rep.getCorreo(),
                rep.getNumeroTelefono(),
                rep.getGradoAcademico(),
                List.of()
        ));
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