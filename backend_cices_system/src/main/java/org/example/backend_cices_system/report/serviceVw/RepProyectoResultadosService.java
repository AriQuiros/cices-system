package org.example.backend_cices_system.report.serviceVw;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.dao.RepProyectoResultadosRepository;
import org.example.backend_cices_system.report.view.RepProyectoResultados;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RepProyectoResultadosService {

    private final RepProyectoResultadosRepository repo;

    public List<RepProyectoResultados> obtenerTodos() {
        return repo.findAll();
    }

    public RepProyectoResultados buscarPorIdProyecto(Integer idProyecto) {
        return repo.findById(idProyecto).orElse(null);
    }

}
