import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const PlanModal = ({ isOpen, onClose, onSave, plan = null }) => {
  const isEditMode = !!plan;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: [],
    pricing: {
      trial: {
        enabled: false,
        days: 14,
        amount: 0,
      },
      monthly: {
        enabled: false,
        amount: 0,
      },
      quarterly: {
        enabled: false,
        amount: 0,
      },
      yearly: {
        enabled: false,
        amount: 0,
      },
    },
  });

  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (plan) {
        // Edit mode - populate with existing plan data
        setFormData({
          name: plan.name || '',
          description: plan.description || '',
          features: plan.features || [],
          pricing: plan.pricing || {
            trial: { enabled: false, days: 14, amount: 0 },
            monthly: { enabled: false, amount: 0 },
            quarterly: { enabled: false, amount: 0 },
            yearly: { enabled: false, amount: 0 },
          },
        });
      } else {
        // Create mode - reset to defaults
        setFormData({
          name: '',
          description: '',
          features: [],
          pricing: {
            trial: { enabled: false, days: 14, amount: 0 },
            monthly: { enabled: false, amount: 0 },
            quarterly: { enabled: false, amount: 0 },
            yearly: { enabled: false, amount: 0 },
          },
        });
      }
      setFeatureInput('');
    }
  }, [isOpen, plan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePricingToggle = (frequency) => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [frequency]: {
          ...prev.pricing[frequency],
          enabled: !prev.pricing[frequency].enabled,
        },
      },
    }));
  };

  const handlePricingChange = (frequency, field, value) => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [frequency]: {
          ...prev.pricing[frequency],
          [field]: value,
        },
      },
    }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter a plan name');
      return;
    }

    // Check if at least one pricing option is enabled
    const hasEnabledPricing = Object.values(formData.pricing).some((p) => p.enabled);

    if (!hasEnabledPricing) {
      alert('Please enable at least one billing frequency');
      return;
    }

    // Validate enabled pricing options
    for (const [key, pricing] of Object.entries(formData.pricing)) {
      if (pricing.enabled) {
        if (key === 'trial') {
          if (!pricing.days || pricing.days < 1) {
            alert('Please enter valid trial days');
            return;
          }
        }
        if (pricing.amount === '' || parseFloat(pricing.amount) < 0) {
          alert(`Please enter a valid amount for ${key}`);
          return;
        }
      }
    }

    const planData = {
      name: formData.name,
      description: formData.description,
      features: formData.features,
      pricing: Object.fromEntries(
        Object.entries(formData.pricing).map(([key, pricing]) => [
          key,
          {
            ...pricing,
            amount: pricing.enabled ? parseFloat(pricing.amount) : 0,
            days: key === 'trial' && pricing.enabled ? parseInt(pricing.days) : pricing.days,
          },
        ])
      ),
    };

    if (isEditMode) {
      onSave({ ...planData, id: plan.id });
    } else {
      onSave(planData);
    }
  };

  const frequencyLabels = {
    trial: 'Trial Period',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-[#1a3a52] text-white px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-semibold">
            {isEditMode ? 'Edit Plan' : 'Create New Plan'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Plan Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Basic Plan, Premium Plan"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the plan"
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
              />
            </div>

            {/* Billing Frequencies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Billing Frequencies <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-4">
                Enable and set pricing for one or more billing frequencies
              </p>

              <div className="space-y-4">
                {/* Trial */}
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="pricing-trial"
                      checked={formData.pricing.trial.enabled}
                      onChange={() => handlePricingToggle('trial')}
                      className="w-5 h-5 text-[#1a3a52] focus:ring-[#1a3a52] border-gray-300 rounded"
                    />
                    <label htmlFor="pricing-trial" className="ml-3 text-sm font-semibold text-gray-900">
                      {frequencyLabels.trial}
                    </label>
                  </div>

                  {formData.pricing.trial.enabled && (
                    <div className="ml-8 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Trial Days <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.pricing.trial.days}
                          onChange={(e) =>
                            handlePricingChange('trial', 'days', e.target.value)
                          }
                          min="1"
                          max="365"
                          required={formData.pricing.trial.enabled}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Amount ($) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.pricing.trial.amount}
                          onChange={(e) =>
                            handlePricingChange('trial', 'amount', e.target.value)
                          }
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          required={formData.pricing.trial.enabled}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                        />
                        <p className="text-xs text-gray-500 mt-1">Usually $0 for free trials</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Monthly */}
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="pricing-monthly"
                      checked={formData.pricing.monthly.enabled}
                      onChange={() => handlePricingToggle('monthly')}
                      className="w-5 h-5 text-[#1a3a52] focus:ring-[#1a3a52] border-gray-300 rounded"
                    />
                    <label htmlFor="pricing-monthly" className="ml-3 text-sm font-semibold text-gray-900">
                      {frequencyLabels.monthly}
                    </label>
                  </div>

                  {formData.pricing.monthly.enabled && (
                    <div className="ml-8">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Amount ($) per month <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.pricing.monthly.amount}
                        onChange={(e) =>
                          handlePricingChange('monthly', 'amount', e.target.value)
                        }
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        required={formData.pricing.monthly.enabled}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                      />
                    </div>
                  )}
                </div>

                {/* Quarterly */}
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="pricing-quarterly"
                      checked={formData.pricing.quarterly.enabled}
                      onChange={() => handlePricingToggle('quarterly')}
                      className="w-5 h-5 text-[#1a3a52] focus:ring-[#1a3a52] border-gray-300 rounded"
                    />
                    <label htmlFor="pricing-quarterly" className="ml-3 text-sm font-semibold text-gray-900">
                      {frequencyLabels.quarterly}
                    </label>
                  </div>

                  {formData.pricing.quarterly.enabled && (
                    <div className="ml-8">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Amount ($) per quarter <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.pricing.quarterly.amount}
                        onChange={(e) =>
                          handlePricingChange('quarterly', 'amount', e.target.value)
                        }
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        required={formData.pricing.quarterly.enabled}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                      />
                    </div>
                  )}
                </div>

                {/* Yearly */}
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="pricing-yearly"
                      checked={formData.pricing.yearly.enabled}
                      onChange={() => handlePricingToggle('yearly')}
                      className="w-5 h-5 text-[#1a3a52] focus:ring-[#1a3a52] border-gray-300 rounded"
                    />
                    <label htmlFor="pricing-yearly" className="ml-3 text-sm font-semibold text-gray-900">
                      {frequencyLabels.yearly}
                    </label>
                  </div>

                  {formData.pricing.yearly.enabled && (
                    <div className="ml-8">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Amount ($) per year <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.pricing.yearly.amount}
                        onChange={(e) =>
                          handlePricingChange('yearly', 'amount', e.target.value)
                        }
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        required={formData.pricing.yearly.enabled}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder="Add a feature"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>

              {formData.features.length > 0 && (
                <ul className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded border border-gray-200"
                    >
                      <span className="text-sm text-gray-700">{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              {isEditMode ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanModal;