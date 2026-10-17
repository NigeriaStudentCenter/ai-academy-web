import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';

import '../courses/course_api_service.dart';
import '../subscription/subscription_service.dart';
import 'app_auth_state.dart';
import 'entra_user.dart';

/// Sign-in for the public: Google, Apple and email + password (Firebase
/// Authentication). School and TeenSkills accounts keep using Microsoft
/// ([EntraAuthService]); the backend accepts both.
class PublicAuthService {
  static final FirebaseAuth _auth = FirebaseAuth.instance;
  static bool _googleReady = false;

  static User? get user => _auth.currentUser;
  static bool get isSignedIn => _auth.currentUser != null;

  /// Restores a saved Firebase session on app start.
  static Future<void> restoreSession() async {
    final u = _auth.currentUser;
    if (u != null) _mirror(u);
  }

  static Future<void> signInWithGoogle() async {
    if (kIsWeb) {
      await _auth.signInWithPopup(GoogleAuthProvider());
    } else {
      if (!_googleReady) {
        await GoogleSignIn.instance.initialize();
        _googleReady = true;
      }
      final account = await GoogleSignIn.instance.authenticate();
      final idToken = account.authentication.idToken;
      if (idToken == null) throw Exception('Google did not return a sign-in token.');
      await _auth.signInWithCredential(GoogleAuthProvider.credential(idToken: idToken));
    }
    _mirror(_auth.currentUser!);
  }

  /// Sign in with Apple (iPhone/iPad: Apple's own sheet with Face ID).
  static Future<void> signInWithApple() async {
    final provider = AppleAuthProvider()
      ..addScope('email')
      ..addScope('name');
    if (kIsWeb) {
      await _auth.signInWithPopup(provider);
    } else {
      await _auth.signInWithProvider(provider);
    }
    _mirror(_auth.currentUser!);
  }

  static Future<void> signInWithEmail(String email, String password) async {
    await _auth.signInWithEmailAndPassword(email: email.trim(), password: password);
    _mirror(_auth.currentUser!);
  }

  /// Creates an email + password account and sends a one-off confirmation
  /// email (needed only to link a subscription bought on our website).
  static Future<void> createWithEmail(String name, String email, String password) async {
    final cred = await _auth.createUserWithEmailAndPassword(email: email.trim(), password: password);
    if (name.trim().isNotEmpty) await cred.user!.updateDisplayName(name.trim());
    try {
      await cred.user!.sendEmailVerification();
    } catch (_) {
      // Not essential for using the app.
    }
    await cred.user!.reload();
    _mirror(_auth.currentUser!);
  }

  static Future<void> sendPasswordReset(String email) =>
      _auth.sendPasswordResetEmail(email: email.trim());

  /// A fresh ID token for the AI Academy API.
  static Future<String> getIdToken() async {
    final u = _auth.currentUser;
    if (u == null) throw Exception('Not signed in. Please sign in again.');
    final token = await u.getIdToken();
    if (token == null) throw Exception('Your session has expired. Please sign in again.');
    return token;
  }

  static Future<void> signOut() async {
    await _auth.signOut();
    if (!kIsWeb && _googleReady) {
      try {
        await GoogleSignIn.instance.signOut();
      } catch (_) {}
    }
    CourseApiService.clearCache();
    AppAuthState.logout();
  }

  /// Deletes the Firebase sign-in after the server has deleted the learner's
  /// data. Returns false if the provider wants a fresh sign-in first.
  static Future<bool> deleteSignIn() async {
    try {
      await _auth.currentUser?.delete();
      return true;
    } on FirebaseAuthException catch (e) {
      if (e.code == 'requires-recent-login') return false;
      rethrow;
    }
  }

  static void _mirror(User u) {
    AppAuthState.login(
      EntraUser(
        // Matches the server's id for Firebase learners (src/lib/auth.js).
        id: 'fb_${u.uid}',
        email: u.email ?? '',
        name: u.displayName ?? '',
        roles: const [],
      ),
      provider: SignInKind.firebase,
    );
    SubscriptionService.start();
    SubscriptionService.refresh();
  }

  /// Friendly text for Firebase sign-in errors.
  static String friendlyError(Object e) {
    if (e is FirebaseAuthException) {
      switch (e.code) {
        case 'invalid-email':
          return 'That email address doesn\'t look right.';
        case 'user-not-found':
        case 'wrong-password':
        case 'invalid-credential':
          return 'Email or password is incorrect.';
        case 'email-already-in-use':
          return 'There\'s already an account with that email. Sign in instead, or use "Forgot password".';
        case 'weak-password':
          return 'Please choose a password with at least 6 characters.';
        case 'account-exists-with-different-credential':
          return 'You already have an account with this email using a different sign-in method. Try Google, Apple or email.';
        case 'network-request-failed':
          return 'No internet connection. Please try again.';
        case 'too-many-requests':
          return 'Too many attempts. Please wait a few minutes and try again.';
      }
      return e.message ?? 'Sign-in failed. Please try again.';
    }
    if (e is GoogleSignInException && e.code == GoogleSignInExceptionCode.canceled) {
      return '';
    }
    return 'Sign-in failed. Please try again.';
  }
}
