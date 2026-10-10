import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/api/api_client.dart';
import '../../core/auth/app_auth_state.dart';
import '../../core/auth/entra_auth_service.dart';
import '../../core/subscription/subscription_service.dart';
import '../../core/theme/app_colors.dart';
import '../../widgets/app_nav_drawer.dart';

/// The learner's account: subscription status, restore / manage, and
/// deleting the account (required by Apple for apps with account creation).
class AccountPage extends StatefulWidget {
  const AccountPage({super.key});

  @override
  State<AccountPage> createState() => _AccountPageState();
}

class _AccountPageState extends State<AccountPage> {
  late Future<LearnerAccess> _access = SubscriptionService.refresh();
  bool _deleting = false;

  String _describe(LearnerAccess a) => switch (a.reason) {
        'subscription' => a.expiresAt != null
            ? 'All Access — renews or ends on ${a.expiresAt!.toLocal().toString().split(' ').first}'
            : 'All Access subscription',
        'organisation' => 'All Access through your school or organisation',
        'admin' => 'All Access (administrator)',
        'paywall-off' => 'Full access',
        _ => 'No subscription',
      };

  Future<void> _delete() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete your account?'),
        content: Text(
            'This permanently deletes your AI Academy account, progress, saved work and certificates. '
            'It cannot be undone.\n\nIf you have a ${SubscriptionService.storeName} subscription, deleting '
            'your account does not cancel it — cancel it in your ${SubscriptionService.storeName} account settings.'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Cancel')),
          TextButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('Delete account',
                  style: TextStyle(color: Colors.red))),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;
    setState(() => _deleting = true);
    final messenger = ScaffoldMessenger.of(context);
    try {
      final response = await ApiClient.post('deleteAccount', '{}');
      final json = jsonDecode(response.body) as Map<String, dynamic>;
      if (response.statusCode == 200) {
        await EntraAuthService.signOut();
        if (!mounted) return;
        messenger.showSnackBar(SnackBar(
          content: Text(json['hadSubscription'] == true
              ? 'Your account has been deleted. Remember to cancel your subscription in ${SubscriptionService.storeName}.'
              : 'Your account has been deleted.'),
        ));
        context.go('/');
      } else {
        messenger.showSnackBar(SnackBar(
            content: Text(json['error'] as String? ??
                'Could not delete your account (HTTP ${response.statusCode}).')));
      }
    } catch (e) {
      messenger.showSnackBar(
          SnackBar(content: Text('Could not delete your account: $e')));
    } finally {
      if (mounted) setState(() => _deleting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = AppAuthState.currentUser;
    return Scaffold(
      backgroundColor: AppColors.darkGreen,
      drawer: const AppNavDrawer(),
      appBar: AppBar(
        backgroundColor: AppColors.darkGreen,
        foregroundColor: AppColors.nearWhite,
        elevation: 0,
        title: const Text('Account'),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 560),
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              _card(ListTile(
                leading: const Icon(Icons.person, color: AppColors.darkGreen),
                title: Text(user?.displayName ?? ''),
                subtitle: Text(user?.email ?? ''),
              )),
              FutureBuilder<LearnerAccess>(
                future: _access,
                builder: (context, snap) {
                  final a = snap.data;
                  return _card(Column(children: [
                    ListTile(
                      leading: const Icon(Icons.workspace_premium,
                          color: AppColors.darkGreen),
                      title: const Text('Subscription'),
                      subtitle: Text(a == null ? 'Checking…' : _describe(a)),
                    ),
                    if (a != null && !a.full)
                      ListTile(
                        leading: const Icon(Icons.lock_open,
                            color: AppColors.darkGreen),
                        title: const Text('Get All Access'),
                        trailing: const Icon(Icons.chevron_right),
                        onTap: () => context.push('/subscribe').then((_) =>
                            setState(() => _access = SubscriptionService.refresh())),
                      ),
                    if (SubscriptionService.storeSupported) ...[
                      ListTile(
                        leading: const Icon(Icons.restore,
                            color: AppColors.darkGreen),
                        title: const Text('Restore purchases'),
                        onTap: () => context.push('/subscribe').then((_) =>
                            setState(() => _access = SubscriptionService.refresh())),
                      ),
                      ListTile(
                        leading: const Icon(Icons.manage_accounts,
                            color: AppColors.darkGreen),
                        title: const Text('Manage subscription'),
                        trailing: const Icon(Icons.open_in_new),
                        onTap: () => launchUrl(
                            Uri.parse(SubscriptionService.manageUrl),
                            mode: LaunchMode.externalApplication),
                      ),
                    ],
                  ]));
                },
              ),
              _card(Column(children: [
                ListTile(
                  leading: const Icon(Icons.description,
                      color: AppColors.darkGreen),
                  title: const Text('Terms of Use'),
                  trailing: const Icon(Icons.open_in_new),
                  onTap: () => launchUrl(Uri.parse(SubscriptionService.termsUrl),
                      mode: LaunchMode.externalApplication),
                ),
                ListTile(
                  leading:
                      const Icon(Icons.privacy_tip, color: AppColors.darkGreen),
                  title: const Text('Privacy Policy'),
                  trailing: const Icon(Icons.open_in_new),
                  onTap: () => launchUrl(
                      Uri.parse(SubscriptionService.privacyUrl),
                      mode: LaunchMode.externalApplication),
                ),
              ])),
              const SizedBox(height: 12),
              OutlinedButton.icon(
                onPressed: _deleting ? null : _delete,
                icon: _deleting
                    ? const SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(strokeWidth: 2))
                    : const Icon(Icons.delete_forever, color: Colors.redAccent),
                label: const Text('Delete account',
                    style: TextStyle(color: Colors.redAccent)),
                style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Colors.redAccent),
                    minimumSize: const Size(double.infinity, 48)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _card(Widget child) => Card(
        color: AppColors.nearWhite,
        margin: const EdgeInsets.symmetric(vertical: 6),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: child,
      );
}
