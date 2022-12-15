import { createContext, useReducer } from 'react';

export const initialState = {
  config: {
    initialTime: 15*60,
    byo: 60,
    byoRounds: 1
  },
  state: null
}

export function useClockState() {
  const setStateFromConfig = ({ config, state }) => {
    return {
      config,
      state: {
        clocks: [
          {
            initialTime: config.initialTime,
            byo: config.byo,
            byoRounds: config.byoRounds,
          },
          {
            initialTime: config.initialTime,
            byo: config.byo,
            byoRounds: config.byoRounds,
          }
        ],
        activeClock: null,
        stopped: true
      }
    };
  }
  const reducer = (state, action) => {
    switch (action.type) {
      case 'updateConfig':
        return {
          ...state,
          config: action.config
        };
      case 'reset':
        return setStateFromConfig(state);
      default:
        console.log('unrecognized action type:', action.type);
        return state;
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState, setStateFromConfig);
  return [state, dispatch];
}

export const ClockContext = createContext();
