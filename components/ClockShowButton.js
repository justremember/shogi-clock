// import useLongPress from '@/hooks/useLongPress';
// There seems to be a bug with useLongPress. Will not use for now.

function ShowButton({ showSettings, setShowSettings }) {
  /*
   const showSettingsLongPress = useLongPress(() => {
    setShowSettings(true);
  }, 600);
  return (
    <button id='show-settings-button' className='btn btn-outline-primary' {...showSettingsLongPress} >
      Long press to show settings
    </button>
  )
  */
  return (
    <button id='show-settings-button' className='btn btn-outline-primary' onClick={() => setShowSettings(true)} >
      Show settings
    </button>
  )
}

export default function ClockShowButton({ showSettings, setShowSettings }) {
  return (
    <div>
      {showSettings ?
          <button id='show-settings-button' className='btn btn-outline-primary' onClick={() => setShowSettings(false)}>
            Click to hide settings
          </button>
        : <ShowButton {...{ showSettings, setShowSettings}} />
      }
    </div>
  )
}
