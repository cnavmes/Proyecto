package com.lupulo.cerveceria.service;

import com.lupulo.cerveceria.model.Usuario;
import com.lupulo.cerveceria.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

  private final UsuarioRepository usuarioRepository;
  private final PasswordEncoder passwordEncoder;

  public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
    this.usuarioRepository = usuarioRepository;
    this.passwordEncoder = passwordEncoder;
  }

  /**
   * Registra un nuevo usuario codificando su contraseña.
   */
  public Usuario registrarUsuario(Usuario usuario) {
    usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
    return usuarioRepository.save(usuario);
  }

  /**
   * Busca un usuario por su email.
   */
  public Optional<Usuario> buscarPorEmail(String email) {
    return usuarioRepository.findByEmail(email);
  }

  /**
   * Devuelve el número total de usuarios registrados.
   */
  public long countUsuarios() {
    return usuarioRepository.count();
  }

  /**
   * Devuelve la lista completa de usuarios.
   */
  public List<Usuario> findAll() {
    return usuarioRepository.findAll();
  }
}