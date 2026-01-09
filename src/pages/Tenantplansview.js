import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { updateTenantPlan, removeTenantPlan } from '../features/Tenantplanslice/Tenantplanslice';
import { updatePlan } from '../features/Planslice/Planslice';
import AssignPlanModal from './AssignPlanModal';
import EditPlanModal from './EditPlanModal';

const TenantPlansView = () => {
  const dispatch = useDispatch();
  const tenants = useSelector((state) => state.tenants.tenants);
  const plans = useSelector((state) => state.plans.plans);
  const tenantPlans = useSelector((state) => state.tenantPlans.tenantPlans);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [selectedTenantPlan, setSelectedTenantPlan] = useState(null);

  // Get tenant plan mapping
  const getTenantPlanData = (tenantId) => {
    const assignment = tenantPlans.find((tp) => tp.tenantId === tenantId);
    if (assignment) {
      const plan = plans.find((p) => p.id === assignment.planId);
      return { assignment, plan };
    }
    return null;
  };

  // Handle assign plan
  const handleAssignPlan = (tenant) => {
    setSelectedTenant(tenant);
    setIsAssignModalOpen(true);
  };

  // Handle edit plan for tenant
  const handleEditPlan = (tenant, assignment, plan) => {
    setSelectedTenant(tenant);
    setSelectedTenantPlan({ assignment, plan });
    setIsEditPlanModalOpen(true);
  };

  // Handle remove plan from tenant
  const handleRemovePlan = (assignmentId, tenantName) => {
    if (window.confirm(`Are you sure you want to remove the plan from ${tenantName}?`)) {
      dispatch(removeTenantPlan(assignmentId));
    }
  };

  // Calculate next billing date based on frequency
  const calculateNextBillingDate = (startDate, frequency) => {
    const date = new Date(startDate);
    switch (frequency) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        break;
    }
    return date.toISOString().split('T')[0];
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-[#1a3a52] text-3xl font-semibold mb-2">Tenant Plans</h2>
          <p className="text-gray-600">Manage subscription plans for each tenant</p>
        </div>
      </div>

      {tenants.length === 0 ? (
        <div className="text-center py-12 text-gray-600 flex flex-col items-center justify-center w-full">
          <p className="text-lg mb-4">No Tenants found</p>
          <p>Please add tenants first to assign plans</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[1200px]">
              <thead className="bg-[#1a3a52] text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Tenant</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Environment</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Plan Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Amount</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Frequency</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Trial</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Next Billing</th>
                  <th className="px-6 py-4 text-center font-semibold text-sm tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => {
                  const tenantPlanData = getTenantPlanData(tenant.id);
                  const hasAssignment = !!tenantPlanData;

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

                      {/* Plan Name */}
                      <td className="px-6 py-4">
                        {hasAssignment ? (
                          <div className="font-medium text-gray-900">
                            {tenantPlanData.plan?.name || 'Unknown Plan'}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">No plan assigned</span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4">
                        {hasAssignment ? (
                          <div className="font-bold text-[#1a3a52]">
                            ${tenantPlanData.plan?.amount?.toFixed(2) || '0.00'}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Frequency */}
                      <td className="px-6 py-4">
                        {hasAssignment ? (
                          <span className="capitalize text-gray-700">
                            {tenantPlanData.plan?.frequency || 'N/A'}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {hasAssignment ? (
                          <span
                            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                              tenantPlanData.assignment.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : tenantPlanData.assignment.status === 'trial'
                                ? 'bg-yellow-100 text-yellow-800'
                                : tenantPlanData.assignment.status === 'expired'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {tenantPlanData.assignment.status}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Trial Info */}
                      <td className="px-6 py-4">
                        {hasAssignment && tenantPlanData.assignment.trialEnabled ? (
                          <div>
                            <div className="flex items-center gap-1 text-sm">
                              <FontAwesomeIcon icon={faCheck} className="text-green-600" />
                              <span className="text-gray-700">{tenantPlanData.assignment.trialDays} days</span>
                            </div>
                            {tenantPlanData.assignment.trialEndDate && (
                              <div className="text-xs text-gray-500 mt-1">
                                Ends: {tenantPlanData.assignment.trialEndDate}
                              </div>
                            )}
                          </div>
                        ) : hasAssignment ? (
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <FontAwesomeIcon icon={faTimes} />
                            <span>No trial</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Next Billing Date */}
                      <td className="px-6 py-4">
                        {hasAssignment && tenantPlanData.assignment.status === 'active' ? (
                          <div className="text-sm text-gray-700">
                            {calculateNextBillingDate(
                              tenantPlanData.assignment.startDate,
                              tenantPlanData.plan?.frequency
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {hasAssignment ? (
                            <>
                              <button
                                onClick={() =>
                                  handleEditPlan(tenant, tenantPlanData.assignment, tenantPlanData.plan)
                                }
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                title="Edit Plan"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                onClick={() =>
                                  handleRemovePlan(tenantPlanData.assignment.id, tenant.clientId)
                                }
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                title="Remove Plan"
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
                              Assign Plan
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
      )}

      {/* Summary Cards */}
      {tenants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Total Tenants</div>
            <div className="text-3xl font-bold text-[#1a3a52]">{tenants.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Plans Assigned</div>
            <div className="text-3xl font-bold text-green-600">{tenantPlans.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Active Subscriptions</div>
            <div className="text-3xl font-bold text-blue-600">
              {tenantPlans.filter((tp) => tp.status === 'active').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Trial Periods</div>
            <div className="text-3xl font-bold text-yellow-600">
              {tenantPlans.filter((tp) => tp.status === 'trial').length}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AssignPlanModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedTenant(null);
        }}
        onAssign={(data) => {
          // Handle in parent Dashboard component
          setIsAssignModalOpen(false);
          setSelectedTenant(null);
        }}
        tenant={selectedTenant}
      />

      <EditPlanModal
        isOpen={isEditPlanModalOpen}
        onClose={() => {
          setIsEditPlanModalOpen(false);
          setSelectedTenant(null);
          setSelectedTenantPlan(null);
        }}
        onSave={(data) => {
          // Handle in parent Dashboard component
          setIsEditPlanModalOpen(false);
          setSelectedTenant(null);
          setSelectedTenantPlan(null);
        }}
        tenant={selectedTenant}
        tenantPlan={selectedTenantPlan}
      />
    </>
  );
};

export default TenantPlansView;