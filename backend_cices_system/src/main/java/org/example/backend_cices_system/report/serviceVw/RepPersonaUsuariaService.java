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

    public Page<PersonaUsuariaDTO> obtenerTodos(Pageable pageable){
        Page<RepPersonaUsuaria> page = filtrar(new PersonaFiltroDTO(null, null, null), pageable);
        return construirPersonaDTO(page);
    }

    public Page<UsuarioPersonaDTO> todosUsuarios(PersonaFiltroDTO filtro, Pageable pageable){

        Page<RepPersonaUsuaria> page = filtrar(filtro, pageable);

        Map<String, UsuarioPersonaDTO> mapa = new LinkedHashMap<>();

        for (RepPersonaUsuaria rep : page.getContent()) {

            String id = rep.getIdentificacion();

            mapa.computeIfAbsent(id, k ->
                    new UsuarioPersonaDTO(
                            rep.getIdUsuario(),
                            rep.getNombreCompleto(),
                            rep.getNombreUsuario(),
                            rep.getActivo(),
                            new ArrayList<>()
                    )
            );

            if(rep.getNombreRol() != null){
                mapa.get(id).roles().add(rep.getNombreRol());
            }
        }

        return new PageImpl<>(
                new ArrayList<>(mapa.values()),
                pageable,
                page.getTotalElements()
        );
    }

    public Page<PersonaUsuariaDTO> obtenerPersonaPorRoles(
            PersonaFiltroDTO filtro,
            Pageable pageable,
            List<String> rolesBase
    ){

        List<String> rolesFinal;

        if (filtro.roles() == null || filtro.roles().isEmpty()) {
            rolesFinal = rolesBase;
        } else {
            // intersección
            rolesFinal = filtro.roles().stream()
                    .filter(rolesBase::contains)
                    .toList();
        }

        PersonaFiltroDTO nuevoFiltro = new PersonaFiltroDTO(
                filtro.nombre(),
                rolesFinal,
                filtro.gradosAcademicos()
        );

        Page<RepPersonaUsuaria> page = filtrar(nuevoFiltro, pageable);

        return construirPersonaDTO(page);
    }

    public Page<RepPersonaUsuaria> filtrar(PersonaFiltroDTO filtro, Pageable pageable){
        Specification<RepPersonaUsuaria> spec =
                PersonaSpecification.filtrar(filtro);

        return personaRepo.findAll(spec, pageable);
    }

    public Page<PersonaUsuariaDTO> construirPersonaDTO(Page<RepPersonaUsuaria> page){

        Map<String, PersonaUsuariaDTO> mapa = new LinkedHashMap<>();

        for (RepPersonaUsuaria rep : page.getContent()) {

            String id = rep.getIdentificacion();

            mapa.computeIfAbsent(id, k ->
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

            if(rep.getNombreRol() != null){
                mapa.get(id).roles().add(rep.getNombreRol());
            }
        }

        return new PageImpl<>(
                new ArrayList<>(mapa.values()),
                page.getPageable(),
                page.getTotalElements()
        );
    }
}