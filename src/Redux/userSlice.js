import { createSlice } from "@reduxjs/toolkit";

const loadFromLocalStorage = (key) => {
  const savedData = localStorage.getItem(key);
  return savedData ? JSON.parse(savedData) : [];
};

const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const initialState = {
  users: loadFromLocalStorage("users"),
  roles: loadFromLocalStorage("roles"),
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
      setUsers(state, action) {
        state.users = action.payload;
        saveToLocalStorage("users", state.users); 
      },
      setRoles(state, action) {
        state.roles = action.payload;
        saveToLocalStorage("roles", state.roles); 
      },
      addUser(state, action) {
        const newUser = action.payload;
        state.users.push(newUser);
        saveToLocalStorage("users", state.users); 
      },
      updateUser(state, action) {
        const updatedUser = action.payload;
        const index = state.users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
          saveToLocalStorage("users", state.users); 
        }
      },
      removeUser(state, action) {
        const userId = action.payload;
        state.users = state.users.filter(user => user.id !== userId);
        saveToLocalStorage("users", state.users); 
      },
  
      assignRoleToSelected(state, action) {
        const { selectedUserIds, newRole } = action.payload;
        state.users = state.users.map((user) =>
          selectedUserIds.includes(user.id)
            ? { ...user, role: newRole }
            : user
        );
        saveToLocalStorage("users", state.users); 
      },
      
      changeUserRole(state, action) {
        const { userId, newRole } = action.payload;
        const user = state.users.find(user => user.id === userId);
        if (user) {
          user.role = newRole;
          saveToLocalStorage("users", state.users); 
        }
      },
    changePassword(state, action) {
        const { userId, newPassword } = action.payload;
        const user = state.users.find((user) => user.id === userId);
        if (user) {
          user.password = newPassword;
          saveToLocalStorage("users", state.users); 
        }
      },
      toggleUserStatus(state, action) {
        const userId = action.payload;
        const user = state.users.find(user => user.id === userId);
        if (user) {
          user.status = user.status === "Active" ? "Disabled" : "Active";
          saveToLocalStorage("users", state.users); 
        }
      }
    },
  });
  
  export const {
    setUsers,
    setRoles,
    addUser,
    updateUser,
    removeUser,
    selectUser,
    deselectUser,
    selectAllUsers,
    deselectAllUsers,
    assignRoleToSelected,
    changeUserRole,
    changePassword,
    toggleUserStatus
  } = userSlice.actions;
  
  export default userSlice.reducer;
  

