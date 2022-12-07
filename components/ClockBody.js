import ClockButton from '@/components/ClockButton';
import { useReducer, useState, useEffect } from 'react';


const useCountdown = (initialTime, name) => {
  const FPS = 1;
  const currTime = new Date().getTime();
  const initialState = {
    time: initialTime,
    // pausedTimestamp: currTime,
    deadline: currTime + initialTime,
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'pause':
        return {
          ...state,
          // pausedTimestamp: new Date().getTime(),
        };

      case 'unpause':
        return {
          ...state,
          deadline: new Date().getTime() + state.time,
        };
      case 'tick':
        return {
          ...state,
          time: state.deadline - new Date().getTime(),
        };
      default:
        console.log('unrecognized action type:', action.type);
        return state;
    }
  }
  const [paused, setPaused] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let intervalId;
    if (paused) {
      // if this countdown is paused
      dispatch({ type: 'pause' });
    } else {
      // if this countdown is unpaused
      dispatch({ type: 'unpause' });
      intervalId = setInterval(() => {
        dispatch({ type: 'tick' });
      }, 1000/FPS);
      // console.log('started interval', intervalId);
    }

    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
        // dispatch({ type: 'tick' });
        // console.log('cleared interval', intervalId);
      }
    }
  }, [paused]);

  return [state.time, paused, setPaused];
}


export default function ClockBody() {
  const [
    timer1Time,
    timer1Paused,
    timer1SetPaused,
  ] = useCountdown(30000, 'left');
  const [
    timer2Time,
    timer2Paused,
    timer2SetPaused,
  ] = useCountdown(30000, 'right');

  const timer1Click = () => {
    timer1SetPaused(true);
    timer2SetPaused(false);
  }
  const timer2Click = () => {
    timer2SetPaused(true);
    timer1SetPaused(false);
  }

  return (
    <div>
      <ClockButton
        time={timer1Time}
        paused={timer1Paused}
        onClick={timer1Click}
      />
      <ClockButton
        time={timer2Time}
        paused={timer2Paused}
        onClick={timer2Click}
      />
    </div>
  );
}
