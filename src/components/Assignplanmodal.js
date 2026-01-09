import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const AssignPlanModal = ({ isOpen, onClose, onAssign, tenant }) => {
  const plans = useSelector((state) => state.plans.plans);
  const activePlans = plans.filter((plan) => plan.isActive);

  const [formData, setFormData] = useState({
    planId: '',
    trialEnabled: false,
    trialDays: 14,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        planId: '',
        trialEnabled: false,
        trialDays: 14,
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.planId) {
      alert('Please select a plan');
      return;
    }
    onAssign({
      tenantId: tenant.id,
      planId: formData.planId,
      trialEnabled: formData.trialEnabled,
      trialDays: formData.trialEnabled ? parseInt(formData.trialDays) : 0,
    });
  };

  const selectedPlan = plans.find((p) => p.id === formData.planId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Modal Header */}
        <div className="bg-[#1a3a52] text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Assign Plan to Tenant</h2>
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
              <span className="font-semibold">Tenant:</span> {tenant?.clientId || 'N/A'}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-semibold">Environment:</span> {tenant?.environment || 'N/A'}
            </p>
          </div>

          <div className="space-y-4">
            {/* Plan Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Plan <span className="text-red-500">*</span>
              </label>
              <select
                name="planId"
                value={formData.planId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
              >
                <option value="">-- Choose a Plan --</option>
                {activePlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - ${plan.amount}/{plan.frequency}
                  </option>
                ))}
              </select>
            </div>

            {/* Plan Details Preview */}
            {selectedPlan && (
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <h4 className="font-semibold text-gray-800 mb-2">{selectedPlan.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{selectedPlan.description}</p>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-lg font-bold text-[#1a3a52]">
                    ${selectedPlan.amount}
                  </span>
                  <span className="text-sm text-gray-600">
                    per {selectedPlan.frequency}
                  </span>
                </div>
                {selectedPlan.features && selectedPlan.features.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Features:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {selectedPlan.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Trial Settings */}
            <div className="border-t pt-4">
              <div className="flex items-center mb-4">
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
                <div className="ml-6">
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
                    Tenant will have access to the plan for {formData.trialDays} days without charges
                  </p>
                </div>
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
              Assign Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignPlanModal;