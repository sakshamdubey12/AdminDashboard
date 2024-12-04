import { createSlice } from "@reduxjs/toolkit";

const loadRolesFromLocalStorage = () => {
  const storedRoles = localStorage.getItem("roles");
  return storedRoles ? JSON.parse(storedRoles) : [];
};

const saveRolesToLocalStorage = (roles) => {
  localStorage.setItem("roles", JSON.stringify(roles));
};

const initialState = {
  roles: loadRolesFromLocalStorage(),
};

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    addRole: (state, action) => {
      const newRole = action.payload;
      state.roles.push(newRole);
      saveRolesToLocalStorage(state.roles); 
    },

    updatePermissions: (state, action) => {
      const { roleId, permissions } = action.payload;
      const role = state.roles.find((role) => role.id === roleId);
      if (role) {
        role.permissions = permissions;
      }
      saveRolesToLocalStorage(state.roles); 
    },

    deleteRole: (state, action) => {
      const roleId = action.payload;
      state.roles = state.roles.filter((role) => role.id !== roleId);
      saveRolesToLocalStorage(state.roles); 
    },
  },
});

export const { addRole, updatePermissions, deleteRole } = roleSlice.actions;
export default roleSlice.reducer;
