import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTheme {
  static ThemeData light() {
    return ThemeData(
      primaryColor: AppColors.darkGreen,
      scaffoldBackgroundColor: AppColors.darkGreen,
      useMaterial3: true,
      fontFamily: "Arial",
    );
  }
}