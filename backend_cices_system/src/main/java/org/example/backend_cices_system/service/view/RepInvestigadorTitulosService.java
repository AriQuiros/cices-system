package org.example.backend_cices_system.service.view;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.repository.view.RepInvestigadorTitulosRepository;
import org.example.backend_cices_system.model.view.RepInvestigadorTitulos;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RepInvestigadorTitulosService {

    private final RepInvestigadorTitulosRepository repo;

    public List<RepInvestigadorTitulos> buscarPorIdentificacion(String identificacion) {
        return repo.findByIdentificacion(identificacion);
    }
}

