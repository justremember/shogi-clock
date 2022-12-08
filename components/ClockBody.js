import ClockButton from '@/components/ClockButton';
import ClockSettings from '@/components/ClockSettings';
import { useReducer, useState, useEffect } from 'react';


const useCountdown = (initialTime, name) => {
  const FPS = 60;
  const currTime = new Date().getTime();
  const initialState = {
    initialTime,
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
          time: Math.max(state.deadline - new Date().getTime(), 0),
        };
      case 'setInitialTime':
        return {
          ...state,
          initialTime: action.initialTime,
        }
      case 'reset':
        return {
          ...state,
          time: initialTime,
        }
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
      console.log('started interval', intervalId);
    }

    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
        // dispatch({ type: 'tick' });
        console.log('cleared interval', intervalId);
      }
    }
  }, [paused]);

  useEffect(() => {
    if (state.time <= 0) {
      setPaused(true);
    }
  }, [state.time]);

  const setInitialTime = (initialTime) => {
    dispatch({ type: 'setInitialTime', initialTime });
  }

  const reset = () => {
    dispatch({ type: 'reset' });
    setPaused(true);
  }

  return [state.time, paused, setPaused, setInitialTime, reset];
}


export default function ClockBody() {
  const [
    timer1Time,
    timer1Paused,
    timer1SetPaused,
    timer1SetInitialTime,
    timer1Reset,
  ] = useCountdown(5000, 'left');
  const [
    timer2Time,
    timer2Paused,
    timer2SetPaused,
    timer2SetInitialTime,
    timer2Reset,
  ] = useCountdown(5000, 'right');

  const timer1Click = () => {
    if (timer1Time > 0 && timer2Time > 0) {
      timer1SetPaused(true);
      timer2SetPaused(false);
    }
  }
  const timer2Click = () => {
    if (timer1Time > 0 && timer2Time > 0) {
      timer2SetPaused(true);
      timer1SetPaused(false);
    }
  }

  const updateSettings = (settings) => {
    timer1SetInitialTime(settings.initialTime);
    timer2SetInitialTime(settings.initialTime);
    timer1Reset();
    timer2Reset();
    alert('wow');
  }

  return (
    <div>
      <ClockSettings onSettingsChange={updateSettings} />
      <div className='py-2'>
        <ClockButton
          time={timer1Time}
          paused={timer1Paused}
          onClick={timer1Click}
          timedOut={timer1Time <= 0}
        />
        <ClockButton
          time={timer2Time}
          paused={timer2Paused}
          onClick={timer2Click}
          timedOut={timer2Time <= 0}
        />
      </div>
    </div>
  );
}
