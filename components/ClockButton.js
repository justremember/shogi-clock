import { useContext } from 'react';
import { isTimeout } from '@/hooks/clockState';

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
  return ms >= 10000 ? msToHMS(ms) : msToSm(ms)
}

function timeStateToHuman(timeState, clockConfig, id) {
  return (
    <div className={ isTimeout(timeState) ? 'text-danger' : ''}>
      {`${msToHuman(timeState.initialTime)} + ${msToHuman(timeState.byo)} * ${timeState.byoPeriods}`}
    </div>
  )
}

export default function ClockButton({ id, clockConfig, clockState, clockDispatch }) {
  const { initialTime, byo, byoPeriods } = clockState['clock'+id];
  return (
    <button className="w-50 p-3" onClick={() => {
      clockDispatch({ type: 'pressClock', clock: id });
    }}>
      { timeStateToHuman(clockState['clock'+id], clockConfig, id) }
    </button>
  );
}
