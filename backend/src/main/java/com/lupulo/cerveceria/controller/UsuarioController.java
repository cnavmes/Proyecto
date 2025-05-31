package com.lupulo.cerveceria.controller;

import com.lupulo.cerveceria.model.Usuario;
import com.lupulo.cerveceria.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

  private final UsuarioService usuarioService;

  public UsuarioController(UsuarioService usuarioService) {
    this.usuarioService = usuarioService;
  }

  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public List<Usuario> listarUsuarios() {
    return usuarioService.findAll();
  }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Usuario> crearUsuario(@Valid @RequestBody Usuario usuario) {
    Usuario nuevo = usuarioService.registrarUsuario(usuario);
    return ResponseEntity.ok(nuevo);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @Valid @RequestBody Usuario datos) {
    Usuario existente = usuarioService.buscarPorEmail(datos.getEmail())
        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    existente.setRol(datos.getRol());
    Usuario actualizado = usuarioService.registrarUsuario(existente); // vuelve a codificar password si se cambia
    return ResponseEntity.ok(actualizado);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
    usuarioService.eliminarUsuario(id);
    return ResponseEntity.noContent().build();
  }
}