// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { faUser, faGear, faArrowRightFromBracket, faTags } from '@fortawesome/free-solid-svg-icons'
// import { logoutUser } from '../features/Authslice/AuthSlice';
// import { addTenant, updateTenant, deleteTenant, toggleTenantStatus } from '../features/Tenantslice/Tenantslice';
// import TenantModal from '../components/TenantModal';
// import SideBar from '../components/SideBar';
// import TenantTableRow from '../components/TenantTableRow';
// import LogoutModal from '../components/LogoutModal';
// import { useNavigate } from 'react-router-dom';

// function Dashboards() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [selectedTenant, setSelectedTenant] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeMenuItem, setActiveMenuItem] = useState('Tenants');
//   const sidebarItems = [
//     { icon: faUser, label: 'Tenants' },
//     { icon: faTags, label: 'Plans' },
//     { icon: faGear, label: 'Settings' },
//     { icon: faArrowRightFromBracket, label: 'Logout' },
//   ];

//   // Read from Redux store using useSelector
//   const user = useSelector((state) => state.auth.currentUser);
//   const tenants = useSelector((state) => state.tenants.tenants);

//   // Handle Add Tenant - Open modal
//   const handleAddTenant = () => {
//     setSelectedTenant(null);
//     setIsModalOpen(true);
//     console.log("Add Tenant Clicked");
//   };

//   // Handle Edit Tenant - Open modal with selected tenant
//   const handleEditTenant = (tenant) => {
//     setSelectedTenant(tenant);
//     setIsModalOpen(true);
//   };

//   // Save tenant (Add or Update)
//   const handleSaveTenant = (formData) => {
//     if (selectedTenant) {
//       dispatch(updateTenant({ id: selectedTenant.id, data: formData }));
//     } else {
//       dispatch(addTenant(formData));
//     }
//     setIsModalOpen(false);
//     setSelectedTenant(null);
//   };

//   // Delete tenant
//   const handleDeleteTenant = (tenantId) => {
//     if (window.confirm('Are you sure you want to delete this tenant?')) {
//       dispatch(deleteTenant(tenantId));
//     }
//   };

//   // Toggle tenant status
//   const handleToggleStatus = (tenantId) => {
//     dispatch(toggleTenantStatus(tenantId));
//   };

//   // Logout
//   const handleLogout = () => {
//     dispatch(logoutUser());
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       {/* Header */}
//       <header className="bg-[#1a3a52] text-white px-8 py-6 shadow-lg">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
//           <h1 className="text-3xl font-semibold tracking-wide">Tenant Management System</h1>
//           <div className="flex gap-4 items-center">
//             <span className="text-[#d4af37] text-base italic">Welcome, {user?.name}</span>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1 w-full mx-auto px-8 py-8">
//         {/* Dashboard Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <h2 className="text-[#1a3a52] text-3xl font-semibold">{(activeMenuItem !== "Logout")&&activeMenuItem}</h2>
//           <button
//             className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-medium transition-all duration-300 shadow-md hover:shadow-lg"
//             onClick={handleAddTenant}
//           >
//             + Add New Tenant
//           </button>
//         </div>

//         {/* Sidebar and Table Container */}
//         <div className="flex flex-row justify-between items-start min-h-screen gap-4">
//           {/* Sidebar */}
//           <SideBar 
//             items={sidebarItems} 
//             onSelectItem={(item) => {
//               setActiveMenuItem(item.label);
//               // your other logic
//             }}
//             activeItem={activeMenuItem}
//           />
//           {/* Tenant Table or Empty State */}
//           {tenants.length === 0 ? (
//             <div className="text-center py-12 text-gray-600 flex flex-col items-center justify-center w-full">
//               <p className="text-lg mb-4">No {activeMenuItem !== "Logout" && activeMenuItem} found</p>
//               <p>Click "Add New Tenant" to create your first tenant</p>
//             </div>
//           ) : (
//             <div className="bg-white rounded-lg overflow-hidden w-[90%]">
//               <div className="overflow-x-auto">

