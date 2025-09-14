package org.example.backend_cices_system.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.example.backend_cices_system.data.*;

@org.springframework.stereotype.Service
public class Service {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private RolUsuarioRepository rolUsuarioRepository;



}