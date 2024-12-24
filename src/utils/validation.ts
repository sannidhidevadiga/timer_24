import { toast } from 'sonner';

export interface TimerFormData {
  title: string;
  description: string;
  hours: number;
  minutes: number;
  seconds: number;
}
export const validateTimerForm = (data: TimerFormData): boolean => {
  const { title, hours, minutes, seconds } = data;
  let errorMessages = [];

  if (!title.trim()) {
    errorMessages.push('Title is required');
  }

  if (title.length > 50) {
    errorMessages.push('Title must be less than 50 characters');
  }

  if (hours < 0 || minutes < 0 || seconds < 0) {
    errorMessages.push('Time values cannot be negative');
  }

  if (minutes > 59 || seconds > 59) {
    errorMessages.push('Minutes and seconds must be between 0 and 59');
  }

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  if (totalSeconds === 0) {
    errorMessages.push('Please set a time greater than 0');
  }

  if (totalSeconds > 86400) { // 24 hours
    errorMessages.push('Timer cannot exceed 24 hours');
  }

  if (errorMessages.length > 0) {
    toast.error(errorMessages.join('\n'));
    return false;
  }

  return true;
};