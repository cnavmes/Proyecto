package com.lupulo.cerveceria.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordGenerator {
  public static void main(String[] args) {
    PasswordEncoder encoder = new BCryptPasswordEncoder();
    String rawPassword = "admin123";
    String encodedPassword = encoder.encode(rawPassword);
    System.out.println("Hash generado para 'admin123':");
    System.out.println(encodedPassword);
  }
}