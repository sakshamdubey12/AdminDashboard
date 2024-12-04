import React, { useEffect, useState } from "react";
import UserTable from "./components/UserTable";
import RoleTable from "./components/RoleTable";
import { useSelector } from "react-redux";

const App = () => {
  const users = useSelector((state) => state.user.users);
  const roles = useSelector((state) => state.roles.roles);
  console.log(useSelector((state)=>state))



  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
      {/* Header Section */}
      <header className="bg-white shadow-md p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
      </header>

      {/* Main Content */}
      <main className="p-6 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-3xl font-bold text-blue-500">{users.length}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-semibold">Active Users</h2>
            <p className="text-3xl font-bold text-green-500">
              {users.filter((user) => user.status === "Active").length}
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-semibold">Total Roles</h2>
            <p className="text-3xl font-bold text-purple-500">{roles.length}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6 h-screen overflow-y-auto">
            <UserTable />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 h-screen overflow-y-auto">
            <RoleTable />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
