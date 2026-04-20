package org.example.backend_cices_system.report.serviceVw;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.dao.RepInvestigadorTitulosRepository;
import org.example.backend_cices_system.report.view.RepInvestigadorTitulos;
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

