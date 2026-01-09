import React, { useState } from 'react';
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function TenantTableRow({ tenant, onEdit, onToggleStatus, onDelete }) {
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [showWebhookPassword, setShowWebhookPassword] = useState(false);

  return (
    <tr
      key={tenant.id}
      className="border-b border-gray-300 hover:bg-gray-50 transition-colors duration-200"
    >
      <td className="px-4 py-4 text-sm text-gray-900">
        <div className="max-w-[120px] truncate" title={tenant.clientId}>
          {tenant.clientId}
        </div>
      </td>
      
      <td className="px-4 py-4 text-sm text-gray-600">
        {tenant.clientVersion}
      </td>
      
      <td className="px-4 py-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="max-w-[100px] truncate font-mono" title={showClientSecret ? tenant.clientSecret : undefined}>
            {showClientSecret ? tenant.clientSecret : '•'.repeat(Math.min(tenant.clientSecret.length, 12))}
          </div>
          <button 
            className="text-blue-600 hover:text-blue-800 p-1 rounded"
            onClick={() => setShowClientSecret(!showClientSecret)}
            aria-label={showClientSecret ? 'Hide client secret' : 'Show client secret'}
            title={showClientSecret ? 'Hide' : 'Show'}
          >
            {showClientSecret ? (
              <FontAwesomeIcon icon={faEyeSlash}/>
            ) : (
              // <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              //   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              //   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              // </svg>
              <FontAwesomeIcon icon={faEye}/>
            )}
          </button>
        </div>
      </td>
      
      <td className="px-4 py-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            tenant.environment === 'production'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {tenant.environment.charAt(0).toUpperCase() + tenant.environment.slice(1)}
        </span>
      </td>
      
      <td className="px-4 py-4 text-sm text-gray-600">
        {tenant.username}
      </td>
      
      <td className="px-4 py-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="font-mono">
            {showWebhookPassword ? tenant.password : '•'.repeat(8)}
          </span>
          <button 
            className="text-blue-600 hover:text-blue-800 p-1 rounded"
            onClick={() => setShowWebhookPassword(!showWebhookPassword)}
            aria-label={showWebhookPassword ? 'Hide webhook password' : 'Show webhook password'}
            title={showWebhookPassword ? 'Hide' : 'Show'}
          >
            {showWebhookPassword ? (
              <FontAwesomeIcon icon={faEyeSlash}/>
            ) : (
              <FontAwesomeIcon icon={faEye}/>
            )}
          </button>
        </div>
      </td>
      
      <td className="px-4 py-4 text-sm text-gray-600">
        <div className="max-w-[200px] truncate" title={tenant.callbackUrl}>
          {tenant.callbackUrl}
        </div>
      </td>
      
      <td className="px-1 py-1">
        <div className="flex flex-row gap-1">
          <button 
            onClick={() => onEdit(tenant)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-1 py-1 rounded-md text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {/* Edit */}
          </button>
          
          <button 
            onClick={() => onToggleStatus(tenant.id)}
            className={`px-1 py-1 rounded-md text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2 ${
              tenant.enabled 
                ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {tenant.enabled ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            {/* {tenant.enabled ? 'Disable' : 'Enable'} */}
          </button>
          
          <button 
            onClick={() => onDelete(tenant.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-1 py-1 rounded-md text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {/* Delete */}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default TenantTableRow;