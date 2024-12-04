import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addRole, deleteRole, updatePermissions } from "../Redux/roleSlice";
import PermissionModal from "./PermissionModal";

const RoleTable = () => {
  const roles = useSelector((state) => state.roles.roles); 
  const dispatch = useDispatch();

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showAddRoleForm, setShowAddRoleForm] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState([]);

  const availablePermissions = [
    "Read",
    "Write",
    "Execute",
    "Delete",
  ];

  const handleEditPermissions = (role) => {
    setSelectedRole(role);
    setShowPermissionModal(true);
  };

  const savePermissions = (newPermissions) => {
    dispatch(updatePermissions({ roleId: selectedRole.id, permissions: newPermissions }));
    setShowPermissionModal(false); 
  };

  const handleAddRole = () => {
    if (!newRoleName.trim()) {
      alert("Please enter a role name.");
      return;
    }

    const newRole = {
      id: roles.length > 0 ? roles[roles.length - 1].id + 1 : 1, 
      name: newRoleName,
      permissions: newRolePermissions,
    };

    dispatch(addRole(newRole)); 
    setNewRoleName(""); 
    setNewRolePermissions([]);
    setShowAddRoleForm(false); 
  };

  const handlePermissionChange = (event) => {
    const value = Array.from(event.target.selectedOptions, (option) => option.value);
    setNewRolePermissions(value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Role Management</h2>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
        onClick={() => setShowAddRoleForm(true)}
      >
        + Add Role
      </button>

      {showAddRoleForm && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">Add New Role</h3>
          <div className="mb-4">
            <label className="block my-2 text-sm font-medium text-gray-600">Role Name</label>
            <input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter role name"
            />
          </div>

          <div className="mb-4">
            <label className="block my-2 text-sm font-medium text-gray-600">Permissions</label>
            <select
              multiple
              value={newRolePermissions}
              onChange={handlePermissionChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availablePermissions.map((permission, index) => (
                <option className="hover:bg-gray-200" key={index} value={permission}>
                  {permission}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Hold `Ctrl` or `Cmd` to select multiple permissions.
            </p>
          </div>

          <div className="flex justify-between space-x-4">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={() => setShowAddRoleForm(false)}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleAddRole}
            >
              Add Role
            </button>
          </div>
        </div>
      )}

      <table className="w-full border-collapse border border-gray-300 text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 py-3 px-4">Role</th>
            <th className="border border-gray-300 py-3 px-4">Permissions</th>
            <th className="border border-gray-300 py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr
              key={role.id}
              className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
            >
              <td className="border border-gray-300 py-3 px-4">{role.name}</td>
              <td className="border border-gray-300 py-3 px-4">
                {role.permissions.join(", ")}
              </td>
              <td className="border flex justify-between border-gray-300 py-3 px-4 text-center">
                <button
                  className="text-blue-500 hover:text-blue-700 font-medium"
                  onClick={() => handleEditPermissions(role)}
                >
                  Edit Permissions
                </button>
                <button onClick={()=> dispatch(deleteRole(role.id))} className="text-red-500" >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPermissionModal && (
        <PermissionModal
          showModal={showPermissionModal}
          setShowModal={setShowPermissionModal}
          currentPermissions={selectedRole?.permissions || []}
          onSave={savePermissions}
        />
      )}
    </div>
  );
};

export default RoleTable;
