import { isTimeout } from '@/hooks/clockState';

function pad(num) {
  return String(num).padStart(2, '0');
}

function msToHMS(ms) {
  const h = ms / (1000 * 60 * 60) | 0;
  const m = (ms / (1000 * 60) | 0) % 60;
  const s = (ms / 1000 | 0) % 60;
  return { h: pad(h), m: pad(m), s: pad(s) };
}

function msToHuman(ms) {
  // "09.12" for 9 minutes and 120 milliseconds
  function msToSmString(ms) {
    return (ms / 1000).toFixed(2);
  }
  const hms = msToHMS(ms);
  return ms >= 60 * 60 * 1000
    ? `${hms.h}:${hms.m}:${hms.s}`
    : ms >= 10 * 1000
      ? `${hms.m}:${hms.s}`
      : msToSmString(ms);
}

function TournamentModeClockText({ timeState, clockConfig }) {
  const totalMs = clockConfig.byo * (timeState.byoPeriods - (timeState.byoPeriods > 0 ? 1 : 0)) + timeState.byo;
  const hms = msToHMS(totalMs);
  let mainText;
  let secondaryText;
  if (totalMs >= 60000) {
    mainText = `${hms.h}:${hms.m}`;
    secondaryText = hms.s;
  } else {
    mainText = `:${hms.s}`;
    secondaryText = '';
  }
  return (
    <>
      <span className='main-text'>
        {mainText}
      </span>
      <span className='secondary-text'>
        {secondaryText}
      </span>
    </>
  );
}

function byoToHuman(byo, byoPeriods) {
  return msToHuman(byo) + (byoPeriods > 1 ? ` * ${byoPeriods}` : '');
}

function NormalModeClockText({ timeState, clockConfig }) {
  const mainText = timeState.initialTime > 0 || clockConfig.byo === 0 ? msToHuman(timeState.initialTime) : '';
  const secondaryText = clockConfig.byo > 0 ? byoToHuman(timeState.byo, timeState.byoPeriods) : '';
  return (
    <>
      {mainText && (
        <span className='main-text'>
          {mainText}
        </span>
      )}
      <span className='secondary-text'>
        {secondaryText}
      </span>
    </>
  );
}

function ClockText(props) {
  switch (props.clockConfig.clockMode) {
    case 'tournamentMode':
      return <TournamentModeClockText {...props} />;
    case 'normalMode':
      return <NormalModeClockText {...props} />;
    default:
      return <NormalModeClockText {...props} />;
  }
}

export default function ClockButton({ id, clockConfig, clockState, clockDispatch }) {
  const timeState = clockState['clock'+id];
  const { initialTime, byo, byoPeriods } = timeState;
  let stateClass;
  if (clockState.activeClock === null) {
    stateClass = 'initial-state';
  } else if (isTimeout(timeState)) {
    stateClass = 'timeout';
  } else if (clockState.activeClock === id) {
    stateClass = 'active';
  } else {
    stateClass = 'inactive';
  }
  let modeClass;
  if (clockConfig.clockMode === 'tournamentMode') {
    modeClass = 'tournament-mode';
  } else {
    modeClass = 'normal-mode';
  }
  return (
    <button
      className={
        `clock-button ${stateClass} ${modeClass}
        w-50 p-3 btn btn-light border border-dark rounded-0`
      }
      onClick={() => {
        clockDispatch({ type: 'pressClock', clock: id });
      }}
    >
      <ClockText
        timeState={timeState}
        clockConfig={clockConfig}
      />
    </button>
  );
}
