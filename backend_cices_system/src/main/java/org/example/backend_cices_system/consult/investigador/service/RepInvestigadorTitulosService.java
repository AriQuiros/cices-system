package org.example.backend_cices_system.consult.investigador.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.consult.investigador.repository.RepInvestigadorTitulosRepository;
import org.example.backend_cices_system.consult.investigador.view.RepInvestigadorTitulos;
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

