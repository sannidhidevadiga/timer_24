import { configureStore, createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { Timer } from '../types/timer';

const loadTimers = () => {
  const savedTimers = localStorage.getItem('timers');
  if (savedTimers) {
    try {
      return JSON.parse(savedTimers);
    } catch (error) {
      console.error('Failed to load timers from localStorage:', error);
    }
  }
  return [];
};

const initialState = {
  timers: loadTimers() as Timer[],
  startTime: null as number | null,
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    addTimer: (state, action) => {
      const newTimer = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      state.timers.push(newTimer);
      saveTimers(state.timers);
    },
    deleteTimer: (state, action) => {
      state.timers = state.timers.filter(timer => timer.id !== action.payload);
      saveTimers(state.timers);
    },
    toggleTimer: (state, action) => {
      const timer = state.timers.find(timer => timer.id === action.payload);
      if (timer) {
        if (state.startTime === null) {
          state.startTime = Date.now();
        }
        timer.isRunning = !timer.isRunning;
        saveTimers(state.timers);
      }
    },
    updateTimer: (state, action) => {
      const timer = state.timers.find(timer => timer.id === action.payload);
    
      if (state.startTime) {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000); 
        state.timers.forEach((timer) => {
          if (timer.isRunning) {
            const newRemainingTime = Math.max(0, timer.duration - elapsed);
            timer.remainingTime = newRemainingTime;
    
            if (newRemainingTime <= 0) {
              timer.isRunning = false;
            }
          }
        });
      } else if (timer && timer.isRunning) {
        timer.remainingTime -= 1;
        timer.isRunning = timer.remainingTime > 0; 
      }
    
      saveTimers(state.timers);
    },
    restartTimer: (state, action) => {
      const timer = state.timers.find(timer => timer.id === action.payload);
      if (timer) {
        timer.remainingTime = timer.duration;
        timer.isRunning = false;
        saveTimers(state.timers);
      }
    },
    restartTimers: (state) => {
      state.startTime = Date.now();
      state.timers.forEach((timer) => {
        timer.remainingTime = timer.duration;
        timer.isRunning = false;
      });
      saveTimers(state.timers);
    },
    editTimer: (state, action) => {
      const timer = state.timers.find(timer => timer.id === action.payload.id);
      if (timer) {
        Object.assign(timer, action.payload.updates);
        timer.remainingTime = action.payload.updates.duration || timer.duration;
        timer.isRunning = false;
        saveTimers(state.timers);
      }
    },
  },
});

const saveTimers = (timers: Timer[]) => {
  try {
    localStorage.setItem('timers', JSON.stringify(timers));
  } catch (error) {
    console.error('Failed to save timers to localStorage:', error);
  }
};

const store = configureStore({
  reducer: timerSlice.reducer,
});

export { store };

export const {
  addTimer,
  deleteTimer,
  toggleTimer,
  updateTimer,
  restartTimer,
  restartTimers,
  editTimer,
} = timerSlice.actions;

export const useTimerStore = () => {
  const dispatch = useDispatch();
  const timers = useSelector((state: { timers: Timer[] }) => state.timers);
  const startTime = useSelector((state: { startTime: number | null }) => state.startTime);

  return {
    timers,
    startTime,
    addTimer: (timer: Omit<Timer, 'id' | 'createdAt'>) => dispatch(addTimer(timer)),
    deleteTimer: (id: string) => dispatch(deleteTimer(id)),
    toggleTimer: (id: string) => dispatch(toggleTimer(id)),
    updateTimer: (id: string) => dispatch(updateTimer(id)),
    restartTimer: (id: string) => dispatch(restartTimer(id)),
    restartTimers: () => dispatch(restartTimers()),
    editTimer: (id: string, updates: Partial<Timer>) => dispatch(editTimer({ id, updates })),
  };
};
