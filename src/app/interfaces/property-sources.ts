export interface PropertySources {
  name: string;
  properties: {
    'user.timezone': {
      value: string;
    },
    'os.name': {
      value: string;
    },
    'user.country': {
      value: string;
    },
    'user.language': {
      value: string;
    },
    'java.version.date': {
      value: string;
    },
    'file.separator': {
      value: string;
    },
    FILE_LOG_CHARSET: {
      value: string;
    },
    'java.runtime.version': {
      value: string;
    },
    'file.encoding': {
      value: string;
    },
    'java.vm.name': {
      value: string;
    },
    'java.version': {
      value: string;
    },
    'os.arch': {
      value: string;
    },
    CONSOLE_LOG_CHARSET: {
      value: string;
    },
  }
}

export interface Environments {
  activeProfiles: any[];
  propertySources: PropertySources[];
}
