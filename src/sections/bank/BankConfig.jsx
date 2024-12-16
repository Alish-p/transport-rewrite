export function validateBankSelection(bankDetails) {
  const requiredFields = ['name', 'ifsc', 'place', 'branch'];

  // eslint-disable-next-line no-restricted-syntax
  for (const field of requiredFields) {
    if (!bankDetails[field] || bankDetails[field].trim() === '') {
      return false;
    }
  }

  return true;
}
