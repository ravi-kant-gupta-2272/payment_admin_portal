// import React, { useState, useEffect } from 'react';

// function TenantModal({ isOpen, onClose, onSave, tenant }) {
//   const [formData, setFormData] = useState({
//     name: '',
//     callbackUrl: '',
//     phonepeAccessDetails: ''
//   });
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (tenant) {
//       setFormData({
//         name: tenant.name,
//         callbackUrl: tenant.callbackUrl,
//         phonepeAccessDetails: tenant.phonepeAccessDetails
//       });
//     } else {
//       setFormData({
//         name: '',
//         callbackUrl: '',
//         phonepeAccessDetails: ''
//       });
//     }
//     setError('');
//   }, [tenant, isOpen]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError('');

//     if (!formData.name || !formData.callbackUrl || !formData.phonepeAccessDetails) {
//       setError('Please fill in all fields');
//       return;
//     }

//     // Validate URL format
//     try {
//       new URL(formData.callbackUrl);
//     } catch {
//       setError('Please enter a valid callback URL');
//       return;
//     }

//     onSave(formData);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <div className="modal-header">
//           <h3>{tenant ? 'Edit Tenant' : 'Add New Tenant'}</h3>
//           <button className="btn-close" onClick={onClose}>
//             ×
//           </button>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="name">Tenant Name</label>
//             <input
//               type="text"
//               id="name"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               placeholder="Enter tenant name"
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="callbackUrl">Callback URL</label>
//             <input
//               type="text"
//               id="callbackUrl"
//               value={formData.callbackUrl}
//               onChange={(e) => setFormData({ ...formData, callbackUrl: e.target.value })}
//               placeholder="https://example.com/callback"
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="phonepeAccessDetails">PhonePe Access Details</label>
//             <textarea
//               id="phonepeAccessDetails"
//               value={formData.phonepeAccessDetails}
//               onChange={(e) => setFormData({ ...formData, phonepeAccessDetails: e.target.value })}
//               placeholder="Enter PhonePe access credentials, API keys, or configuration details"
//             />
//           </div>
//           {error && <div className="error-message">{error}</div>}
//           <div className="modal-actions">
//             <button type="button" className="btn btn-secondary" onClick={onClose}>
//               Cancel
//             </button>
//             <button type="submit" className="btn btn-primary">
//               {tenant ? 'Update Tenant' : 'Add Tenant'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default TenantModal;


import React, { useState, useEffect } from 'react';

function TenantModal({ isOpen, onClose, onSave, tenant }) {
  const [formData, setFormData] = useState({
    name: '',
    callbackUrl: '',
    username: '',
    password: '',
    clientId: '',
    clientVersion: '',
    clientSecret: '',
    environment: 'sandbox'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        callbackUrl: tenant.callbackUrl,
        username: tenant.username || '',
        password: tenant.password || '',
        clientId: tenant.clientId || '',
        clientVersion: tenant.clientVersion || '',
        clientSecret: tenant.clientSecret || '',
        environment: tenant.environment || 'sandbox'
      });
    } else {
      setFormData({
        name: '',
        callbackUrl: '',
        username: '',
        password: '',
        clientId: '',
        clientVersion: '',
        clientSecret: '',
        environment: 'sandbox'
      });
    }
    setError('');
  }, [tenant, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.callbackUrl || !formData.username || 
        !formData.password || !formData.clientId || !formData.clientVersion || 
        !formData.clientSecret || !formData.environment) {
      setError('Please fill in all fields');
      return;
    }

    // Validate URL format
    try {
      new URL(formData.callbackUrl);
    } catch {
      setError('Please enter a valid callback URL');
      return;
    }

    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h3 className="text-xl font-semibold text-gray-900">
            {tenant ? 'Edit Tenant' : 'Add New Tenant'}
          </h3>
          <button
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none font-light transition-colors"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Tenant Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter tenant name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="callbackUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Callback URL
              </label>
              <input
                type="text"
                id="callbackUrl"
                value={formData.callbackUrl}
                onChange={(e) => setFormData({ ...formData, callbackUrl: e.target.value })}
                placeholder="https://example.com/callback"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
                  Client ID
                </label>
                <input
                  type="text"
                  id="clientId"
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  placeholder="Enter client ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="clientVersion" className="block text-sm font-medium text-gray-700 mb-1">
                  Client Version
                </label>
                <input
                  type="text"
                  id="clientVersion"
                  value={formData.clientVersion}
                  onChange={(e) => setFormData({ ...formData, clientVersion: e.target.value })}
                  placeholder="Enter client version"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="clientSecret" className="block text-sm font-medium text-gray-700 mb-1">
                Client Secret
              </label>
              <input
                type="password"
                id="clientSecret"
                value={formData.clientSecret}
                onChange={(e) => setFormData({ ...formData, clientSecret: e.target.value })}
                placeholder="Enter client secret"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="environment" className="block text-sm font-medium text-gray-700 mb-1">
                Environment
              </label>
              <select
                id="environment"
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="sandbox">Sandbox</option>
                <option value="production">Production</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {tenant ? 'Update Tenant' : 'Add Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TenantModal;

