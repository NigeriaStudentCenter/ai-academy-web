import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:in_app_purchase/in_app_purchase.dart';

import '../api/api_client.dart';
import '../auth/app_auth_state.dart';

/// What the learner can use, from /api/subscription.
class LearnerAccess {
  final bool full;
  final String reason; // paywall-off | admin | organisation | subscription | none
  final bool paywall;
  final DateTime? expiresAt;
  const LearnerAccess(this.full, this.reason, this.paywall, this.expiresAt);

  static const unknown = LearnerAccess(true, 'unknown', false, null);

  factory LearnerAccess.fromJson(Map<String, dynamic> j) => LearnerAccess(
        j['full'] as bool? ?? true,
        j['reason'] as String? ?? 'unknown',
        j['paywall'] as bool? ?? false,
        DateTime.tryParse(j['expiresAt'] as String? ?? ''),
      );

  bool get subscribed => reason == 'subscription';
}

/// AI Academy All Access: one subscription (monthly or yearly) bought with
/// Apple in-app purchase. The server confirms every purchase with Apple
/// (/api/verifyPurchase) before anything unlocks.
class SubscriptionService {
  static const monthlyId = 'org.bsoedu.aiacademy.allaccess.monthly';
  static const yearlyId = 'org.bsoedu.aiacademy.allaccess.yearly';
  static const productIds = {monthlyId, yearlyId};

  static const termsUrl =
      'https://black-sky-0782ebe03.7.azurestaticapps.net/terms.html';
  static const privacyUrl =
      'https://black-sky-0782ebe03.7.azurestaticapps.net/privacy.html';
  static const manageUrl = 'https://apps.apple.com/account/subscriptions';

  static final ValueNotifier<LearnerAccess> access =
      ValueNotifier(LearnerAccess.unknown);

  /// Status or error messages from the purchase flow, for the subscribe screen.
  static final ValueNotifier<String?> message = ValueNotifier(null);
  static final ValueNotifier<bool> busy = ValueNotifier(false);

  static StreamSubscription<List<PurchaseDetails>>? _purchases;

  /// In-app purchase is used on iOS only for now (Google Play billing comes
  /// with the Android release).
  static bool get storeSupported =>
      !kIsWeb && defaultTargetPlatform == TargetPlatform.iOS;

  static Future<LearnerAccess> refresh() async {
    try {
      final response = await ApiClient.get('subscription');
      if (response.statusCode == 200) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;
        access.value = LearnerAccess.fromJson(
            json['access'] as Map<String, dynamic>? ?? const {});
      }
    } catch (_) {
      // Keep the last known access; the server enforces it anyway.
    }
    return access.value;
  }

  /// Starts listening for store purchases (call once after sign-in).
  static void start() {
    if (!storeSupported || _purchases != null) return;
    _purchases = InAppPurchase.instance.purchaseStream.listen(_onPurchases,
        onError: (Object e) => message.value = 'Purchase failed: $e');
  }

  static Future<List<ProductDetails>> products() async {
    if (!storeSupported || !await InAppPurchase.instance.isAvailable()) {
      return const [];
    }
    final response =
        await InAppPurchase.instance.queryProductDetails(productIds);
    final list = response.productDetails.toList()
      ..sort((a, b) => a.id == monthlyId ? -1 : (b.id == monthlyId ? 1 : 0));
    return list;
  }

  static Future<void> buy(ProductDetails product) async {
    start();
    message.value = null;
    busy.value = true;
    try {
      await InAppPurchase.instance.buyNonConsumable(
        purchaseParam: PurchaseParam(
          productDetails: product,
          // Ties the purchase to this AI Academy account (Apple appAccountToken).
          applicationUserName: AppAuthState.currentUser?.id,
        ),
      );
    } catch (e) {
      busy.value = false;
      message.value = 'Could not start the purchase: $e';
    }
  }

  static Future<void> restore() async {
    start();
    message.value = null;
    busy.value = true;
    await InAppPurchase.instance.restorePurchases(
        applicationUserName: AppAuthState.currentUser?.id);
    // If there is nothing to restore the stream stays quiet.
    Future.delayed(const Duration(seconds: 8), () {
      if (busy.value) {
        busy.value = false;
        message.value ??= 'No subscription to restore on this Apple ID.';
      }
    });
  }

  static Future<void> _onPurchases(List<PurchaseDetails> purchases) async {
    for (final p in purchases) {
      switch (p.status) {
        case PurchaseStatus.pending:
          busy.value = true;
        case PurchaseStatus.purchased:
        case PurchaseStatus.restored:
          // Leave the transaction open if the server couldn't be reached, so
          // the store delivers it again and nothing paid for is lost.
          if (!await _verify(p)) continue;
        case PurchaseStatus.error:
          busy.value = false;
          message.value = p.error?.message ?? 'The purchase did not complete.';
        case PurchaseStatus.canceled:
          busy.value = false;
      }
      if (p.pendingCompletePurchase) {
        await InAppPurchase.instance.completePurchase(p);
      }
    }
  }

  /// Confirms the purchase with the server. False if the server couldn't be
  /// reached (the purchase should then stay unfinished and be retried).
  static Future<bool> _verify(PurchaseDetails p) async {
    if (!AppAuthState.isLoggedIn) return false;
    try {
      final response = await ApiClient.post(
        'verifyPurchase',
        jsonEncode({'platform': 'apple', 'transactionId': p.purchaseID}),
      );
      final json = jsonDecode(response.body) as Map<String, dynamic>;
      if (response.statusCode == 200) {
        access.value = LearnerAccess.fromJson(
            json['access'] as Map<String, dynamic>? ?? const {});
        message.value = access.value.full
            ? 'You now have AI Academy All Access. Enjoy!'
            : 'Your subscription is no longer active.';
      } else {
        message.value = json['error'] as String? ??
            'We could not confirm your purchase (HTTP ${response.statusCode}).';
        if (response.statusCode >= 500) return false;
      }
      return true;
    } catch (e) {
      message.value = 'We could not confirm your purchase yet. It will be retried automatically.';
      return false;
    } finally {
      busy.value = false;
    }
  }
}
