const Storage = {
  saveUser: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  },
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  getToken: () => localStorage.getItem("token"),
  getRole: () => {
    const user = Storage.getUser();
    return user ? user.role : null;
  },
  isLoggedIn: () => !!Storage.getToken(),
  clear: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },
};

window.Storage = Storage;
