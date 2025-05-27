package com.lupulo.cerveceria.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MovimientoStockDTO {
  private String nombreCerveza;
  private int cantidad;
  private String tipo;
  private LocalDateTime fecha;
  private String usuarioEmail;
}
