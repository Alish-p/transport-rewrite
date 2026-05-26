/**
 * Helper to get the total freight amount for a subtrip.
 * Prefers the new dynamically calculated freight amount,
 * but falls back to the legacy rate * loadingWeight if not available.
 * 
 * @param {Object} subtrip 
 * @returns {Number}
 */
export const getFreightAmount = (subtrip) => {
  if (!subtrip) return 0;
  return subtrip.freightDetails?.calculatedFreightAmount ?? ((subtrip.rate || 0) * (subtrip.loadingWeight || 0));
};

/**
 * Helper to get the total commission amount for a subtrip (market vehicles).
 * Prefers the new dynamically calculated commission amount,
 * but falls back to the legacy commissionRate * loadingWeight if not available.
 * 
 * @param {Object} subtrip 
 * @returns {Number}
 */
export const getCommissionAmount = (subtrip) => {
  if (!subtrip) return 0;
  return subtrip.commissionDetails?.calculatedCommissionAmount ?? ((subtrip.commissionRate || 0) * (subtrip.loadingWeight || 0));
};
