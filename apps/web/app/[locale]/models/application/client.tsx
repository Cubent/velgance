'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, User, Mail, MapPin, Ruler, Weight, Camera, Instagram, Upload } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  height: string;
  weight: string;
  instagram: string;
  portfolio: File | null;
  experience: string;
  availability: string;
  additionalInfo: string;
}

export default function ModelApplicationClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    height: '',
    weight: '',
    instagram: '',
    portfolio: null,
    experience: '',
    availability: '',
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { number: 1, title: 'Informazioni Personali', icon: User },
    { number: 2, title: 'Contatti', icon: Mail },
    { number: 3, title: 'Caratteristiche Fisiche', icon: Ruler },
    { number: 4, title: 'Social Media', icon: Instagram },
    { number: 5, title: 'Portfolio', icon: Camera },
    { number: 6, title: 'Informazioni Aggiuntive', icon: User }
  ];

  const handleInputChange = (field: keyof FormData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange('portfolio', file);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName.trim() !== '' && formData.lastName.trim() !== '';
      case 2:
        return formData.email.trim() !== '' && formData.location.trim() !== '';
      case 3:
        return formData.height.trim() !== '';
      case 4:
        return true; // Instagram is optional
      case 5:
        return formData.portfolio !== null;
      case 6:
        return true; // All fields are optional
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length && validateCurrentStep()) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch('/api/models/application', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        router.push('/models/application/success');
      } else {
        console.error('Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cognome *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-black"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Città *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-black"
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Altezza *
              </label>
              <input
                type="text"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                placeholder="es. 175cm o 5'9&quot;"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso
              </label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="es. 65kg o 143lbs"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-black"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                placeholder="es. @username o https://instagram.com/username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-black"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio (Foto) *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Carica una foto a figura intera che mostri il tuo corpo completo
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="portfolio-upload"
                  required
                />
                <label
                  htmlFor="portfolio-upload"
                  className="inline-block bg-black text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                >
                  Scegli File
                </label>
                {formData.portfolio && (
                  <p className="text-sm text-green-600 mt-2">
                    File selezionato: {formData.portfolio.name}
                  </p>
                )}
              </div>
              
              {/* Photo Examples */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-black mb-4">Come fare le foto</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <h4 className="text-xs font-medium text-gray-700 mb-1">✅ Corretta</h4>
                    <img 
                      src="https://i.postimg.cc/Wz3S7w50/Full-Body-Picture.png" 
                      alt="Esempio foto corretta"
                      className="w-full max-w-[150px] sm:max-w-[300px] aspect-square mx-auto object-cover rounded-lg border border-gray-200"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Figura intera, buona illuminazione
                    </p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-xs font-medium text-gray-700 mb-1">📸 Esempio</h4>
                    <img 
                      src="https://i.postimg.cc/vBFZfGvs/Full-Body-Picture-1.png" 
                      alt="Esempio foto"
                      className="w-full max-w-[150px] sm:max-w-[300px] aspect-square mx-auto object-top rounded-lg border border-gray-200"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Esempio
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-black mb-2">Consigli per la foto perfetta:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Usa una buona illuminazione naturale</li>
                    <li>• Sfondo neutro e pulito</li>
                    <li>• Foto a figura intera (dai piedi alla testa)</li>
                    <li>• Abbigliamento semplice e aderente</li>
                    <li>• Posizione naturale e rilassata</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Esperienza
              </label>
              <textarea
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                placeholder="Descrivi la tua esperienza nel mondo della moda..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent h-24 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponibilità
              </label>
              <textarea
                value={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                placeholder="Descrivi la tua disponibilità per lavori e viaggi..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent h-24 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Informazioni Aggiuntive
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                placeholder="Qualsiasi altra informazione che vorresti condividere..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent h-24 text-black"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push('/models')}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna ai Modelli
          </button>
          <h1 className="text-3xl font-light text-black italic" style={{ fontFamily: 'serif' }}>
            Candidati come Modello
          </h1>
          <p className="text-gray-600 mt-2">
            Unisciti al nostro team di modelli professionisti
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              const isTextAbove = index % 2 === 0; // Alternate: even indices above, odd below
              
              return (
                <div key={step.number} className="flex flex-col items-center">
                  {isTextAbove && (
                    <div className="mb-2 hidden sm:block">
                      <p className={`text-xs font-medium text-center ${
                        isActive ? 'text-black' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  )}
                  
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive ? 'border-black bg-black text-white' :
                    isCompleted ? 'border-green-700 bg-green-700 text-white' :
                    'border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  
                  {!isTextAbove && (
                    <div className="mt-2 hidden sm:block">
                      <p className={`text-xs font-medium text-center ${
                        isActive ? 'text-black' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  )}
                  
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white">
          <div className={`mb-8 transition-all duration-300 ease-in-out ${
            isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
          }`}>
            <h2 className="text-2xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              {steps[currentStep - 1].title}
            </h2>
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Indietro
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!validateCurrentStep()}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  validateCurrentStep()
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Avanti
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {isSubmitting ? 'Invio in corso...' : 'Invia Candidatura'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
