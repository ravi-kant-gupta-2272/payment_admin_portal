import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faToggleOn, faToggleOff, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const PlansTable = ({ plans, onEdit, onDelete, onToggleStatus }) => {
  const getEnabledSubscriptions = (subscriptions) => {
    return Object.entries(subscriptions)
      .filter(([_, sub]) => sub.enabled)
      .map(([frequency, sub]) => ({
        frequency,
        ...sub,
      }));
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const getFrequencyLabel = (frequency) => {
    const labels = {
      trial: 'Trial',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      yearly: 'Yearly',
    };
    return labels[frequency] || frequency;
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[1000px]">
          <thead className="bg-[#1a3a52] text-white">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Plan Name</th>
              <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Description</th>
              <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Subscriptions</th>
              <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Features</th>
              <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Status</th>
              <th className="px-6 py-4 text-center font-semibold text-sm tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => {
              const enabledSubs = getEnabledSubscriptions(plan.subscriptions);

              return (
                <tr key={plan.id} className="border-b border-gray-200 hover:bg-gray-50">
                  {/* Plan Name */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{plan.name}</div>
                    <div className="text-xs text-gray-500">Created: {plan.createdAt}</div>
                  </td>

                  {/* Description */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 max-w-xs">
                      {plan.description}
                    </div>
                  </td>

                  {/* Subscriptions */}
                  <td className="px-6 py-4">
                    {enabledSubs.length > 0 ? (
                      <div className="space-y-2">
                        {enabledSubs.map((sub) => (
                          <div key={sub.frequency} className="flex items-start gap-2">
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="text-green-600 text-xs mt-1 flex-shrink-0"
                            />
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">
                                {getFrequencyLabel(sub.frequency)}
                                {sub.frequency === 'trial' && sub.days && (
                                  <span className="text-gray-600 font-normal">
                                    {' '}({sub.days} days)
                                  </span>
                                )}
                              </div>
                              <div className="text-gray-700 font-semibold">
                                {formatCurrency(sub.amount)}
                                {sub.frequency !== 'trial' && (
                                  <span className="text-gray-500 font-normal">
                                    /
                                    {sub.frequency === 'monthly'
                                      ? 'mo'
                                      : sub.frequency === 'quarterly'
                                      ? 'qtr'
                                      : 'yr'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No subscriptions</span>
                    )}
                  </td>

                  {/* Features */}
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {plan.features && plan.features.length > 0 ? (
                        <ul className="space-y-1">
                          {plan.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-600 mt-0.5">✓</span>
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                          {plan.features.length > 3 && (
                            <li className="text-gray-500 text-xs italic">
                              +{plan.features.length - 3} more
                            </li>
                          )}
                        </ul>
                      ) : (
                        <span className="text-gray-400 italic">No features</span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onToggleStatus(plan.id)}
                      className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                        plan.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                      title={`Click to ${plan.isActive ? 'deactivate' : 'activate'}`}
                    >
                      <FontAwesomeIcon
                        icon={plan.isActive ? faToggleOn : faToggleOff}
                        className={plan.isActive ? 'text-green-600' : 'text-gray-500'}
                      />
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(plan)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        title="Edit Plan"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => onDelete(plan.id, plan.name)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title="Delete Plan"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlansTable;