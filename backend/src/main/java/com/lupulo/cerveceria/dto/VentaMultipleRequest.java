package com.lupulo.cerveceria.dto;

import lombok.Data;
import java.util.List;

@Data
public class VentaMultipleRequest {
  private List<VentaRequest> ventas;
}