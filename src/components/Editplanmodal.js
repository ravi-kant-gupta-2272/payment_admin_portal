import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const EditPlanModal = ({ isOpen, onClose, onSave, tenant, tenantPlan }) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    frequency: 'monthly',
    trialEnabled: false,
    trialDays: 14,
    status: 'active',
  });

  useEffect(() => {
    if (tenantPlan && isOpen) {
      setFormData({
        name: tenantPlan.plan?.name || '',
        amount: tenantPlan.plan?.amount || '',
        frequency: tenantPlan.plan?.frequency || 'monthly',
        trialEnabled: tenantPlan.assignment?.trialEnabled || false,
        trialDays: tenantPlan.assignment?.trialDays || 14,
        status: tenantPlan.assignment?.status || 'active',
      });
    }
  }, [tenantPlan, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      assignmentId: tenantPlan.assignment.id,
      planId: tenantPlan.plan.id,
      planData: {
        name: formData.name,
        amount: parseFloat(formData.amount),
        frequency: formData.frequency,
      },
      assignmentData: {
        trialEnabled: formData.trialEnabled,
        trialDays: formData.trialEnabled ? parseInt(formData.trialDays) : 0,
        status: formData.status,
      },
    });
  };

  if (!isOpen || !tenantPlan) return null;

  // Calculate subscription details
  const calculateSubscriptionDetails = () => {
    const amount = parseFloat(formData.amount) || 0;
    const frequency = formData.frequency;

    let perDay = 0;
    let perMonth = 0;
    let perYear = 0;

    switch (frequency) {
      case 'daily':
        perDay = amount;
        perMonth = amount * 30;
        perYear = amount * 365;
        break;
      case 'weekly':
        perDay = amount / 7;
        perMonth = (amount * 52) / 12;
        perYear = amount * 52;
        break;
      case 'monthly':
        perDay = amount / 30;
        perMonth = amount;
        perYear = amount * 12;
        break;
      case 'quarterly':
        perDay = amount / 90;
        perMonth = amount / 3;
        perYear = amount * 4;
        break;
      case 'yearly':
        perDay = amount / 365;
        perMonth = amount / 12;
        perYear = amount;
        break;
      default:
        break;
    }

    return { perDay, perMonth, perYear };
  };

  const subscriptionDetails = calculateSubscriptionDetails();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-[#1a3a52] text-white px-6 py-4 flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-semibold">Edit Plan for {tenant?.clientId}</h2>
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Tenant ID</p>
                <p className="font-semibold text-gray-900">{tenant?.clientId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Environment</p>
                <p className="font-semibold text-gray-900">{tenant?.environment}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Plan Details Section */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-[#1a3a52] mb-4">Plan Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Plan Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Premium Plan, Enterprise Plan"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    placeholder="99.99"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                  />
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Billing Frequency <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              {/* Subscription Calculation Preview */}
              {formData.amount > 0 && (
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Subscription Calculation Preview
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Per Day</p>
                      <p className="font-bold text-[#1a3a52]">
                        ${subscriptionDetails.perDay.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Per Month</p>
                      <p className="font-bold text-[#1a3a52]">
                        ${subscriptionDetails.perMonth.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Per Year</p>
                      <p className="font-bold text-[#1a3a52]">
                        ${subscriptionDetails.perYear.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    The tenant will be charged <span className="font-semibold">${formData.amount}</span> every{' '}
                    <span className="font-semibold">{formData.frequency}</span> period
                  </p>
                </div>
              )}
            </div>

            {/* Subscription Status */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-[#1a3a52] mb-4">Subscription Status</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                >
                  <option value="trial">Trial</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Change the subscription status for this tenant
                </p>
              </div>
            </div>

            {/* Trial Settings */}
            <div>
              <h3 className="text-lg font-semibold text-[#1a3a52] mb-4">Trial Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="trialEnabled"
                    name="trialEnabled"
                    checked={formData.trialEnabled}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#1a3a52] focus:ring-[#1a3a52] border-gray-300 rounded"
                  />
                  <label htmlFor="trialEnabled" className="ml-2 text-sm font-medium text-gray-700">
                    Enable Trial Period
                  </label>
                </div>

                {formData.trialEnabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trial Duration (Days) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="trialDays"
                      value={formData.trialDays}
                      onChange={handleChange}
                      min="1"
                      max="365"
                      required={formData.trialEnabled}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      During trial, no charges will be applied. After {formData.trialDays} days, regular billing
                      will commence.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#1a3a52] text-white rounded hover:bg-[#2a4a62] transition-colors font-medium"
            >
              Update Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlanModal;