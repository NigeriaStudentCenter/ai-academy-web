import 'entra_user.dart';

class AppAuthState {
  static EntraUser? currentUser;

  static bool get isLoggedIn => currentUser != null;

  static bool get isAdmin => currentUser?.isAdmin ?? false;

  static void login(EntraUser user) {
    currentUser = user;
  }

  static void logout() {
    currentUser = null;
  }
}