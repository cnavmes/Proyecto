package com.lupulo.cerveceria.controller;

import com.lupulo.cerveceria.auth.*;
import com.lupulo.cerveceria.model.Usuario;
import com.lupulo.cerveceria.security.JwtService;
import com.lupulo.cerveceria.service.UsuarioService;

import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

  private final UsuarioService usuarioService;
  private final JwtService jwtService;
  private final AuthenticationManager authManager;
  private final PasswordEncoder passwordEncoder;

  public AuthController(UsuarioService usuarioService,
      JwtService jwtService,
      AuthenticationManager authManager,
      PasswordEncoder passwordEncoder) {
    this.usuarioService = usuarioService;
    this.jwtService = jwtService;
    this.authManager = authManager;
    this.passwordEncoder = passwordEncoder;
  }

  @PostMapping("/register")
  public AuthResponse register(@RequestBody RegisterRequest request) {
    Usuario usuario = Usuario.builder()
        .email(request.getEmail())
        .password(request.getPassword()) // Le paso la contraseña en texto plano
        .rol(request.getRol())
        .build();

    usuarioService.registrarUsuario(usuario); // Aquí se cifra internamente

    String jwt = jwtService.generateToken(
        Map.of("rol", usuario.getRol().name()),
        usuario.getEmail());

    return new AuthResponse(jwt);
  }

  @PostMapping("/login")
  public AuthResponse login(@RequestBody AuthRequest request) {
    try {
      authManager.authenticate(
          new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
    } catch (Exception e) {
      System.out.println(" Error autenticando: " + e.getClass().getSimpleName() + " - " + e.getMessage());
      throw e;
    }

    Usuario usuario = usuarioService.buscarPorEmail(request.getEmail()).orElseThrow();

    String jwt = jwtService.generateToken(
        Map.of("rol", usuario.getRol().name()),
        usuario.getEmail());

    return new AuthResponse(jwt);
  }

}