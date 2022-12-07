import { useReducer, useEffect } from 'react';

const FPS = 10;

const useCountdown = () => {
  const initialState = {
    paused: true,
  }

  const reducer = (state, action) => {
    const pause = () => {
      return {
        ...state,
        paused: true,
      };
    }
    const unpause = () => {
      return {
        ...state,
        paused: false,
      };
    }
    switch (action.type) {
      case 'pause':
        return pause();
      case 'unpause':
        return unpause();
      case 'toggle_pause':
        switch (state.paused) {
          case false:
            return pause();
          case true:
            return unpause();
        }
    }
  }

  const [cdState, cdDispatch] = useReducer(reducer, initialState);
  return [cdState, cdDispatch];
}

export default function Timer() {
  const [cdState, cdDispatch] = useCountdown();
  return (
    <button onClick={() => cdDispatch({ type: 'toggle_pause'})}>
      {'' + cdState.paused}
    </button>
  );
}
