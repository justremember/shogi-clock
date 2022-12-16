import { useContext } from 'react';
import { ClockStateContext } from '@/hooks/clockState';

export default function ClockButton({ id }) {
  const { clockState, clockDispatch } = useContext(ClockStateContext);
  const { initialTime, byo, byoRounds } = clockState['clock'+id];
  return (
    <button onClick={() => {
      clockDispatch({ type: 'pressClock', clock: id });
    }}>
      { '' + initialTime + ' + ' + byo + ' * ' + byoRounds }
    </button>
  );
}
