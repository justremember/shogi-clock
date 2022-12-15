export default function ClockButton({ time, onClick, timedOut, paused }) {
  return (
    <button onClick={onClick} style={{ color: timedOut ? 'red'  : null }}>
      {time}
    </button>
  );
}
