export type Plan = {
    goal: string;
    timeframe: string;
    plan: {
      step: string;
      subtasks: { task: string; count: number; interval: string }[];
    }[];
  };