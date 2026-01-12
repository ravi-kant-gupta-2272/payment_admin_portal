import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';

const TenantPlansTable = ({
  tenants,
  getTenantPlan,
  handleAssignPlan,
  handleEditPlan,
  handleRemovePlan,
  calculateNextBillingDate,
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-[#1a3a52] text-3xl font-semibold mb-2">Tenant Subscriptions</h2>
          <p className="text-gray-600">
             Manage tenant <b>Subscriptions</b> and assign <b>Plans</b> here.
          </p>
        </div>
      </div>

      {tenants.length === 0 ? (
        <div className="text-center py-12 text-gray-600 flex flex-col items-center justify-center w-full">
          <p className="text-lg mb-4">No Tenants found</p>
          <p>Please add tenants first to assign subscriptions</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[1200px]">
                <thead className="bg-[#1a3a52] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Tenant</th>
                    <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Environment</th>
                    <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Subscriptions</th>
                    <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Status</th>
                    {/* <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Start Date</th>
                    <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Next Billing</th> */}
                    <th className="px-6 py-4 text-center font-semibold text-sm tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((tenant) => {
                    const tenantPlanData = getTenantPlan(tenant.id);
                    const hasAssignment = !!tenantPlanData;

                    // Extract enabled subscriptions and subscription data
                    let enabledSubscriptions = [];
                    let subscriptionData = null;
                    
                    if (hasAssignment) {
                      // The data structure from AssignPlanModal includes subscriptions object
                      if (tenantPlanData.subscriptions) {
                        subscriptionData = tenantPlanData;
                        enabledSubscriptions = Object.entries(tenantPlanData.subscriptions)
                          .filter(([_, sub]) => sub.enabled);
                      }
                    }

                    // Determine status based on subscription data
                    const getStatus = () => {
                      if (!subscriptionData) return null;
                      
                      // If status is explicitly set, use it
                      if (subscriptionData.status) {
                        return subscriptionData.status;
                      }
                      
                      // Otherwise, determine based on enabled subscriptions
                      const hasTrial = enabledSubscriptions.some(([freq]) => freq === 'trial');
                      const hasPaidSub = enabledSubscriptions.some(([freq]) => freq !== 'trial');
                      
                      if (hasTrial && !hasPaidSub) {
                        return 'trial';
                      } else if (hasPaidSub) {
                        return 'active';
                      }
                      
                      return 'inactive';
                    };

                    const status = getStatus();
                    // const startDate = subscriptionData?.startDate || new Date().toISOString().split('T')[0];

                    return (
                      <tr key={tenant.id} className="border-b border-gray-200 hover:bg-gray-50">
                        {/* Tenant Name */}
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{tenant.clientId}</div>
                          <div className="text-xs text-gray-500">ID: {tenant.id}</div>
                        </td>

                        {/* Environment */}
                        <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {tenant.environment}
                          </span>
                        </td>

                        {/* Subscriptions */}
                        <td className="px-6 py-4">
                          {hasAssignment && enabledSubscriptions.length > 0 ? (
                            <div className="space-y-2">
                              {enabledSubscriptions.map(([frequency, sub]) => (
                                <div key={frequency} className="flex items-start gap-2">
                                  <FontAwesomeIcon
                                    icon={faCheck}
                                    className="text-green-600 text-xs mt-1 flex-shrink-0"
                                  />
                                  <div className="text-sm">
                                    <div className="font-medium text-gray-900 capitalize">
                                      {frequency}
                                      {frequency === 'trial' && sub.days && (
                                        <span className="text-gray-600 font-normal"> ({sub.days} days)</span>
                                      )}
                                    </div>
                                    <div className="text-gray-700 font-semibold">
                                      ${sub.amount.toFixed(2)}
                                      {frequency !== 'trial' && (
                                        <span className="text-gray-500 font-normal">
                                          /{frequency === 'monthly' ? 'mo' : frequency === 'quarterly' ? 'qtr' : 'yr'}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">No subscription assigned</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {status ? (
                            <span
                              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : status === 'trial'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : status === 'expired'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        {/* Start Date */}
                        {/* <td className="px-6 py-4">
                          {hasAssignment ? (
                            <div className="text-sm text-gray-700">
                              {startDate}
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td> */}

                        {/* Next Billing Date */}
                        {/* <td className="px-6 py-4">
                          {hasAssignment && status === 'active' && enabledSubscriptions.length > 0 ? (
                            <div className="text-sm text-gray-700">
                              {calculateNextBillingDate(
                                startDate,
                                enabledSubscriptions[0][0] // First enabled frequency
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td> */}

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {hasAssignment ? (
                              <>
                                <button
                                  onClick={() => handleEditPlan(tenant, tenantPlanData)}
                                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                  title="Edit Subscription"
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                  onClick={() => handleRemovePlan(
                                    tenantPlanData.id,
                                    tenant.clientId
                                  )}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                  title="Remove Subscription"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleAssignPlan(tenant)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors"
                              >
                                <FontAwesomeIcon icon={faPlus} />
                                Assign Subscription
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">Total Tenants</div>
              <div className="text-3xl font-bold text-[#1a3a52]">{tenants.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">With Subscriptions</div>
              <div className="text-3xl font-bold text-green-600">
                {tenants.filter((t) => !!getTenantPlan(t.id)).length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">Active</div>
              <div className="text-3xl font-bold text-blue-600">
                {tenants.filter((t) => {
                  const plan = getTenantPlan(t.id);
                  return plan && (plan.status === 'active' || 
                    (plan.subscriptions && Object.values(plan.subscriptions).some(s => s.enabled && s.amount > 0)));
                }).length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">Without Subscriptions</div>
              <div className="text-3xl font-bold text-gray-600">
                {tenants.filter((t) => !getTenantPlan(t.id)).length}
              </div>
            </div>
          </div> */}
        </>
      )}
    </>
  );
};

export default TenantPlansTable;