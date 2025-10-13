package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.Meta;
import org.example.backend_cices_system.logic.ObjetivoEspecifico;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MetaRepository extends JpaRepository<Meta, Short> {
    List<Meta> findMetaByIdObjetivo(ObjetivoEspecifico objetivo);
}
