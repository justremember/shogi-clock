export default function Timer({ state, onClick }) {
  return (
    <button onClick={onClick}>
      {state.paused.toString()}
    </button>
  );
}
