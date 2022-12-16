import { useContext } from 'react';
import { ClockConfigContext } from '@/hooks/clockConfig';
import { ClockStateContext } from '@/hooks/clockState';
import ClockButton from '@/components/ClockButton';

export default function ClockBody() {
  const { clockConfig } = useContext(ClockConfigContext);
  const { clockState, clockDispatch } = useContext(ClockStateContext);

  return (
    <div>
      <div>
        <ClockButton id={0} />
        <ClockButton id={1} />
      </div>
      <div>
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
