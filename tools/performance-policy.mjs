export function evaluatePerformance(measurements, budgets) {
  const valid = [measurements.local.p95Ms, measurements.remote.p95Ms].every(
    (n) => Number.isFinite(n) && n >= 0,
  );
  const product = {
    local: valid && measurements.local.p95Ms < budgets.product.localP95Ms,
    remote: valid && measurements.remote.p95Ms < budgets.product.remoteP95Ms,
  };
  const regression = {
    local: valid && measurements.local.p95Ms < budgets.regression.localP95Ms,
    remote: valid && measurements.remote.p95Ms < budgets.regression.remoteP95Ms,
  };
  return {
    valid,
    product,
    regression,
    passed:
      valid &&
      Object.values(product).every(Boolean) &&
      Object.values(regression).every(Boolean),
  };
}
