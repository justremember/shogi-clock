export default function Timer({ paused, time, onClick, timedOut }) {
  return (
    <button onClick={onClick} style={{ color: timedOut ? 'red'  : null }}>
      {time}
    </button>
  );
}
