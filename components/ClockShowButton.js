export default function ClockShowButton({ showSettings, setShowSettings }) {
  return (
    <div>
      <button id='show-settings-button' className='btn btn-outline-primary' onClick={() => setShowSettings(s => !s)}>
        {`${ showSettings ? 'Hide' : 'Show'} settings and tutorial`}
      </button>
    </div>
  )
}
