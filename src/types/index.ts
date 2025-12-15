export interface UserData {
  stats: {
    ventCount: number;
    letGoCount: number;
    lastVisit: string;
  };
  settings: {
    showQuotes: boolean;
  };
}

export const DEFAULT_DATA: UserData = {
  stats: {
    ventCount: 0,
    letGoCount: 0,
    lastVisit: new Date().toISOString()
  },
  settings: {
    showQuotes: true
  }
};
