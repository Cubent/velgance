'use client';

import { useState, useEffect } from 'react';
import { X, Settings, Plus, Trash2 } from 'lucide-react';

interface UserPreferences {
  homeAirports: string[];
  dreamDestinations: string[];
  deliveryFrequency: string;
  maxBudget?: number;
  preferredAirlines: string[];
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
    preferredAirlines: []
  });

  const [newAirport, setNewAirport] = useState('');
  const [newDestination, setNewDestination] = useState('');
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

  const addAirport = () => {
    if (newAirport.trim() && !formData.homeAirports.includes(newAirport.trim())) {
      setFormData(prev => ({
        ...prev,
        homeAirports: [...prev.homeAirports, newAirport.trim()]
      }));
      setNewAirport('');
    }
  };

  const removeAirport = (airport: string) => {
    setFormData(prev => ({
      ...prev,
      homeAirports: prev.homeAirports.filter(a => a !== airport)
    }));
  };

  const addDestination = () => {
    if (newDestination.trim() && !formData.dreamDestinations.includes(newDestination.trim())) {
      setFormData(prev => ({
        ...prev,
        dreamDestinations: [...prev.dreamDestinations, newDestination.trim()]
      }));
      setNewDestination('');
    }
  };

  const removeDestination = (destination: string) => {
    setFormData(prev => ({
      ...prev,
      dreamDestinations: prev.dreamDestinations.filter(d => d !== destination)
    }));
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
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Home Airports
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newAirport}
                onChange={(e) => setNewAirport(e.target.value)}
                placeholder="Enter airport code (e.g., JFK)"
                className="flex-1 px-3 py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d5e27b] focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addAirport()}
              />
              <button
                onClick={addAirport}
                className="bg-[#d5e27b] text-[#045530] px-3 py-1.5 text-sm rounded-md hover:bg-[#c4d16a] transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.homeAirports.map((airport) => (
                <span
                  key={airport}
                  className="inline-flex items-center gap-1 bg-[#d5e27b] text-[#045530] px-3 py-1 rounded-full text-sm font-medium"
                >
                  {airport}
                  <button
                    onClick={() => removeAirport(airport)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Dream Destinations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dream Destinations
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                placeholder="Enter destination (e.g., Tokyo)"
                className="flex-1 px-3 py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d5e27b] focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addDestination()}
              />
              <button
                onClick={addDestination}
                className="bg-[#d5e27b] text-[#045530] px-3 py-1.5 text-sm rounded-md hover:bg-[#c4d16a] transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.dreamDestinations.map((destination) => (
                <span
                  key={destination}
                  className="inline-flex items-center gap-1 bg-[#d5e27b] text-[#045530] px-3 py-1 rounded-full text-sm font-medium"
                >
                  {destination}
                  <button
                    onClick={() => removeDestination(destination)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

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

          {/* Max Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Budget (USD)
            </label>
            <input
              type="number"
              value={formData.maxBudget || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, maxBudget: e.target.value ? Number(e.target.value) : undefined }))}
              placeholder="Enter max budget"
              className="w-full px-3 py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d5e27b] focus:border-transparent"
            />
          </div>

          {/* Preferred Airlines */}
          <div>
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
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
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
