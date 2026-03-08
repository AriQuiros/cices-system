package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.report.dao.RepProyectoPresentacionInformeRepository;
import org.example.backend_cices_system.report.view.RepProyectoPresentacionInforme;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepProyectoPresentacionInformeService {

    private final RepProyectoPresentacionInformeRepository repo;

    public RepProyectoPresentacionInformeService(RepProyectoPresentacionInformeRepository repo) {
        this.repo = repo;
    }

    public List<RepProyectoPresentacionInforme> obtenerTodos() {
        return repo.findAll();
    }

    public RepProyectoPresentacionInforme buscarPorId(Integer idPresentacionInforme) {
        return repo.findById(idPresentacionInforme).orElse(null);
    }

    public List<RepProyectoPresentacionInforme> buscarPorIdProyecto(Integer idProyecto) {
        return repo.findByIdProyecto(idProyecto);
    }

    public List<RepProyectoPresentacionInforme> buscarPorCodigoProyecto(String codigoProyecto) {
        return repo.findByCodigoProyecto(codigoProyecto);
    }

    public List<RepProyectoPresentacionInforme> buscarPorNombreProyecto(String nombreProyecto) {
        return repo.findByNombreProyectoContainingIgnoreCase(nombreProyecto);
    }
}
