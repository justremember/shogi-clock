import { useContext } from 'react';

export default function ClockButton({ id, clockState, clockDispatch }) {
  const { initialTime, byo, byoRounds } = clockState['clock'+id];
  return (
    <button onClick={() => {
      clockDispatch({ type: 'pressClock', clock: id });
    }}>
      { '' + initialTime + ' + ' + byo + ' * ' + byoRounds }
    </button>
  );
}
