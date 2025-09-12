export interface CurrencyConversionResult {
  convertedPrice: number;
  originalPrice: number;
  originalCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  conversionDate: string;
}

interface FXRatesResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

/**
 * Convert price from one currency to another using FXRatesAPI.com
 * This uses real-time exchange rates from a reliable API
 */
export async function convertCurrency(
  price: number,
  fromCurrency: string,
  toCurrency: string
): Promise<CurrencyConversionResult> {
  try {
    // If currencies are the same, return the original price
    if (fromCurrency === toCurrency) {
      return {
        convertedPrice: price,
        originalPrice: price,
        originalCurrency: fromCurrency,
        targetCurrency: toCurrency,
        exchangeRate: 1,
        conversionDate: new Date().toISOString().split('T')[0]
      };
    }

    const apiKey = process.env.FXRATES_API_KEY;
    if (!apiKey) {
      console.warn('FXRATES_API_KEY not found, using fallback conversion');
      return fallbackConversion(price, fromCurrency, toCurrency);
    }

    // Make request to FXRatesAPI.com
    const response = await fetch(`https://api.fxratesapi.com/latest?api_key=${apiKey}&base=${fromCurrency}&symbols=${toCurrency}`);
    
    if (!response.ok) {
      throw new Error(`FXRatesAPI request failed: ${response.status} ${response.statusText}`);
    }

    const data: FXRatesResponse = await response.json();
    
    if (!data.success || !data.rates || !data.rates[toCurrency]) {
      throw new Error('Invalid response from FXRatesAPI');
    }

    const exchangeRate = data.rates[toCurrency];
    const convertedPrice = Math.round(price * exchangeRate * 100) / 100; // Round to 2 decimal places

    console.log(`Currency conversion: ${price} ${fromCurrency} = ${convertedPrice} ${toCurrency} (rate: ${exchangeRate})`);

    return {
      convertedPrice,
      originalPrice: price,
      originalCurrency: fromCurrency,
      targetCurrency: toCurrency,
      exchangeRate,
      conversionDate: data.date
    };

  } catch (error) {
    console.error('Error converting currency with FXRatesAPI:', error);
    
    // Fallback to basic conversion
    return fallbackConversion(price, fromCurrency, toCurrency);
  }
}

/**
 * Fallback conversion using hardcoded rates
 * This is used when the API is unavailable
 */
function fallbackConversion(
  price: number,
  fromCurrency: string,
  toCurrency: string
): CurrencyConversionResult {
  // Basic fallback rates (these should be updated periodically)
  const fallbackRates: Record<string, Record<string, number>> = {
    'USD': {
      'EUR': 0.85,
      'GBP': 0.73,
      'CAD': 1.35,
      'AUD': 1.52,
      'JPY': 150.0,
      'CHF': 0.92,
      'CNY': 6.45,
      'INR': 75.0,
      'BRL': 5.2,
      'MXN': 20.5
    },
    'EUR': {
      'USD': 1.18,
      'GBP': 0.86,
      'CAD': 1.59,
      'AUD': 1.79,
      'JPY': 176.0,
      'CHF': 1.08,
      'CNY': 7.59,
      'INR': 88.2,
      'BRL': 6.12,
      'MXN': 24.1
    }
    // Add more currencies as needed
  };

  let exchangeRate = 1.0;
  
  // Try to find a conversion rate
  if (fallbackRates[fromCurrency] && fallbackRates[fromCurrency][toCurrency]) {
    exchangeRate = fallbackRates[fromCurrency][toCurrency];
  } else if (fallbackRates[toCurrency] && fallbackRates[toCurrency][fromCurrency]) {
    exchangeRate = 1 / fallbackRates[toCurrency][fromCurrency];
  }

  const convertedPrice = Math.round(price * exchangeRate * 100) / 100;

  console.log(`Fallback conversion: ${price} ${fromCurrency} = ${convertedPrice} ${toCurrency} (rate: ${exchangeRate})`);

  return {
    convertedPrice,
    originalPrice: price,
    originalCurrency: fromCurrency,
    targetCurrency: toCurrency,
    exchangeRate,
    conversionDate: new Date().toISOString().split('T')[0]
  };
}

/**
 * Convert multiple prices at once (batch conversion)
 */
export async function convertMultipleCurrencies(
  prices: Array<{ price: number; currency: string }>,
  targetCurrency: string
): Promise<Array<CurrencyConversionResult>> {
  const conversions = await Promise.all(
    prices.map(({ price, currency }) => 
      convertCurrency(price, currency, targetCurrency)
    )
  );
  
  return conversions;
}

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number, currency: string): string {
  const currencySymbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'CAD': 'C$',
    'AUD': 'A$',
    'JPY': '¥',
    'CHF': 'CHF',
    'CNY': '¥',
    'INR': '₹',
    'BRL': 'R$',
    'MXN': '$',
    'SGD': 'S$',
    'HKD': 'HK$',
    'NOK': 'kr',
    'SEK': 'kr',
    'DKK': 'kr',
    'PLN': 'zł',
    'CZK': 'Kč',
    'HUF': 'Ft',
    'RUB': '₽',
    'ZAR': 'R',
    'KRW': '₩',
    'THB': '฿',
    'MYR': 'RM',
    'IDR': 'Rp',
    'PHP': '₱',
    'VND': '₫',
    'TRY': '₺',
    'AED': 'د.إ',
    'SAR': '﷼',
    'QAR': '﷼',
    'KWD': 'د.ك',
    'BHD': 'د.ب',
    'OMR': '﷼',
    'JOD': 'د.ا',
    'LBP': 'ل.ل',
    'EGP': '£',
    'ILS': '₪',
    'CLP': '$',
    'COP': '$',
    'PEN': 'S/',
    'UYU': '$',
    'ARS': '$',
    'BOB': 'Bs',
    'PYG': '₲',
    'VES': 'Bs.S',
    'NZD': 'NZ$'
  };

  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${price.toLocaleString()}`;
}