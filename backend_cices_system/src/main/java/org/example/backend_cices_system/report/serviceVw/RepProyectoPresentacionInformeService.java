package org.example.backend_cices_system.report.serviceVw;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.dao.RepProyectoPresentacionInformeRepository;
import org.example.backend_cices_system.report.view.RepProyectoPresentacionInforme;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RepProyectoPresentacionInformeService {

    private final RepProyectoPresentacionInformeRepository repo;

    public List<RepProyectoPresentacionInforme> obtenerTodos() {
        return repo.findAll();
    }

    public List<RepProyectoPresentacionInforme> buscarPorIdProyecto(Integer idProyecto) {
        return repo.findByIdProyecto(idProyecto);
    }
}
