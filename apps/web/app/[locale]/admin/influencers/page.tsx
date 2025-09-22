'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface Influencer {
  id: string;
  name: string;
  code: string;
  email?: string;
  platform?: string;
  handle?: string;
  isActive: boolean;
  totalSignups: number;
  createdAt: string;
}

export default function InfluencersPage() {
  const { user, isLoaded } = useUser();
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInfluencer, setNewInfluencer] = useState({
    name: '',
    code: '',
    email: '',
    platform: '',
    handle: ''
  });

  useEffect(() => {
    if (isLoaded && user) {
      fetchInfluencers();
    }
  }, [isLoaded, user]);

  const fetchInfluencers = async () => {
    try {
      const response = await fetch('/api/admin/influencers');
      const data = await response.json();
      
      if (data.success) {
        setInfluencers(data.influencers);
      }
    } catch (error) {
      console.error('Error fetching influencers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInfluencer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/influencers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInfluencer),
      });

      const data = await response.json();
      
      if (data.success) {
        setInfluencers([data.influencer, ...influencers]);
        setNewInfluencer({ name: '', code: '', email: '', platform: '', handle: '' });
        setShowAddForm(false);
      } else {
        alert(data.error || 'Failed to add influencer');
      }
    } catch (error) {
      console.error('Error adding influencer:', error);
      alert('Failed to add influencer');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/influencers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      const data = await response.json();
      
      if (data.success) {
        setInfluencers(influencers.map(inf => 
          inf.id === id ? { ...inf, isActive: !isActive } : inf
        ));
      }
    } catch (error) {
      console.error('Error updating influencer:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this influencer?')) return;

    try {
      const response = await fetch(`/api/admin/influencers/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setInfluencers(influencers.filter(inf => inf.id !== id));
      }
    } catch (error) {
      console.error('Error deleting influencer:', error);
    }
  };

  if (!isLoaded) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return <div className="p-8">Please sign in to access this page.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Influencer Management</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            {showAddForm ? 'Cancel' : 'Add Influencer'}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Influencer</h2>
            <form onSubmit={handleAddInfluencer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newInfluencer.name}
                    onChange={(e) => setNewInfluencer({...newInfluencer, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referral Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newInfluencer.code}
                    onChange={(e) => setNewInfluencer({...newInfluencer, code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., influencer123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newInfluencer.email}
                    onChange={(e) => setNewInfluencer({...newInfluencer, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <input
                    type="text"
                    value={newInfluencer.platform}
                    onChange={(e) => setNewInfluencer({...newInfluencer, platform: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Instagram, YouTube, TikTok"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Handle
                  </label>
                  <input
                    type="text"
                    value={newInfluencer.handle}
                    onChange={(e) => setNewInfluencer({...newInfluencer, handle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., @username"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Add Influencer
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading influencers...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Signups
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {influencers.map((influencer) => (
                    <tr key={influencer.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {influencer.name}
                          </div>
                          {influencer.email && (
                            <div className="text-sm text-gray-500">
                              {influencer.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {influencer.code}
                          </code>
                          <button
                            onClick={() => {
                              const link = `${window.location.origin}?ref=${influencer.code}`;
                              navigator.clipboard.writeText(link);
                              alert('Referral link copied to clipboard!');
                            }}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                            title="Copy referral link"
                          >
                            📋
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {influencer.platform && influencer.handle ? (
                          <div>
                            <div className="font-medium">{influencer.platform}</div>
                            <div className="text-gray-500">{influencer.handle}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-semibold text-green-600">
                          {influencer.totalSignups}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(influencer.id, influencer.isActive)}
                          className={`px-2 py-1 text-xs rounded-full ${
                            influencer.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {influencer.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(influencer.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Use</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>1. Add influencers using the form above</p>
            <p>2. Give them their referral link: <code className="bg-blue-100 px-1 rounded">https://travira.com?ref=THEIR_CODE</code></p>
            <p>3. Track their signups in the table above</p>
            <p>4. Toggle their status to activate/deactivate their link</p>
          </div>
        </div>
      </div>
    </div>
  );
}
