import { createContext, useReducer, useEffect } from 'react';
import { initialConfig } from '@/hooks/clockConfig';

export const FPS = 60;

const setStateFromConfig = (config) => {
  return {
    clock0: {
      initialTime: config.initialTime,
      byo: config.byo,
      byoRounds: config.byoRounds,
    },
    clock1: {
      initialTime: config.initialTime,
      byo: config.byo,
      byoRounds: config.byoRounds,
    },
    activeClock: null,
    stopped: false
  };
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'reset':
      return setStateFromConfig(action.config);
    case 'pressClock':
      if (
        state.stopped
        || (action.clock !== 0 && action.clock !== 1)
      ) {
        return state;
      }
      const otherClock = action.clock === 1 ? 0 : 1;
      return {
        ...state,
        activeClock: otherClock,
        lastTick: new Date().getTime()
      }
    case 'tick':
      const activeClock = state.activeClock;
      if (activeClock !== 0 && activeClock !== 1) {
        return state;
      }
      const currTick = new Date().getTime();
      const tickClock = (clock, delta) => {
        return {
          ...clock,
          initialTime: clock.initialTime - delta
        }
      }
      return {
        ...state,
        ['clock' + activeClock]: tickClock(
          state['clock' + activeClock],
          currTick - state.lastTick
        ),
        lastTick: currTick
      }
    default:
      console.log('unrecognized action type:', action.type);
      return state;
  }
}

export function useClockState() {
  const [state, dispatch] = useReducer(reducer, initialConfig, setStateFromConfig);

  useEffect(() => {
    let intervalId;
    if (
      !state.stopped
    ) {
      intervalId = setInterval(() => {
        dispatch({ type: 'tick' });
      }, 1000 / FPS);
    }
    console.log('interval started', intervalId);
    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
        console.log('interval cleared', intervalId);
      }
    }
  }, [state.stopped]);

  return [state, dispatch];
}
