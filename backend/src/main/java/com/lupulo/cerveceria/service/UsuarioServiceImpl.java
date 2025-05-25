package com.lupulo.cerveceria.service;

import com.lupulo.cerveceria.model.Usuario;
import com.lupulo.cerveceria.repository.UsuarioRepository;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UsuarioServiceImpl implements UserDetailsService {

  private final UsuarioRepository usuarioRepository;

  public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    System.out.println("🔍 Buscando usuario con email: " + email);

    Usuario usuario = usuarioRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("❌ Usuario no encontrado: " + email));

    System.out.println("✅ Usuario encontrado: " + usuario.getEmail());

    return new User(
        usuario.getEmail(),
        usuario.getPassword(),
        Collections.singleton(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name())));
  }
}
