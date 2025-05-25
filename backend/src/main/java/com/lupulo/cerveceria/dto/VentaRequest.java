package com.lupulo.cerveceria.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VentaRequest {
  private Long cervezaId;
  private int cantidad;
}