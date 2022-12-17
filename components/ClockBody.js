import { useContext } from 'react';
import { ClockStateContext } from '@/hooks/clockState';
import ClockButton from '@/components/ClockButton';

export default function ClockBody({ clockConfig, clockState, clockDispatch }) {

  return (
    <div>
      <div>
        <ClockButton
          clockConfig={clockConfig}
          clockState={clockState}
          clockDispatch={clockDispatch}
          id={0}
        />
        <ClockButton
          clockConfig={clockConfig}
          clockState={clockState}
          clockDispatch={clockDispatch}
          id={1}
        />
      </div>
      <div>
        <button onClick={() => {
          clockDispatch({type: 'togglePause', config: clockConfig})
        }}>
          {clockState.paused ? 'Resume' : 'Pause'}
        </button>
        <button onClick={() => {
          if (confirm('Are you sure?')) {
            clockDispatch({type: 'reset', config: clockConfig})
          }
        }}>
          Reset
        </button>
      </div>
    </div>
  );
}
