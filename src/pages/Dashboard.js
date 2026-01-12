import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { faUser, faGear, faArrowRightFromBracket, faTags, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { logoutUser } from '../features/Authslice/AuthSlice';
import { addTenant, updateTenant, deleteTenant, toggleTenantStatus } from '../features/Tenantslice/Tenantslice';
import { assignPlanToTenant, removeTenantPlan } from '../features/Tenantplanslice/Tenantplanslice';
import TenantModal from '../components/TenantModal';
import AssignPlanModal from '../components/Assignplanmodal';
import SideBar from '../components/SideBar';
import TenantTableRow from '../components/TenantTableRow';
import LogoutModal from '../components/LogoutModal';
import AnalyticsDashboard from '../pages/Analyticsdashboard';
import { useNavigate } from 'react-router-dom';
import TenantPlansTable from '../components/TenantPlansTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAssignPlanModalOpen, setIsAssignPlanModalOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('Tenants');

  const sidebarItems = [
    { icon: faUser, label: 'Tenants' },
    { icon: faTags, label: 'Plans' },
    { icon: faChartBar, label: 'Analytics' },
    { icon: faGear, label: 'Settings' },
    { icon: faArrowRightFromBracket, label: 'Logout' },
  ];

  // Read from Redux store using useSelector
  const user = useSelector((state) => state.auth.currentUser);
  const tenants = useSelector((state) => state.tenants.tenants);
  const tenantPlans = useSelector((state) => state.tenantPlans.tenantPlans);

  // Handle Add Tenant - Open modal
  const handleAddTenant = () => {
    setSelectedTenant(null);
    setIsTenantModalOpen(true);
  };

  // Handle Edit Tenant - Open modal with selected tenant
  const handleEditTenant = (tenant) => {
    setSelectedTenant(tenant);
    setIsTenantModalOpen(true);
  };

  // Save tenant (Add or Update)
  const handleSaveTenant = (formData) => {
    if (selectedTenant) {
      dispatch(updateTenant({ id: selectedTenant.id, data: formData }));
    } else {
      dispatch(addTenant(formData));
    }
    setIsTenantModalOpen(false);
    setSelectedTenant(null);
  };

  // Delete tenant
  const handleDeleteTenant = (tenantId) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      dispatch(deleteTenant(tenantId));
    }
  };

  // Toggle tenant status
  const handleToggleStatus = (tenantId) => {
    dispatch(toggleTenantStatus(tenantId));
  };

  // Handle Assign Plan to Tenant
  const handleAssignPlan = (tenant) => {
    setSelectedTenant(tenant);
    setIsAssignPlanModalOpen(true);
  };

  // Save plan assignment
  const handleSaveAssignPlan = (data) => {
    dispatch(assignPlanToTenant(data));
    setIsAssignPlanModalOpen(false);
    setSelectedTenant(null);
    alert(data.id ? 'Subscription updated successfully!' : 'Subscription assigned successfully!');
  };

  // Handle Edit Plan - open modal with existing plan data
  const handleEditPlan = (tenant, planData) => {
    setSelectedTenant({ ...tenant, existingPlan: planData });
    setIsAssignPlanModalOpen(true);
  };

  // Handle Remove Plan
  const handleRemovePlan = (assignmentId, tenantName) => {
    if (window.confirm(`Are you sure you want to remove the plan from ${tenantName}?`)) {
      dispatch(removeTenantPlan(assignmentId));
    }
  };

  // Get plan details for a tenant
  const getTenantPlan = (tenantId) => {
    const assignment = tenantPlans.find((tp) => tp.tenantId === tenantId);
    if (assignment) {
      return assignment;
    }
    return null;
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  // Calculate next billing date
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

  // Render content based on active menu item
  const renderContent = () => {
    switch (activeMenuItem) {
      case 'Tenants':
        return (
          <>
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h2 className="text-[#1a3a52] text-3xl font-semibold">Tenants</h2>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={handleAddTenant}
              >
                + Add New Tenant
              </button>
            </div>

            {/* Tenant Table or Empty State */}
            {tenants.length === 0 ? (
              <div className="text-center py-12 text-gray-600 flex flex-col items-center justify-center w-full">
                <p className="text-lg mb-4">No Tenants found</p>
                <p>Click "Add New Tenant" to create your first tenant</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg overflow-hidden w-full shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full h-full border-collapse min-w-[1000px]">
                    <thead className="bg-[#1a3a52] text-white">
                      <tr>
                        <th className="px-4 py-4 text-left font-semibold text-sm tracking-wide">Client ID</th>
                        <th className="px-4 py-4 text-left font-semibold text-sm tracking-wide">Client Version</th>
                        <th className="px-4 py-4 text-left font-semibold text-sm tracking-wide">Client Secret</th>
                        <th className="px-4 py-4 text-left font-semibold text-sm tracking-wide">Environment</th>
                        <th className="px-4 py-4 text-left font-semibold text-sm tracking-wide">Webhook Username</th>
                        <th className="px-4 py-4 text-left font-semibold text-sm tracking-wide">Webhook Password</th>
                        <th className="px-4 py-4 text-left font-semibold text-sm tracking-wide">Callback URL</th>
                        <th className="px-4 py-4 text-left font-semibold text-sm tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tenants.map((tenant) => (
                        <TenantTableRow
                          key={tenant.id}
                          tenant={tenant}
                          onEdit={handleEditTenant}
                          onToggleStatus={handleToggleStatus}
                          onDelete={handleDeleteTenant}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        );

      case 'Plans':
        return (
          <TenantPlansTable
            tenants={tenants}
            getTenantPlan={getTenantPlan}
            handleAssignPlan={handleAssignPlan}
            handleEditPlan={handleEditPlan}
            handleRemovePlan={handleRemovePlan}
            calculateNextBillingDate={calculateNextBillingDate}
          />
        );

      case 'Analytics':
        return <AnalyticsDashboard />;

      case 'Settings':
        return (
          <>
            <div className="mb-8">
              <h2 className="text-[#1a3a52] text-3xl font-semibold mb-2">Settings</h2>
              <p className="text-gray-600">Manage your account and application preferences</p>
            </div>

            <div className="space-y-6">
              {/* Profile Settings */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-[#1a3a52] mb-4">Profile Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                    />
                  </div>
                </div>
                <button className="mt-6 bg-[#1a3a52] hover:bg-[#2a4a62] text-white px-6 py-2 rounded transition-colors duration-300">
                  Save Changes
                </button>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-[#1a3a52] mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                    />
                  </div>
                </div>
                <button className="mt-6 bg-[#1a3a52] hover:bg-[#2a4a62] text-white px-6 py-2 rounded transition-colors duration-300">
                  Update Password
                </button>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-[#1a3a52] text-white px-8 py-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-semibold tracking-wide">Tenant Management System</h1>
          <div className="flex gap-4 items-center">
            <span className="text-[#d4af37] text-base italic">Welcome, {user?.name}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full mx-auto px-8 py-8">
        {/* Sidebar and Content Container */}
        <div className="flex flex-row gap-6">
          {/* Sidebar */}
          <SideBar
            items={sidebarItems}
            onSelectItem={(item) => {
              if (item.label === 'Logout') {
                setIsLogoutModalOpen(true);
                return;
              }
              setActiveMenuItem(item.label);
            }}
            activeItem={activeMenuItem}
          />

          {/* Main Content Area */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      </main>

      {/* Modals */}
      <TenantModal
        isOpen={isTenantModalOpen}
        onClose={() => {
          setIsTenantModalOpen(false);
          setSelectedTenant(null);
        }}
        onSave={handleSaveTenant}
        tenant={selectedTenant}
      />

      <AssignPlanModal
        isOpen={isAssignPlanModalOpen}
        onClose={() => {
          setIsAssignPlanModalOpen(false);
          setSelectedTenant(null);
        }}
        onAssign={handleSaveAssignPlan}
        tenant={selectedTenant}
        existingPlan={selectedTenant?.existingPlan}
      />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}

export default Dashboard;

