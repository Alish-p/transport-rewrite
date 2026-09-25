/**
 * Format Indian vehicle registration numbers:
 * - Standard: SS-RRXX-NNNN (e.g., JH10DD1612 -> JH-10DD-1612, WB11K5051 -> WB-11K-5051, DL011234 -> DL-01-1234)
 * - Bharat (BH) Series: YY-BH-NNNN-XX (e.g., 22BH1234AA -> 22-BH-1234-AA)
 * - Fallback: returns cleaned uppercase string or provided fallback for empty values.
 *
 * @param {string|null|undefined} vehicleNo - Vehicle number to format
 * @param {string} [fallback='-'] - Fallback when vehicle number is empty
 * @returns {string} Formatted vehicle number
 */
export function fVehicleNo(vehicleNo, fallback = '-') {
  if (!vehicleNo || (typeof vehicleNo !== 'string' && typeof vehicleNo !== 'number')) {
    return fallback;
  }

  const clean = String(vehicleNo).replace(/[\s-]/g, '').toUpperCase().trim();
  if (!clean) return fallback;

  // Bharat Series: 2 digits year + BH + 4 digits number + 1-2 letters
  const bhMatch = clean.match(/^(\d{2})(BH)(\d{4})([A-Z]{1,2})$/);
  if (bhMatch) {
    return `${bhMatch[1]}-${bhMatch[2]}-${bhMatch[3]}-${bhMatch[4]}`;
  }

  // Standard Indian Vehicle: 2 letters state + 2 digits RTO + optional 1-3 letters series + 1-4 digits number
  const stdMatch = clean.match(/^([A-Z]{2})(\d{2})([A-Z]{1,3})?(\d{1,4})$/);
  if (stdMatch) {
    const [, state, rto, series = '', number] = stdMatch;
    return `${state}-${rto}${series}-${number}`;
  }

  return clean;
}

export const formatVehicleNo = fVehicleNo;
