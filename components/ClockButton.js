import { useContext } from 'react';
import { ClockContext } from '@/hooks/clockState';

export default function ClockButton({ id }) {
  const { clockState, clockDispatch } = useContext(ClockContext);
  const { initialTime, byo, byoRounds } = clockState.state['clock'+id];
  return (
    <button onClick={() => {
      clockDispatch({ type: 'pressClock', clock: id });
    }}>
      { '' + initialTime + ' + ' + byo + ' * ' + byoRounds }
    </button>
  );
}
