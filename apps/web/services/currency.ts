import OpenAI from 'openai';

// Initialize OpenAI client for currency conversion
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CurrencyConversionResult {
  convertedPrice: number;
  originalPrice: number;
  originalCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  conversionDate: string;
}

/**
 * Convert price from one currency to another using AI
 * This uses AI to get current exchange rates and convert prices
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

    const prompt = `You are a financial expert specializing in currency exchange rates. I need you to convert a price from one currency to another using current exchange rates.

IMPORTANT RULES:
1. Use current, accurate exchange rates (as of today's date)
2. Return ONLY a JSON object with the following structure:
{
  "exchangeRate": 0.85,
  "convertedPrice": 425.50,
  "conversionDate": "2024-01-15"
}
3. Round the converted price to 2 decimal places
4. Use realistic, current exchange rates
5. The exchangeRate should be the rate from ${fromCurrency} to ${toCurrency}

Price to convert: ${price} ${fromCurrency}
Convert to: ${toCurrency}

Return only the JSON object:`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a financial expert specializing in currency exchange rates. Always return accurate, current exchange rates in JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 200,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI for currency conversion');
    }

    // Parse the JSON response
    const conversionData = JSON.parse(response.trim());
    
    if (!conversionData.exchangeRate || !conversionData.convertedPrice) {
      throw new Error('Invalid conversion data received from AI');
    }

    return {
      convertedPrice: conversionData.convertedPrice,
      originalPrice: price,
      originalCurrency: fromCurrency,
      targetCurrency: toCurrency,
      exchangeRate: conversionData.exchangeRate,
      conversionDate: conversionData.conversionDate || new Date().toISOString().split('T')[0]
    };

  } catch (error) {
    console.error('Error converting currency with AI:', error);
    
    // Fallback to a simple conversion using approximate rates
    const fallbackRate = getFallbackExchangeRate(fromCurrency, toCurrency);
    const convertedPrice = Math.round(price * fallbackRate * 100) / 100;
    
    return {
      convertedPrice,
      originalPrice: price,
      originalCurrency: fromCurrency,
      targetCurrency: toCurrency,
      exchangeRate: fallbackRate,
      conversionDate: new Date().toISOString().split('T')[0]
    };
  }
}

/**
 * Get fallback exchange rates for common currency pairs
 * These are approximate rates that can be used as fallback
 */
function getFallbackExchangeRate(fromCurrency: string, toCurrency: string): number {
  const rates: Record<string, Record<string, number>> = {
    'USD': {
      'EUR': 0.85,
      'GBP': 0.79,
      'CAD': 1.35,
      'AUD': 1.52,
      'JPY': 150.0,
      'CHF': 0.88,
      'CNY': 7.2,
      'INR': 83.0,
      'BRL': 5.0,
      'MXN': 17.0,
      'SGD': 1.35,
      'HKD': 7.8,
      'NOK': 10.5,
      'SEK': 10.8,
      'DKK': 6.9,
      'PLN': 4.0,
      'CZK': 23.0,
      'HUF': 360.0,
      'RUB': 90.0,
      'ZAR': 18.5,
      'KRW': 1300.0,
      'THB': 35.0,
      'MYR': 4.7,
      'IDR': 15500.0,
      'PHP': 56.0,
      'VND': 24000.0,
      'TRY': 30.0,
      'AED': 3.67,
      'SAR': 3.75,
      'QAR': 3.64,
      'KWD': 0.31,
      'BHD': 0.38,
      'OMR': 0.38,
      'JOD': 0.71,
      'LBP': 1500.0,
      'EGP': 31.0,
      'ILS': 3.7,
      'CLP': 900.0,
      'COP': 4100.0,
      'PEN': 3.7,
      'UYU': 40.0,
      'ARS': 850.0,
      'BOB': 6.9,
      'PYG': 7300.0,
      'VES': 36.0,
      'NZD': 1.62
    },
    'EUR': {
      'USD': 1.18,
      'GBP': 0.93,
      'CAD': 1.59,
      'AUD': 1.79,
      'JPY': 176.0,
      'CHF': 1.04,
      'CNY': 8.5,
      'INR': 98.0,
      'BRL': 5.9,
      'MXN': 20.0,
      'SGD': 1.59,
      'HKD': 9.2,
      'NOK': 12.4,
      'SEK': 12.7,
      'DKK': 8.1,
      'PLN': 4.7,
      'CZK': 27.0,
      'HUF': 424.0,
      'RUB': 106.0,
      'ZAR': 21.8,
      'KRW': 1530.0,
      'THB': 41.0,
      'MYR': 5.5,
      'IDR': 18200.0,
      'PHP': 66.0,
      'VND': 28200.0,
      'TRY': 35.0,
      'AED': 4.33,
      'SAR': 4.42,
      'QAR': 4.29,
      'KWD': 0.36,
      'BHD': 0.45,
      'OMR': 0.45,
      'JOD': 0.84,
      'LBP': 1770.0,
      'EGP': 36.5,
      'ILS': 4.4,
      'CLP': 1060.0,
      'COP': 4830.0,
      'PEN': 4.4,
      'UYU': 47.0,
      'ARS': 1000.0,
      'BOB': 8.1,
      'PYG': 8600.0,
      'VES': 42.0,
      'NZD': 1.91
    }
  };

  // Check if we have a direct rate
  if (rates[fromCurrency] && rates[fromCurrency][toCurrency]) {
    return rates[fromCurrency][toCurrency];
  }

  // Check if we have the reverse rate
  if (rates[toCurrency] && rates[toCurrency][fromCurrency]) {
    return 1 / rates[toCurrency][fromCurrency];
  }

  // Default fallback - assume 1:1 if no rate found
  console.warn(`No exchange rate found for ${fromCurrency} to ${toCurrency}, using 1:1`);
  return 1;
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
