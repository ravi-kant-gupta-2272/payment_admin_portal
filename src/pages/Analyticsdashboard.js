import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faUsers,
  faCheckCircle,
  faTimesCircle,
  faRedoAlt,
  faMoneyBillWave,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';

const AnalyticsDashboard = () => {
  const tenants = useSelector((state) => state.tenants.tenants);
  // const plans = useSelector((state) => state.plans.plans);
  const { subscriptions, payments } = useSelector((state) => state.tenantPlans);
  const [selectedTenant, setSelectedTenant] = useState('all');

  // Filter data based on selected tenant
  const filteredSubscriptions =
    selectedTenant === 'all'
      ? subscriptions
      : subscriptions.filter((s) => s.tenantId === selectedTenant);

  const filteredPayments =
    selectedTenant === 'all'
      ? payments
      : payments.filter((p) => p.tenantId === selectedTenant);

  // Calculate metrics
  const totalSubscriptions = filteredSubscriptions.length;
  const activeSubscriptions = filteredSubscriptions.filter(
    (s) => s.status === 'active'
  ).length;
  const trialSubscriptions = filteredSubscriptions.filter(
    (s) => s.status === 'trial'
  ).length;
  const convertedFromTrial = filteredSubscriptions.filter(
    (s) => s.convertedFromTrial
  ).length;
  const conversionRate =
    trialSubscriptions > 0
      ? ((convertedFromTrial / trialSubscriptions) * 100).toFixed(1)
      : 0;

  const totalPayments = filteredPayments.length;
  const successfulPayments = filteredPayments.filter((p) => p.status === 'success').length;
  const failedPayments = filteredPayments.filter((p) => p.status === 'failed').length;
  const refundedPayments = filteredPayments.filter((p) => p.status === 'refunded').length;
  const successRate =
    totalPayments > 0 ? ((successfulPayments / totalPayments) * 100).toFixed(1) : 0;
  const failureRate =
    totalPayments > 0 ? ((failedPayments / totalPayments) * 100).toFixed(1) : 0;

  const totalRetries = filteredPayments.reduce((sum, p) => sum + (p.retries || 0), 0);
  const avgRetries = totalPayments > 0 ? (totalRetries / totalPayments).toFixed(1) : 0;

  // Revenue calculations
  const totalRevenue = filteredPayments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  const refundedAmount = filteredPayments
    .filter((p) => p.status === 'refunded')
    .reduce((sum, p) => sum + p.amount, 0);

  const netRevenue = totalRevenue - refundedAmount;

  // Monthly recurring revenue (MRR)
  const mrr = filteredSubscriptions
    .filter((s) => s.status === 'active' && s.frequency === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0);

  // Recent payments for table
  const recentPayments = [...filteredPayments]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  // Export data function
  const handleExportData = () => {
    const data = {
      metrics: {
        totalSubscriptions,
        activeSubscriptions,
        trialSubscriptions,
        conversionRate: `${conversionRate}%`,
        totalPayments,
        successfulPayments,
        failedPayments,
        refundedPayments,
        successRate: `${successRate}%`,
        failureRate: `${failureRate}%`,
        totalRetries,
        avgRetries,
        totalRevenue: `$${totalRevenue.toFixed(2)}`,
        refundedAmount: `$${refundedAmount.toFixed(2)}`,
        netRevenue: `$${netRevenue.toFixed(2)}`,
        mrr: `$${mrr.toFixed(2)}`,
      },
      subscriptions: filteredSubscriptions,
      payments: filteredPayments,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${selectedTenant}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-[#1a3a52] text-3xl font-semibold mb-2">Analytics Dashboard</h2>
          <p className="text-gray-600">Monitor subscriptions, payments, and revenue metrics</p>
        </div>
        <button
          onClick={handleExportData}
          className="bg-[#1a3a52] hover:bg-[#2a4a62] text-white px-6 py-3 rounded font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faDownload} />
          Export Data
        </button>
      </div>

      {/* Tenant Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Tenant</label>
        <select
          value={selectedTenant}
          onChange={(e) => setSelectedTenant(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
        >
          <option value="all">All Tenants</option>
          {tenants.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.clientId} - {tenant.environment}
            </option>
          ))}
        </select>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Subscriptions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faUsers} className="text-3xl text-blue-600" />
            <span className="text-sm text-gray-500">Subscriptions</span>
          </div>
          <div className="text-3xl font-bold text-[#1a3a52]">{activeSubscriptions}</div>
          <div className="text-sm text-gray-600 mt-1">
            {totalSubscriptions} total ({trialSubscriptions} on trial)
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faChartLine} className="text-3xl text-green-600" />
            <span className="text-sm text-gray-500">Conversion Rate</span>
          </div>
          <div className="text-3xl font-bold text-[#1a3a52]">{conversionRate}%</div>
          <div className="text-sm text-gray-600 mt-1">
            {convertedFromTrial} converted from trial
          </div>
        </div>

        {/* Payment Success Rate */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faCheckCircle} className="text-3xl text-green-600" />
            <span className="text-sm text-gray-500">Payment Success</span>
          </div>
          <div className="text-3xl font-bold text-[#1a3a52]">{successRate}%</div>
          <div className="text-sm text-gray-600 mt-1">
            {successfulPayments}/{totalPayments} successful
          </div>
        </div>

        {/* Failed Payments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faTimesCircle} className="text-3xl text-red-600" />
            <span className="text-sm text-gray-500">Failed Payments</span>
          </div>
          <div className="text-3xl font-bold text-[#1a3a52]">{failureRate}%</div>
          <div className="text-sm text-gray-600 mt-1">
            {failedPayments} failed, {totalRetries} retries
          </div>
        </div>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faMoneyBillWave} className="text-2xl text-green-600" />
            <span className="text-sm text-gray-500">Total Revenue</span>
          </div>
          <div className="text-2xl font-bold text-[#1a3a52]">${totalRevenue.toFixed(2)}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faRedoAlt} className="text-2xl text-red-600" />
            <span className="text-sm text-gray-500">Refunded</span>
          </div>
          <div className="text-2xl font-bold text-[#1a3a52]">${refundedAmount.toFixed(2)}</div>
          <div className="text-sm text-gray-600 mt-1">{refundedPayments} refunds</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faMoneyBillWave} className="text-2xl text-blue-600" />
            <span className="text-sm text-gray-500">Net Revenue</span>
          </div>
          <div className="text-2xl font-bold text-[#1a3a52]">${netRevenue.toFixed(2)}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faChartLine} className="text-2xl text-purple-600" />
            <span className="text-sm text-gray-500">MRR</span>
          </div>
          <div className="text-2xl font-bold text-[#1a3a52]">${mrr.toFixed(2)}</div>
          <div className="text-sm text-gray-600 mt-1">Monthly Recurring</div>
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-[#1a3a52]">Recent Payments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retries
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.tenantId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          payment.status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : payment.status === 'refunded'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.retries || 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No payment data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;