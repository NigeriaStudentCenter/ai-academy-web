import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/subscription/subscription_service.dart';
import '../../core/theme/app_colors.dart';

/// Subscribe to AI Academy All Access (Apple in-app purchase). Shows what the
/// subscription includes, both plans with the store's local prices, the
/// auto-renewal terms, and links to the Terms of Use and Privacy Policy.
class PaywallPage extends StatefulWidget {
  /// Debug builds only: show the plans even with full access (for testing
  /// and the App Store review screenshot).
  final bool preview;
  const PaywallPage({super.key, this.preview = false});

  @override
  State<PaywallPage> createState() => _PaywallPageState();
}

class _PaywallPageState extends State<PaywallPage> {
  late final Future<List<ProductDetails>> _products =
      SubscriptionService.products();

  @override
  void initState() {
    super.initState();
    SubscriptionService.start();
    SubscriptionService.message.value = null;
    SubscriptionService.access.addListener(_onAccess);
  }

  @override
  void dispose() {
    SubscriptionService.access.removeListener(_onAccess);
    super.dispose();
  }

  void _onAccess() {
    if (SubscriptionService.access.value.full && mounted) setState(() {});
  }

  String _period(ProductDetails p) =>
      p.id == SubscriptionService.yearlyId ? 'year' : 'month';

  @override
  Widget build(BuildContext context) {
    final unlocked = !(kDebugMode && widget.preview) &&
        SubscriptionService.access.value.full &&
        SubscriptionService.access.value.reason != 'unknown';
    return Scaffold(
      backgroundColor: AppColors.darkGreen,
      appBar: AppBar(
        backgroundColor: AppColors.darkGreen,
        foregroundColor: AppColors.nearWhite,
        elevation: 0,
        title: const Text('AI Academy All Access'),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 560),
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              const Text(
                'One subscription. Every course.',
                style: TextStyle(
                    color: AppColors.nearWhite,
                    fontSize: 24,
                    fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              for (final line in const [
                'Every course in the AI Academy catalogue',
                'Practice with AI: hands-on tasks with feedback',
                'AI Tutor, Student Success Hub and Business Marketing Hub',
                'Progress tracking across your devices',
                'Certificates when you complete a course',
              ])
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(children: [
                    const Icon(Icons.check_circle, color: AppColors.accentGold),
                    const SizedBox(width: 10),
                    Expanded(
                        child: Text(line,
                            style: const TextStyle(
                                color: AppColors.nearWhite, fontSize: 16))),
                  ]),
                ),
              const SizedBox(height: 20),
              if (unlocked)
                _card(const ListTile(
                  leading: Icon(Icons.verified, color: Colors.green),
                  title: Text('You have All Access'),
                  subtitle: Text('Everything in AI Academy is unlocked.'),
                ))
              else if (!SubscriptionService.storeSupported)
                _card(const Padding(
                  padding: EdgeInsets.all(16),
                  child: Text(
                      'Subscriptions are available in the AI Academy app for iPhone.',
                      style: TextStyle(color: AppColors.darkGreen)),
                ))
              else
                FutureBuilder<List<ProductDetails>>(
                  future: _products,
                  builder: (context, snap) {
                    if (snap.connectionState != ConnectionState.done) {
                      return const Center(
                          child: CircularProgressIndicator(
                              color: AppColors.nearWhite));
                    }
                    final products = snap.data ?? const [];
                    if (products.isEmpty) {
                      return _card(const Padding(
                        padding: EdgeInsets.all(16),
                        child: Text(
                            'Subscriptions are not available right now. Please try again later.',
                            style: TextStyle(color: AppColors.darkGreen)),
                      ));
                    }
                    return ValueListenableBuilder<bool>(
                      valueListenable: SubscriptionService.busy,
                      builder: (context, busy, _) => Column(
                        children: [
                          for (final p in products)
                            _card(ListTile(
                              title: Text(
                                p.id == SubscriptionService.yearlyId
                                    ? 'Yearly'
                                    : 'Monthly',
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.darkGreen),
                              ),
                              subtitle: Text('${p.price} per ${_period(p)}',
                                  style: const TextStyle(
                                      color: AppColors.darkGreen)),
                              trailing: ElevatedButton(
                                onPressed: busy
                                    ? null
                                    : () => SubscriptionService.buy(p),
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: AppColors.darkGreen,
                                    foregroundColor: AppColors.nearWhite),
                                child: const Text('Subscribe'),
                              ),
                            )),
                          if (busy)
                            const Padding(
                              padding: EdgeInsets.all(8),
                              child: CircularProgressIndicator(
                                  color: AppColors.nearWhite),
                            ),
                        ],
                      ),
                    );
                  },
                ),
              ValueListenableBuilder<String?>(
                valueListenable: SubscriptionService.message,
                builder: (context, msg, _) => msg == null
                    ? const SizedBox.shrink()
                    : Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: Text(msg,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                                color: AppColors.accentGold, fontSize: 15)),
                      ),
              ),
              const SizedBox(height: 16),
              Text(
                'Payment is charged to your Apple ID when you confirm the purchase. '
                'Your subscription renews automatically at the same price each '
                'month or year unless you cancel at least 24 hours before the end '
                'of the current period. You can manage or cancel it in your '
                'App Store account settings.',
                style: TextStyle(
                    color: AppColors.nearWhite.withValues(alpha: 0.85),
                    fontSize: 13,
                    height: 1.4),
              ),
              const SizedBox(height: 12),
              Wrap(
                alignment: WrapAlignment.center,
                spacing: 4,
                children: [
                  if (SubscriptionService.storeSupported)
                    TextButton(
                      onPressed: SubscriptionService.restore,
                      child: const Text('Restore purchases',
                          style: TextStyle(color: AppColors.nearWhite)),
                    ),
                  TextButton(
                    onPressed: () => _open(SubscriptionService.termsUrl),
                    child: const Text('Terms of Use',
                        style: TextStyle(color: AppColors.nearWhite)),
                  ),
                  TextButton(
                    onPressed: () => _open(SubscriptionService.privacyUrl),
                    child: const Text('Privacy Policy',
                        style: TextStyle(color: AppColors.nearWhite)),
                  ),
                ],
              ),
              if (unlocked)
                TextButton(
                  onPressed: () => context.go('/courses'),
                  child: const Text('Go to My Courses',
                      style: TextStyle(color: AppColors.accentGold)),
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

  Future<void> _open(String url) =>
      launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
}
