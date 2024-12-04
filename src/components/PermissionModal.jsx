import React, { useState } from "react";

const PermissionModal = ({ showModal, setShowModal, currentPermissions, onSave }) => {
  const [permissions, setPermissions] = useState(currentPermissions || []);

  const permissionOptions = ["Read", "Write", "Delete", "Execute"];

  const togglePermission = (permission) => {
    setPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((perm) => perm !== permission)
        : [...prev, permission]
    );
  };

  const handleSave = () => {
    onSave(permissions);
    setShowModal(false);
  };

  return (
    showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <h3 className="text-lg font-bold mb-4">Manage Permissions</h3>
          <div className="space-y-2">
            {permissionOptions.map((perm) => (
              <label key={perm} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={permissions.includes(perm)}
                  onChange={() => togglePermission(perm)}
                />
                <span>{perm}</span>
              </label>
            ))}
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default PermissionModal;
