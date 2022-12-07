export default function Timer({ paused, time, onClick }) {
  return (
    <button onClick={onClick}>
      {time}
    </button>
  );
}
