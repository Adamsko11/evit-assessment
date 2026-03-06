h'use client';

import { useState } from 'react';
import { formSections, FormField } from '@/lib/formConfig';

export default function AssessmentForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);h
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentSection = formSections[currentStep];
  const totalSteps = formSections.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  function handleChange(fieldId: string, value: string | string[]) {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  }

  function handleCheckboxChange(fieldId: string, option: string, checked: boolean) {
    const current = (formData[fieldId] as string[]) || [];
    const updated = checked
      ? [...current, option]
      : current.filter(v => v !== option);
    handleChange(fieldId, updated);
  }

  function validateStep(): boolean {
    const newErrors: Record<string, string> = {};
    for (const field of currentSection.fields) {
      if (field.required) {
        const value = formData[field.id];
        if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && value.trim() === '')) {
          newErrors[field.id] = 'This field is required';
        }
      }
      if (field.type === 'email' && formData[field.id]) {
        const email = formData[field.id] as string;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          newErrors[field.id] = 'Please enter a valid email';
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleBack() {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit() {
    if (!validateStep()) return;
    setIsSubmitting(true);

    try {
      // Flatten arrays to strings for submission
      const submitData: Record<string, string> = {};
      for (const [key, value] of Object.entries(formData)) {
        submitData[key] = Array.isArray(value) ? value.join(', ') : value;
      }

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Submission failed');
      }

      setIsSubmitted(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto mb-2">
          Your Sales & Growth Readiness Assessment has been submitted successfully.
        </p>
        <p className="text-gray-500">
          Our team will review your answers within 24 hours and reach out via your preferred contact method.
        </p>
        <div className="mt-8 p-4 bg-blue-50 rounded-lg inline-block">
          <p className="text-blue-800 text-sm font-medium">
            Want to schedule a call right away?{' '}
            <a href="https://meetings-na2.hubspot.com/adam-skoneczny" className="underline font-bold hover:text-blue-900" target="_blank" rel="noopener noreferrer">
              Book a Meeting
            </a>
          </p>
        </div>
      </div>
    );
  }

  function renderField(field: FormField) {
    const error = errors[field.id];

    if (field.type === 'text' || field.type === 'email') {
      return (
        <div key={field.id} className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            type={field.type}
            value={(formData[field.id] as string) || ''}
            onChange={e => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400`}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.id} className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            value={(formData[field.id] as string) || ''}
            onChange={e => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400 resize-none`}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      );
    }

    if (field.type === 'radio') {
      return (
        <div key={field.id} className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={option} className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${formData[field.id] === option ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={formData[field.id] === option}
                  onChange={() => handleChange(field.id, option)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      );
    }

    if (field.type === 'checkbox') {
      const selected = (formData[field.id] as string[]) || [];
      return (
        <div key={field.id} className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            {field.label} {field.required && <span className="text-red-500">*</span>}
            <span className="font-normal text-gray-500 text-xs ml-2">(select all that apply)</span>
          </label>
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={option} className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${selected.includes(option) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={e => handleCheckboxChange(field.id, option, e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      );
    }

    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Step {currentStep + 1} of {totalSteps}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Section header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentSection.title}</h2>
        {currentSection.description && (
          <p className="text-gray-600">{currentSection.description}</p>
        )}
      </div>

      {/* Fields */}
      <div>
        {currentSection.fields.map(field => renderField(field))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`px-6 py-3 rounded-lg font-medium transition ${currentStep === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          ← Back
        </button>
        {currentStep < totalSteps - 1 ? (
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Assessment ✓'}
          </button>
        )}
      </div>
    </div>
  );
}
