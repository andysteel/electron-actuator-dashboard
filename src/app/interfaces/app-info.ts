export interface AppInfo {
  app: {
    name: string;
    description: string;
    version: string;
    java?: {
      version: string;
    }
  }
}
