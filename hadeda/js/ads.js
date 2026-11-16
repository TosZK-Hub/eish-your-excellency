// Rewarded placements only. Test IDs are Google's public AdMob samples.
// Nothing here contacts a network. Wire a real SDK later by replacing
// completeRewarded() and keeping these placement names.

export const TEST_IDS = {
  androidApp: "ca-app-pub-3940256099942544~3347511713",
  rewarded: "ca-app-pub-3940256099942544/5224354917",
};

const PLACEMENTS = {
  continue: "one-more-flap",
  double: "double-koeksisters",
};

export function beginRewarded(placement) {
  const name = PLACEMENTS[placement] || placement;
  return {
    placement: name,
    testUnit: TEST_IDS.rewarded,
    stub: true,
    started: Date.now(),
  };
}

export function completeRewarded(session) {
  if (!session || !session.stub) return Promise.resolve({ rewarded: false, stub: true });
  return Promise.resolve({
    rewarded: true,
    stub: true,
    placement: session.placement,
    testUnit: session.testUnit,
  });
}
