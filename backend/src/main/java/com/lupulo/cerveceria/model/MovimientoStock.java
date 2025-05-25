package com.lupulo.cerveceria.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimientoStock {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(nullable = false)
  private Cerveza cerveza;

  private int cantidad; // Positiva o negativa

  private String tipo; // "VENTA", "REPOSICION"

  private LocalDateTime fecha;

  private String usuarioEmail;
}