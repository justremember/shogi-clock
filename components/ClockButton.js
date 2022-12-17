import { useContext } from 'react';

function msToHuman(ms) {
  function pad(num) {
    return String(num).padStart(2, '0');
  }
  function msToHMS(ms) {
    const H = ms / (1000 * 60 * 60) | 0;
    const M = (ms / (1000 * 60) | 0) % 60;
    const S = (ms / 1000 | 0) % 60;
    return `${pad(H)}:${pad(M)}:${pad(S)}`;
  }
  function msToSm(ms) {
    return (ms / 1000).toFixed(2).padStart(5, '0');
  }
  if (ms >= 10000) return msToHMS(ms);
  else return msToSm(ms);
}

function timeStateToHuman(timeState, clockConfig) {
  return `${msToHuman(timeState.initialTime)} + ${msToHuman(timeState.byo)} * ${timeState.byoRounds}`;
}

export default function ClockButton({ id, clockConfig, clockState, clockDispatch }) {
  const { initialTime, byo, byoRounds } = clockState['clock'+id];
  return (
    <button class="w-50 p-3" onClick={() => {
      clockDispatch({ type: 'pressClock', clock: id });
    }}>
      { timeStateToHuman(clockState['clock'+id], clockConfig) }
    </button>
  );
}
