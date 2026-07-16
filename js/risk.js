/**
 * Risk scoring and recommendation logic (spec §7–§8).
 */

const RISK_LEVELS = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

const RECOMMENDATIONS = {
  billing: "Contact billing — resolve payment or win-back offer",
  inactiveStore: "Re-engagement outreach — check if store is still active",
  orderDecline: "Review catalog and pricing — offer growth consultation",
  loginGap: "Send re-engagement email and schedule success call",
  support: "Escalate to support lead — proactive outreach",
  trial: "Send trial extension and onboarding checklist",
  onboarding: "Assign onboarding specialist for setup help",
  healthy: "No action — continue monitoring",
};

/**
 * Returns order decline rate (0–1) or null when prior period is zero.
 */
function getOrderDecline(merchant) {
  const { ordersPrior30d, ordersLast30d } = merchant;
  if (ordersPrior30d === 0) return null;
  return (ordersPrior30d - ordersLast30d) / ordersPrior30d;
}

function formatDeclinePct(decline) {
  return `${Math.round(decline * 100)}% order decline`;
}

/**
 * Evaluate risk tier for a merchant.
 */
function evaluateRisk(merchant) {
  const decline = getOrderDecline(merchant);
  const {
    subscriptionStatus,
    daysSinceLastLogin,
    daysSinceLastOrder,
    onboardingComplete,
    supportTickets30d,
  } = merchant;

  if (subscriptionStatus === "past_due" || subscriptionStatus === "cancelled") {
    return RISK_LEVELS.HIGH;
  }
  if (decline !== null && decline > 0.4) {
    return RISK_LEVELS.HIGH;
  }
  if (daysSinceLastLogin >= 21) {
    return RISK_LEVELS.HIGH;
  }
  if (daysSinceLastOrder >= 30) {
    return RISK_LEVELS.HIGH;
  }

  if (decline !== null && decline > 0.15 && decline <= 0.4) {
    return RISK_LEVELS.MEDIUM;
  }
  if (
    subscriptionStatus === "trial" &&
    (daysSinceLastLogin >= 7 || onboardingComplete < 50)
  ) {
    return RISK_LEVELS.MEDIUM;
  }
  if (onboardingComplete < 50) {
    return RISK_LEVELS.MEDIUM;
  }
  if (supportTickets30d >= 3) {
    return RISK_LEVELS.MEDIUM;
  }

  return RISK_LEVELS.LOW;
}

/**
 * Determine primary trigger and recommendation (priority order per spec §8).
 */
function getPrimaryTrigger(merchant) {
  const decline = getOrderDecline(merchant);
  const {
    subscriptionStatus,
    daysSinceLastLogin,
    daysSinceLastOrder,
    onboardingComplete,
    supportTickets30d,
  } = merchant;

  if (subscriptionStatus === "past_due" || subscriptionStatus === "cancelled") {
    return {
      keySignal: `Subscription ${subscriptionStatus.replace("_", " ")}`,
      recommendation: RECOMMENDATIONS.billing,
    };
  }

  if (daysSinceLastOrder >= 30) {
    return {
      keySignal: `No orders in ${daysSinceLastOrder} days`,
      recommendation: RECOMMENDATIONS.inactiveStore,
    };
  }

  if (decline !== null && decline > 0.15) {
    return {
      keySignal: formatDeclinePct(decline),
      recommendation: RECOMMENDATIONS.orderDecline,
    };
  }

  if (daysSinceLastLogin >= 14) {
    return {
      keySignal: `No login in ${daysSinceLastLogin} days`,
      recommendation: RECOMMENDATIONS.loginGap,
    };
  }

  if (supportTickets30d >= 3) {
    return {
      keySignal: `${supportTickets30d} support tickets (30d)`,
      recommendation: RECOMMENDATIONS.support,
    };
  }

  if (
    subscriptionStatus === "trial" &&
    (daysSinceLastLogin >= 7 || onboardingComplete < 50)
  ) {
    return {
      keySignal: `Trial merchant — ${onboardingComplete}% onboarded`,
      recommendation: RECOMMENDATIONS.trial,
    };
  }

  if (onboardingComplete < 50) {
    return {
      keySignal: `Onboarding ${onboardingComplete}% complete`,
      recommendation: RECOMMENDATIONS.onboarding,
    };
  }

  return {
    keySignal: "Stable usage",
    recommendation: RECOMMENDATIONS.healthy,
  };
}

/**
 * Full evaluation: risk tier + key signal + recommendation.
 */
function evaluateMerchant(merchant) {
  const risk = evaluateRisk(merchant);
  const { keySignal, recommendation } = getPrimaryTrigger(merchant);
  return {
    ...merchant,
    risk,
    keySignal,
    recommendation,
  };
}

/**
 * Evaluate all merchants.
 */
function evaluateAllMerchants(merchants) {
  return merchants.map(evaluateMerchant);
}
