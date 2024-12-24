export interface Timer {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  remainingTime: number;
  isRunning: boolean;
  createdAt: number;
}

export interface TimerProps {
  isOpen: boolean;
  onClose: () => void;
  timer?: Timer;
}

