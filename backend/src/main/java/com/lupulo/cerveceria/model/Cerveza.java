package com.lupulo.cerveceria.model;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import jakarta.validation.constraints.PositiveOrZero;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cerveza {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank(message = "El nombre no puede estar vacío")
  private String nombre;

  @NotBlank(message = "El estilo no puede estar vacío")
  private String estilo;

  @Positive(message = "La graduación debe ser un número positivo")
  private double graduacion;

  @NotBlank(message = "El país de origen no puede estar vacío")
  private String paisOrigen;

  @PositiveOrZero(message = "El precio no puede ser negativo")
  private double precio;

  @PositiveOrZero(message = "El stock no puede ser negativo")
  private int stock;

  @NotBlank(message = "La descripción no puede estar vacía")
  private String descripcion;

  @NotBlank(message = "La imagen no puede estar vacía")
  private String imagenUrl;

  @NotBlank(message = "El código de barras no puede estar vacío")
  @Column(unique = true)
  private String codigoBarras;
}
