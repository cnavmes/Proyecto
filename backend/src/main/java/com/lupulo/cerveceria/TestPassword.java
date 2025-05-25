package com.lupulo.cerveceria;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestPassword {
  public static void main(String[] args) {
    String rawPassword = "abc";
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    String hashedPassword = encoder.encode(rawPassword);

    System.out.println("Contraseña original: " + rawPassword);
    System.out.println("Hash generado: " + hashedPassword);
  }
}