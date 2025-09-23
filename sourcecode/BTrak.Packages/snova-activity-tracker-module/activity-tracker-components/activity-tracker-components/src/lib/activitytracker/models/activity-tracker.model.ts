export class ActivityModel {
    roleId: string[];
    roleName: string;
    idleScreenShotCaptureTime: number;
    idleAlertTime: number;
    minimumIdelTime: number;
    isDeleteScreenShots: boolean;
    isManualEntryTime: boolean;
    isRecordActivity: boolean;
    isMouseActivity: boolean;
    isIdleTime: boolean;
    isOfflineTracking: boolean;
    appUrlId: string;
    off: boolean;
    Urls: boolean;
    RoleId: any;
    selectedRoles: any;
    selectedUser: string[];
    screenShotFrequency: number;
    frequencyIndex: number;
    remove: boolean;
    selectAll: boolean;
    considerPunchCard: boolean;
  }
  export class ActivityModulesInfo{
    modules : any;
  }