package com.lupulo.cerveceria.auth;

import lombok.Getter;
import lombok.Setter;
import com.lupulo.cerveceria.model.Rol;

@Getter
@Setter
public class RegisterRequest {
  private String email;
  private String password;
  private Rol rol; // ADMIN o USER
}
