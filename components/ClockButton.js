import { useContext } from 'react';
import { ClockContext } from '@/hooks/clockState';

export default function ClockButton({ id }) {
  const { clockState, clockDispatch } = useContext(ClockContext);
  const { initialTime, byo, byoRounds } = clockState.state.clocks[id];
  console.log('id', id);
  return (
    <button>
      { '' + initialTime + ' + ' + byo + ' * ' + byoRounds }
    </button>
  );
}
