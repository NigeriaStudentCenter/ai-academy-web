/// Microsoft Entra ID settings for the "AI Academy" app registration
/// (bsoedu.org tenant — also hosts teenskills.co.uk accounts).
class AuthConfig {
  static const String tenantId = '76691188-9b9d-47ee-bb5a-2afec52f4d5e';
  static const String clientId = '0df81530-47c8-4d89-ad12-e95a9f0b68c4';

  /// Scope for the AI Academy backend (Azure Functions validate this).
  static const String apiScope = 'api://$clientId/access_as_user';

  static const List<String> scopes = [
    'openid',
    'profile',
    'offline_access',
    apiScope,
  ];

  static const String authority =
      'https://login.microsoftonline.com/$tenantId';

  /// Registered as a public-client redirect for the iOS/Android apps.
  static const String mobileRedirectUri = 'org.bsoedu.aiacademy://oauthredirect';

  /// Web redirect path (registered as an SPA redirect for each origin).
  static const String webCallbackPath = '/oauth/callback';
}
