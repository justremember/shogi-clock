import { useContext } from 'react';
import { ClockContext } from '@/hooks/clockState';
import ClockButton from '@/components/ClockButton';

export default function ClockBody() {
  const { clockState, clockDispatch } = useContext(ClockContext);

  return (
    <div>
      <div>
        <ClockButton id={0} />
        <ClockButton id={1} />
      </div>
      <div>
        <button onClick={() => {
          if (confirm('Are you sure?')) {
            clockDispatch({type: 'reset'})
          }
        }}>
          Reset
        </button>
      </div>
    </div>
  );
}
