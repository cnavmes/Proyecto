package com.lupulo.cerveceria.dto;

import lombok.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovimientoStockRespuestaDTO {
  private List<MovimientoStockDTO> movimientos;
  private int pagina;
  private int totalPaginas;
  private long totalElementos;
}
