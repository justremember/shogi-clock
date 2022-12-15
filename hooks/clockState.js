import { createContext, useReducer } from 'react';

export const initialState = {
  config: {
    initialTime: 15*60,
    byo: 60,
    byoRounds: 1
  }
}
export function useClockState() {
  const reducer = (state, action) => {
    switch (action.type) {
      case 'updateConfig':
        return {
          ...state,
          config: action.config
        };

      default:
        console.log('unrecognized action type:', action.type);
        return state;
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  return [state, dispatch];
}

export const ClockContext = createContext();
