import { createContext, useReducer, useEffect } from 'react';
import { initialFormValues, formValuesToConfig } from '@/hooks/clockConfig';

export const FPS = 60;

const setStateFromConfig = (config) => {
  return {
    clock0: {
      initialTime: config.initialTime,
      configByo: config.byo,
      byo: config.byo,
      byoPeriods: config.byoPeriods,
    },
    clock1: {
      initialTime: config.initialTime,
      configByo: config.byo,
      byo: config.byo,
      byoPeriods: config.byoPeriods,
    },
    activeClock: null, // 0, 1, or null
    paused: false
  };
}

const tickClock = (clock, delta, isClockPress) => {
  let initialTime = clock.initialTime - delta;
  if (initialTime >= 0) {
    return { ... clock, initialTime };
  }
  let remainingDelta = -initialTime;
  initialTime = 0;
  let byo = clock.byo - remainingDelta;
  let byoPeriods = clock.byoPeriods;
  if (byo <= 0) {
    byo += clock.configByo;
    byoPeriods--;
  }
  if (byoPeriods < 1) { // time has run out
    byo = 0;
    byoPeriods = 0;
  } else if (isClockPress) { // tick was triggered by clock press, so reset byoyomi
    byo = clock.configByo;
  }
  return {
    ...clock,
    initialTime,
    byo,
    byoPeriods,
  }
}

export const isTimeout = (timeState) => {
  return (
    timeState.initialTime <= 0
    && timeState.byoPeriods <= 0
  );
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'reset':
      return setStateFromConfig(action.config);
    case 'pressClock': {
      const otherClock = (action.clock + 1) % 2;
      if (
        state.paused
        || (action.clock !== 0 && action.clock !== 1)
        || (otherClock === state.activeClock)
        || isTimeout(state['clock' + action.clock])
      ) {
        return state;
      }
      const currTick = new Date().getTime();
      if (state.activeClock === null) {
        return {
          ...state,
          activeClock: otherClock,
          lastTick: currTick
        }
      }
      return {
        ...state,
        activeClock: otherClock,
        ['clock' + action.clock]: tickClock(
          state['clock' + action.clock],
          currTick - state.lastTick,
          true
        ),
        lastTick: currTick
      };
    }
    case 'tick': {
      const activeClock = state.activeClock;
      if (
        (activeClock !== 0 && activeClock !== 1)
      ) {
        return state;
      }
      const currTick = new Date().getTime();
      return {
        ...state,
        ['clock' + activeClock]: tickClock(
          state['clock' + activeClock],
          currTick - state.lastTick
        ),
        lastTick: currTick
      };
    }
    case 'togglePause':
      return {
        ...state,
        paused: !state.paused,
        lastTick: new Date().getTime()
      };
    default:
      console.log('unrecognized action type:', action.type);
      return state;
  }
}

export function useClockState() {
  const [state, dispatch] = useReducer(reducer, formValuesToConfig(initialFormValues), setStateFromConfig);

  useEffect(() => {
    let intervalId;
    if (
      !state.paused
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
  }, [state.paused]);

  return [state, dispatch];
}
