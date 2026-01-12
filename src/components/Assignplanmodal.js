import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const AssignPlanModal = ({ isOpen, onClose, onAssign, tenant, existingPlan }) => {
  const [formData, setFormData] = useState({
    subscriptions: {
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

  useEffect(() => {
    if (isOpen) {
      // If editing existing plan, populate form with existing data
      if (existingPlan && existingPlan.subscriptions) {
        setFormData({
          subscriptions: {
            trial: existingPlan.subscriptions.trial || { enabled: false, days: 14, amount: 0 },
            monthly: existingPlan.subscriptions.monthly || { enabled: false, amount: 0 },
            quarterly: existingPlan.subscriptions.quarterly || { enabled: false, amount: 0 },
            yearly: existingPlan.subscriptions.yearly || { enabled: false, amount: 0 },
          },
        });
      } else {
        // Reset form for new assignment
        setFormData({
          subscriptions: {
            trial: { enabled: false, days: 14, amount: 0 },
            monthly: { enabled: false, amount: 0 },
            quarterly: { enabled: false, amount: 0 },
            yearly: { enabled: false, amount: 0 },
          },
        });
      }
    }
  }, [isOpen, existingPlan]);

  const handleToggle = (frequency) => {
    setFormData((prev) => ({
      ...prev,
      subscriptions: {
        ...prev.subscriptions,
        [frequency]: {
          ...prev.subscriptions[frequency],
          enabled: !prev.subscriptions[frequency].enabled,
        },
      },
    }));
  };

  const handleChange = (frequency, field, value) => {
    setFormData((prev) => ({
      ...prev,
      subscriptions: {
        ...prev.subscriptions,
        [frequency]: {
          ...prev.subscriptions[frequency],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if at least one subscription is enabled
    const hasEnabledSubscription = Object.values(formData.subscriptions).some(
      (sub) => sub.enabled
    );

    if (!hasEnabledSubscription) {
      alert('Please select at least one billing frequency');
      return;
    }

    // Validate enabled subscriptions
    for (const [key, sub] of Object.entries(formData.subscriptions)) {
      if (sub.enabled) {
        if (key === 'trial') {
          if (!sub.days || sub.days < 1) {
            alert('Please enter valid trial days');
            return;
          }
        }
        if (sub.amount === '' || parseFloat(sub.amount) < 0) {
          alert(`Please enter a valid amount for ${key}`);
          return;
        }
      }
    }

    // Determine status based on enabled subscriptions
    const hasTrial = formData.subscriptions.trial.enabled;
    const hasPaidSubscription = ['monthly', 'quarterly', 'yearly'].some(
      (freq) => formData.subscriptions[freq].enabled
    );
    
    let status = 'active';
    if (hasTrial && !hasPaidSubscription) {
      status = 'trial';
    } else if (hasPaidSubscription) {
      status = 'active';
    }

    // Prepare data to save
    const dataToSave = {
      tenantId: tenant.id,
      subscriptions: Object.fromEntries(
        Object.entries(formData.subscriptions).map(([key, sub]) => [
          key,
          {
            ...sub,
            amount: sub.enabled ? parseFloat(sub.amount) : 0,
            days: key === 'trial' && sub.enabled ? parseInt(sub.days) : sub.days,
          },
        ])
      ),
      status: status,
      startDate: existingPlan?.startDate || new Date().toISOString().split('T')[0],
    };

    // If editing, include the existing ID
    if (existingPlan && existingPlan.id) {
      dataToSave.id = existingPlan.id;
    }

    onAssign(dataToSave);
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
            {existingPlan ? 'Edit Subscription' : 'Assign Subscription'} for Tenant
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
          {/* Tenant Info */}
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Tenant:</span> {tenant?.name || 'N/A'}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-semibold">Environment:</span> {tenant?.environment || 'N/A'}
            </p>
          </div>

          <div className="space-y-6">
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
                      id="sub-trial"
                      checked={formData.subscriptions.trial.enabled}
                      onChange={() => handleToggle('trial')}
                      className="w-5 h-5 text-[#1a3a52] focus:ring-[#1a3a52] border-gray-300 rounded"
                    />
                    <label htmlFor="sub-trial" className="ml-3 text-sm font-semibold text-gray-900">
                      {frequencyLabels.trial}
                    </label>
                  </div>

                  {formData.subscriptions.trial.enabled && (
                    <div className="ml-8 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Trial Days <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.subscriptions.trial.days}
                          onChange={(e) => handleChange('trial', 'days', e.target.value)}
                          min="1"
                          max="365"
                          required={formData.subscriptions.trial.enabled}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Amount ($) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.subscriptions.trial.amount}
                          onChange={(e) => handleChange('trial', 'amount', e.target.value)}
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          required={formData.subscriptions.trial.enabled}
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
                      id="sub-monthly"
                      checked={formData.subscriptions.monthly.enabled}
                      onChange={() => handleToggle('monthly')}
                      className="w-5 h-5 text-[#1a3a52] focus:ring-[#1a3a52] border-gray-300 rounded"
                    />
                    <label htmlFor="sub-monthly" className="ml-3 text-sm font-semibold text-gray-900">
                      {frequencyLabels.monthly}
                    </label>
                  </div>

                  {formData.subscriptions.monthly.enabled && (
                    <div className="ml-8">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Amount ($) per month <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.subscriptions.monthly.amount}
                        onChange={(e) => handleChange('monthly', 'amount', e.target.value)}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        required={formData.subscriptions.monthly.enabled}
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
                      id="sub-quarterly"
                      checked={formData.subscriptions.quarterly.enabled}
                      onChange={() => handleToggle('quarterly')}
                      className="w-5 h-5 text-[#1a3a52] focus:ring-[#1a3a52] border-gray-300 rounded"
                    />
                    <label htmlFor="sub-quarterly" className="ml-3 text-sm font-semibold text-gray-900">
                      {frequencyLabels.quarterly}
                    </label>
                  </div>

                  {formData.subscriptions.quarterly.enabled && (
                    <div className="ml-8">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Amount ($) per quarter <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.subscriptions.quarterly.amount}
                        onChange={(e) => handleChange('quarterly', 'amount', e.target.value)}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        required={formData.subscriptions.quarterly.enabled}
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
                      id="sub-yearly"
                      checked={formData.subscriptions.yearly.enabled}
                      onChange={() => handleToggle('yearly')}
                      className="w-5 h-5 text-[#1a3a52] focus:ring-[#1a3a52] border-gray-300 rounded"
                    />
                    <label htmlFor="sub-yearly" className="ml-3 text-sm font-semibold text-gray-900">
                      {frequencyLabels.yearly}
                    </label>
                  </div>

                  {formData.subscriptions.yearly.enabled && (
                    <div className="ml-8">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Amount ($) per year <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.subscriptions.yearly.amount}
                        onChange={(e) => handleChange('yearly', 'amount', e.target.value)}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        required={formData.subscriptions.yearly.enabled}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                      />
                    </div>
                  )}
                </div>
              </div>
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
              {existingPlan ? 'Update Subscription' : 'Assign Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignPlanModal;