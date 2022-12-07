import Timer from '@/components/Timer';
import { useReducer, useEffect } from 'react';


const useCountdown = () => {
  const FPS = 10;
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
      default:
        console.log('unrecognized action type');
        return state;
    }
  }

  const [cdState, cdDispatch] = useReducer(reducer, initialState);
  return [cdState, cdDispatch];
}



export default function ClockBody() {
  const [timer1State, timer1Dispatch] = useCountdown();
  const [timer2State, timer2Dispatch] = useCountdown();

  const timer1Click = () => {
    timer1Dispatch({ type: 'pause' });
    timer2Dispatch({ type: 'unpause' });
  }

  const timer2Click = () => {
    timer2Dispatch({ type: 'pause' });
    timer1Dispatch({ type: 'unpause' });
  }

  return (
    <div>
      <Timer state={timer1State} onClick={timer1Click} />
      <Timer state={timer2State} onClick={timer2Click} />
    </div>
  );
}
