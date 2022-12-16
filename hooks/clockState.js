import { createContext, useReducer, useEffect } from 'react';

export const initialState = {
  config: {
    initialTime: 60*1000,
    byo: 60*1000,
    byoRounds: 1
  },
  state: null
}

export const FPS = 60;

export function useClockState() {
  const setStateFromConfig = ({ config, state }) => {
    return {
      config,
      state: {
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
      }
    };
  }
  const reducer = (clockState, action) => {
    switch (action.type) {
      case 'updateConfig':
        return {
          ...clockState,
          config: action.config
        };
      case 'reset':
        return setStateFromConfig(clockState);
      case 'pressClock':
        if (
          clockState.state.stopped
          || (action.clock !== 0 && action.clock !== 1)
        ) {
          return clockState;
        }
        const otherClock = action.clock === 1 ? 0 : 1;
        return {
          ...clockState,
          state: {
            ...clockState.state,
            activeClock: otherClock,
            lastTick: new Date().getTime()
          }
        }
      case 'tick':
        const activeClock = clockState.state.activeClock;
        if (activeClock !== 0 && activeClock !== 1) {
          return clockState;
        }
        const currTick = new Date().getTime();
        const tickClock = (clock) => {
          return {
            ...clock,
            initialTime: clock.initialTime - (currTick - clockState.state.lastTick)
          }
        }
        return {
          ...clockState,
          state: {
            ...clockState.state,
            ['clock' + activeClock]: tickClock(
              clockState.state['clock' + activeClock]
            ),
            lastTick: currTick
          }
        }
      default:
        console.log('unrecognized action type:', action.type);
        return clockState;
    }
  }
  const [clockState, clockDispatch] = useReducer(reducer, initialState, setStateFromConfig);

  useEffect(() => {
    let intervalId;
    if (
      !clockState.state.stopped
      && clockState.state.activeClock !== null
    ) {
      intervalId = setInterval(() => {
        clockDispatch({ type: 'tick' });
      }, 1000 / FPS);
    }
    console.log('interval started', intervalId);
    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
        console.log('interval cleared', intervalId);
      }
    }
  }, [clockState.state.stopped, clockState.state.activeClock]);

  return [clockState, clockDispatch];
}

export const ClockContext = createContext();
