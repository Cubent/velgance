'use client';

import { useState, useEffect } from 'react';
import { X, Settings, Plus, Trash2 } from 'lucide-react';
import { AirportSearch } from '@/components/AirportSearch';
import DestinationSearch from '@/components/DestinationSearch';

interface UserPreferences {
  homeAirports: string[];
  dreamDestinations: string[];
  deliveryFrequency: string;
  maxBudget?: number;
  preferredAirlines: string[];
  currency: string;
}

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences | null;
  onSave: (preferences: UserPreferences) => void;
}

export function PreferencesModal({ isOpen, onClose, preferences, onSave }: PreferencesModalProps) {
  const [formData, setFormData] = useState<UserPreferences>({
    homeAirports: [],
    dreamDestinations: [],
    deliveryFrequency: 'weekly',
    maxBudget: undefined,
    preferredAirlines: [],
    currency: 'USD'
  });

  const [newAirline, setNewAirline] = useState('');

  useEffect(() => {
    if (preferences) {
      setFormData(preferences);
    }
  }, [preferences]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const toggleAirport = (airport: string) => {
    setFormData(prev => {
      if (prev.homeAirports.includes(airport)) {
        return {
      ...prev,
      homeAirports: prev.homeAirports.filter(a => a !== airport)
        };
      } else {
        return {
          ...prev,
          homeAirports: [...prev.homeAirports, airport]
        };
      }
    });
  };


  const addAirline = () => {
    if (newAirline.trim() && !formData.preferredAirlines.includes(newAirline.trim())) {
      setFormData(prev => ({
        ...prev,
        preferredAirlines: [...prev.preferredAirlines, newAirline.trim()]
      }));
      setNewAirline('');
    }
  };

  const removeAirline = (airline: string) => {
    setFormData(prev => ({
      ...prev,
      preferredAirlines: prev.preferredAirlines.filter(a => a !== airline)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:bg-[#d5e27b] [&::-webkit-scrollbar-thumb]:rounded-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#045530]" />
            <h2 className="text-lg font-semibold text-[#045530]">Edit Preferences</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Home Airports */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#045530' }}>
              Home Airports
            </label>
            <AirportSearch
              selectedAirports={formData.homeAirports}
              onAirportToggle={toggleAirport}
              placeholder="Search for airport (e.g., Los Angeles, LAX, John F Kennedy)"
              className="mb-3"
            />
            <div className="flex flex-wrap gap-2">
              {formData.homeAirports.map((airport) => (
                <span
                  key={airport}
                  className="inline-flex items-center gap-1 bg-[#d5e27b] text-[#045530] px-3 py-1 rounded-full text-sm font-medium"
                >
                  {airport}
                  <button
                    onClick={() => toggleAirport(airport)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Dream Destinations */}
          <DestinationSearch
            selectedDestinations={formData.dreamDestinations}
            onToggleDestination={(destination) => {
              setFormData(prev => {
                if (prev.dreamDestinations.includes(destination)) {
                  return {
                    ...prev,
                    dreamDestinations: prev.dreamDestinations.filter(d => d !== destination)
                  };
                } else {
                  return {
                    ...prev,
                    dreamDestinations: [...prev.dreamDestinations, destination]
                  };
                }
              });
            }}
          />

          {/* Delivery Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Frequency
            </label>
            <select
              value={formData.deliveryFrequency}
              onChange={(e) => setFormData(prev => ({ ...prev, deliveryFrequency: e.target.value }))}
              className="w-full px-3 py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d5e27b] focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="bi_weekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
              className="w-full px-3 py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d5e27b] focus:border-transparent"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="CHF">CHF - Swiss Franc</option>
              <option value="CNY">CNY - Chinese Yuan</option>
              <option value="INR">INR - Indian Rupee</option>
              <option value="BRL">BRL - Brazilian Real</option>
              <option value="MXN">MXN - Mexican Peso</option>
              <option value="SGD">SGD - Singapore Dollar</option>
              <option value="HKD">HKD - Hong Kong Dollar</option>
              <option value="NOK">NOK - Norwegian Krone</option>
              <option value="SEK">SEK - Swedish Krona</option>
              <option value="DKK">DKK - Danish Krone</option>
              <option value="PLN">PLN - Polish Zloty</option>
              <option value="CZK">CZK - Czech Koruna</option>
              <option value="HUF">HUF - Hungarian Forint</option>
              <option value="RUB">RUB - Russian Ruble</option>
              <option value="ZAR">ZAR - South African Rand</option>
              <option value="KRW">KRW - South Korean Won</option>
              <option value="THB">THB - Thai Baht</option>
              <option value="MYR">MYR - Malaysian Ringgit</option>
              <option value="IDR">IDR - Indonesian Rupiah</option>
              <option value="PHP">PHP - Philippine Peso</option>
              <option value="VND">VND - Vietnamese Dong</option>
              <option value="TRY">TRY - Turkish Lira</option>
              <option value="AED">AED - UAE Dirham</option>
              <option value="SAR">SAR - Saudi Riyal</option>
              <option value="QAR">QAR - Qatari Riyal</option>
              <option value="KWD">KWD - Kuwaiti Dinar</option>
              <option value="BHD">BHD - Bahraini Dinar</option>
              <option value="OMR">OMR - Omani Rial</option>
              <option value="JOD">JOD - Jordanian Dinar</option>
              <option value="LBP">LBP - Lebanese Pound</option>
              <option value="EGP">EGP - Egyptian Pound</option>
              <option value="ILS">ILS - Israeli Shekel</option>
              <option value="CLP">CLP - Chilean Peso</option>
              <option value="COP">COP - Colombian Peso</option>
              <option value="PEN">PEN - Peruvian Sol</option>
              <option value="UYU">UYU - Uruguayan Peso</option>
              <option value="ARS">ARS - Argentine Peso</option>
              <option value="BOB">BOB - Bolivian Boliviano</option>
              <option value="PYG">PYG - Paraguayan Guarani</option>
              <option value="VES">VES - Venezuelan Bolivar</option>
              <option value="NZD">NZD - New Zealand Dollar</option>
            </select>
          </div>

          {/* Max Budget - HIDDEN */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Budget ({formData.currency})
            </label>
            <input
              type="number"
              value={formData.maxBudget || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, maxBudget: e.target.value ? Number(e.target.value) : undefined }))}
              placeholder="Enter max budget"
              className="w-full px-3 py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d5e27b] focus:border-transparent"
            />
          </div> */}

          {/* Preferred Airlines - HIDDEN */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Airlines
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newAirline}
                onChange={(e) => setNewAirline(e.target.value)}
                placeholder="Enter airline name (e.g., Delta)"
                className="flex-1 px-3 py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d5e27b] focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addAirline()}
              />
              <button
                onClick={addAirline}
                className="bg-[#d5e27b] text-[#045530] px-3 py-1.5 text-sm rounded-md hover:bg-[#c4d16a] transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.preferredAirlines.map((airline) => (
                <span
                  key={airline}
                  className="inline-flex items-center gap-1 bg-[#d5e27b] text-[#045530] px-3 py-1 rounded-full text-sm font-medium"
                >
                  {airline}
                  <button
                    onClick={() => removeAirline(airline)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div> */}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-[#045530] text-white px-4 py-1.5 text-sm rounded-md hover:bg-[#034a2a] transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