//                 <table className="w-full h-full border-collapse min-w-[1000px]">
//                   <thead className="bg-[#1a3a52] text-white">
//                     <tr>
//                       <th className="px-4 py-4 text-left font-semibold text-sm tracking-wide">Client ID</th>
//                       <th className="px-4 py-4 text-left font-semibold text-sm tracking-wide">Client Version</th>
//                       <th className="px-4 py-4 text-left font-semibold text-sm tracking-wide">Client Secret</th>
//                       <th className="px-4 py-4 text-left font-semibold text-sm tracking-wide">Environment</th>
//                       <th className="px-4 py-4 text-left font-semibold text-sm tracking-wide">Webhook Username</th>
//                       <th className="px-4 py-4 text-left font-semibold text-sm tracking-wide">Webhook Password</th>
//                       <th className="px-4 py-4 text-left font-semibold text-sm tracking-wide">Callback URL</th>
//                       <th className="px-4 py-4 text-left font-semibold text-sm tracking-wide">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {tenants.map((tenant) => (
//                       <TenantTableRow
//                         key={tenant.id}
//                         tenant={tenant}
//                         onEdit={handleEditTenant}
//                         onToggleStatus={handleToggleStatus}
//                         onDelete={handleDeleteTenant}
//                       />
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       <TenantModal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setSelectedTenant(null);
//         }}
//         onSave={handleSaveTenant}
//         tenant={selectedTenant}
//       />
//       <LogoutModal
//         isOpen={activeMenuItem === 'Logout'}
//         onClose={() => setActiveMenuItem('Tenants')}
//         onConfirm={handleLogout}
//       />
//     </div>
//   );
// }

// export default Dashboards;


import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { faUser, faGear, faArrowRightFromBracket, faTags, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { logoutUser } from '../features/Authslice/AuthSlice';
import { addTenant, updateTenant, deleteTenant, toggleTenantStatus } from '../features/Tenantslice/Tenantslice';
import { updatePlan } from '../features/Planslice/Planslice';
import { assignPlanToTenant, updateTenantPlan, removeTenantPlan } from '../features/Tenantplanslice/Tenantplanslice';
import TenantModal from '../components/TenantModal';
import AssignPlanModal from '../components/Assignplanmodal';
// import EditPlanModal from '../components/Editplanmodal';
import SideBar from '../components/SideBar';
import TenantTableRow from '../components/TenantTableRow';
import LogoutModal from '../components/LogoutModal';
import AnalyticsDashboard from '../pages/Analyticsdashboard';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedTenant, setSelectedTenant] = useState(null);
  // const [selectedTenantPlan, setSelectedTenantPlan] = useState(null);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [isAssignPlanModalOpen, setIsAssignPlanModalOpen] = useState(false);
  // const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
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
  const plans = useSelector((state) => state.plans.plans);
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
    alert('Plan assigned successfully!');
  };

  // Handle Edit Plan
  const handleEditPlan = (tenant, assignment, plan) => {
    setSelectedTenant(tenant);
    // setSelectedTenantPlan({ assignment, plan });
    // setIsEditPlanModalOpen(true);
  };

  // Save edited plan
  // const handleSaveEditPlan = (data) => {
  //   dispatch(updatePlan({ id: data.planId, data: data.planData }));
    
  //   dispatch(updateTenantPlan({ id: data.assignmentId, data: data.assignmentData }));
    
  //   setIsEditPlanModalOpen(false);
  //   setSelectedTenant(null);
  //   setSelectedTenantPlan(null);
  //   alert('Plan updated successfully!');
  // };

  // Handle Remove Plan
  const handleRemovePlan = (assignmentId, tenantName) => {
    if (window.confirm(`Are you sure you want to remove the plan from ${tenantName}?`)) {
      dispatch(removeTenantPlan(assignmentId));
    }
  };

  // Logout
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  // Get plan details for a tenant
  const getTenantPlan = (tenantId) => {
    const assignment = tenantPlans.find((tp) => tp.tenantId === tenantId);
    if (assignment) {
      const plan = plans.find((p) => p.id === assignment.planId);
      return { assignment, plan };
    }
    return null;
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
                        <th className="px-4 py-4 text-left font-semibold text-sm tracking-wide">Environment</th>
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
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-[#1a3a52] text-3xl font-semibold mb-2">Tenant Plans</h2>
                <p className="text-gray-600">
                  Manage subscription plans for each tenant. Plans define the amount and frequency of charges.
                </p>
              </div>
            </div>

            {tenants.length === 0 ? (
              <div className="text-center py-12 text-gray-600 flex flex-col items-center justify-center w-full">
                <p className="text-lg mb-4">No Tenants found</p>
                <p>Please add tenants first to assign plans</p>
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
                          const tenantPlanData = getTenantPlan(tenant.id);
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

                {/* Summary Cards */}
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
              </>
            )}
          </>
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
      />

      {/* <EditPlanModal
        isOpen={isEditPlanModalOpen}
        onClose={() => {
          setIsEditPlanModalOpen(false);
          setSelectedTenant(null);
          setSelectedTenantPlan(null);
        }}
        onSave={handleSaveEditPlan}
        tenant={selectedTenant}
        tenantPlan={selectedTenantPlan}
      /> */}

      <LogoutModal
        isOpen={activeMenuItem === 'Logout'}
        onClose={() => setActiveMenuItem('Tenants')}
        onConfirm={handleLogout}
      />
    </div>
  );
}

export default Dashboard;

