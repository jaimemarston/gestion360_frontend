class PermissionsService {
    constructor() {
      this.permissionLevels = {
        ADMIN_ROLE: 2,
        USER_ROLE: 1,
      };
    }
  
    getPermissionLevel() {
      const role = localStorage.getItem("rol");
      return this.permissionLevels[role] || 1;
    }
  }
  
  export default new PermissionsService();
  