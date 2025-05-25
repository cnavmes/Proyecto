package com.lupulo.cerveceria.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Email
  @NotBlank(message = "El email no puede estar vacío")
  @Column(unique = true)
  private String email;

  @NotBlank(message = "La contraseña no puede estar vacía")
  private String password;

  @Enumerated(EnumType.STRING)
  private Rol rol;
}
