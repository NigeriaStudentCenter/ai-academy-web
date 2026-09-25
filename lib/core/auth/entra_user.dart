class EntraUser {
  final String id;
  final String email;
  final String name;
  final List<String> roles;

  EntraUser({
    required this.id,
    required this.email,
    this.name = '',
    required this.roles,
  });

  bool get isAdmin => roles.contains('Admin');

  /// Name to greet the learner with.
  String get displayName => name.isNotEmpty ? name : email.split('@').first;
}
