// Picks the sign-in implementation for the current platform:
// web → browser redirect with PKCE; iOS/Android → system browser via AppAuth.
export 'auth_platform_mobile.dart'
    if (dart.library.js_interop) 'auth_platform_web.dart';
