import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addUser,
  setRoles,
  removeUser,
  toggleUserStatus,
  changeUserRole,
  selectUser,
  deselectUser,
  selectAllUsers,
  deselectAllUsers,
  assignRoleToSelected,
  changePassword,
} from "../Redux/userSlice";

const UserTable = ({}) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const roles = useSelector((state) => state.roles.roles);
  console.log(users,roles)

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const sortedUsers = React.useMemo(() => {
    if (!sortConfig.key) return users;

    const sortedData = [...users].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sortedData;
  }, [users, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState(roles[0]?.name || "");
  const [newUserGroup, setNewUserGroup] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleUpdatePassword = () => {
    if (!newPassword.trim()) {
      alert("Please enter a new password.");
      return;
    }

    if (newUserPassword.length < 3) {
      alert("Password length should be more than 3 characters.");
      return;
    }

    dispatch(changePassword({ userId: selectedUser.id, newPassword }));
    setNewPassword("");
    setIsEditingPassword(false);
    alert("Password updated successfully!");
    handleCloseProfileModal();
  };

  // Handle adding a new user
  const handleAddUser = () => {
    if (!newUserName.trim() || !newUserRole.trim() || !newUserPassword.trim()) {
      console.log(newUserName,newUserRole,newUserPassword)
      alert("Please fill out all required fields.");
      return;
    }

    const userExist = users.filter((user) => user.name === newUserName);
    console.log(userExist);
    if (userExist.length > 0) {
      alert("Username alreadt taken.");
      return;
    }

    if (newUserPassword.length < 3) {
      alert("Password length should be more than 3 characters.");
      return;
    }

    const newUser = {
      id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
      name: newUserName,
      group: newUserGroup ? [newUserGroup] : [],
      role: newUserRole,
      password: newUserPassword,
      status: "Active",
    };
    dispatch(addUser(newUser));

    setNewUserName("");
    setNewUserRole(roles[0]?.name || "");
    setNewUserGroup("");
    setNewUserPassword("");
    setShowAddUserForm(false);
  };

  // Handle role change for individual user
  const handleRoleChange = (userId, newRole) => {
    dispatch(changeUserRole({ userId, newRole }));
  };

  // Handle selecting/deselecting a user
  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  // Handle select/deselect all users
  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]); // Deselect all
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  // Handle assigning the selected role to selected users
  const handleAssignRoleToSelected = () => {
    dispatch(
      assignRoleToSelected({
        selectedUserIds: selectedUsers,
        newRole: newUserRole,
      })
    );
    setSelectedUsers([]);
  };

  // Handle opening the profile modal
  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  // Handle closing the profile modal
  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="bg-white h-[80%] p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          User Management
        </h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setShowAddUserForm(true)}
        >
          + Add User
        </button>
      </div>

      {users.length === 0 ? (
        <p className="text-gray-500 italic">No users available.</p>
      ) : (
        <div className="h-[100%] overflow-y-auto">
          <table className="w-full border-collapse border border-gray-300 text-left">
            <thead>
              <tr className="sticky top-0 bg-gray-100">
                <th className="border border-gray-300 py-2 px-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th
                  className="border border-gray-300 py-2 px-4 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("name")}
                >
                  Name{" "}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="border border-gray-300 py-2 px-4 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("role")}
                >
                  Role{" "}
                  {sortConfig.key === "role" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="border border-gray-300 py-2 px-4 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("status")}
                >
                  Status{" "}
                  {sortConfig.key === "status" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="border border-gray-300 py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 even:bg-gray-100">
                  <td className="border border-gray-300 py-2 px-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td
                    onClick={() => handleViewProfile(user)}
                    className="border border-gray-300 py-2 px-4 hover:text-green-600 hover:cursor-pointer"
                  >
                    {user.name}
                  </td>
                  <td className="border border-gray-300 py-2 px-4">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-300 py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="flex justify-between border border-gray-300 py-2 px-4 space-x-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => dispatch(toggleUserStatus(user.id))}
                    >
                      {user.status === "Active" ? "Disable" : "Enable"}
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => dispatch(removeUser(user.id))}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {
            <div className="mt-4 flex justify-between items-center">
              <div className="flex space-x-4">
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
                {selectedUsers.length > 0 ? (
                  <button
                    className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 `}
                    onClick={handleAssignRoleToSelected}
                  >
                    Assign Role
                  </button>
                ) : (
                  <button
                    disabled
                    className={`bg-gray-500 text-white px-4 py-2 rounded `}
                  >
                    Assign Role
                  </button>
                )}
              </div>
            </div>
          }
        </div>
      )}

      {showProfileModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-96 max-w-lg transform transition-all duration-300 scale-95 hover:scale-100">
            <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              User Profile
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600">Name</label>
                <p className="text-lg font-medium text-gray-800">
                  {selectedUser.name}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Role</label>
                <p className="text-lg font-medium text-gray-800">
                  {selectedUser.role}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Status</label>
                <p
                  className={`text-lg font-medium ${
                    selectedUser.status === "Active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedUser.status}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="bg-gray-500 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-600 transition-colors duration-300"
                onClick={handleCloseProfileModal} 
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfileModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-96 max-w-lg transform transition-all duration-300 scale-95 hover:scale-100">
            <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              User Profile
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600">Name</label>
                <p className="text-lg font-medium text-gray-800">
                  {selectedUser.name}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Role</label>
                <p className="text-lg font-medium text-gray-800">
                  {selectedUser.role}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Status</label>
                <p
                  className={`text-lg font-medium ${
                    selectedUser.status === "Active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedUser.status}
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-600">Password</label>
                {isEditingPassword ? (
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                  />
                ) : (
                  <div
                    className="text-lg font-medium text-gray-800 cursor-pointer"
                    onClick={() => {
                      setNewPassword(selectedUser.password);
                      setIsEditingPassword(true);
                    }}
                  >
                    ******
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-500 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-600 transition-colors duration-300"
                onClick={handleCloseProfileModal}
              >
                Close
              </button>
              {isEditingPassword && (
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors duration-300"
                  onClick={handleUpdatePassword}
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddUserForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>
            <div className="mb-4">
              <label className="block mb-2 text-sm text-gray-600">Name</label>
              <input
                type="email"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter user name"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm text-gray-600">Role</label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                  <option disabled selected >Select Role</option>

                {roles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm text-gray-600">
                Password
              </label>
              <input
                type="password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
            </div>

            <div className="flex justify-between">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setShowAddUserForm(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleAddUser}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
