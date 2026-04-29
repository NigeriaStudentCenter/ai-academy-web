class EntraUser {
  final String id;
  final String email;
  final List<String> roles;

  EntraUser({
    required this.id,
    required this.email,
    required this.roles,
  });

  bool get isAdmin => roles.contains('Admin');
}
