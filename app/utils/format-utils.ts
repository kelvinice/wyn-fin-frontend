export function formatCurrency(amount: number, currencyCode: string = 'IDR'): string {
  // Define formatting options for different currencies
  const currencyOptions: Record<string, Intl.NumberFormatOptions> = {
    USD: {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    },
    IDR: {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    },
    EUR: {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    },
    GBP: {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    },
    JPY: {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    },
    CAD: {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    },
    AUD: {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  };

  // Use provided currency or fallback to IDR
  const options = currencyOptions[currencyCode] || currencyOptions.IDR;
  
  // Format the number according to the locale and currency
  return new Intl.NumberFormat('id-ID', options).format(amount);
}