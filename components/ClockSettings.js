import { useState } from 'react';
import ClockTutorial from '@/components/ClockTutorial';
import ClockShowButton from '@/components/ClockShowButton';
import ClockSettingsForm from '@/components/ClockSettingsForm';

export default function ClockSettings({ clockConfig, setClockConfig, clockState, clockDispatch }) {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <div id='clock-settings-with-show-button-parent'>
      <div id='clock-settings-with-show-button'>
        { showSettings &&
          <div id='clock-settings' className='border p-3 bg-light'>
            <h1>Shogi Clock</h1>
            <div className='py-1'>
              {/* Pause button */}
              <button className='btn btn-secondary me-1' onClick={() => {
                clockDispatch({type: 'togglePause'})
              }}>
                {clockState.paused ? 'Resume' : 'Pause'}
              </button>
              {/* Reset button */}
              <button className='btn btn-warning' onClick={() => {
                if (confirm('Are you sure?')) {
                  clockDispatch({type: 'reset', config: clockConfig})
                  setShowSettings(false);
                }
              }}>
                Reset
              </button>
            </div>
            <h2>Settings</h2>
            <ClockSettingsForm {...{ setClockConfig, clockDispatch, setShowSettings}} />
            <ClockTutorial />
          </div>
        }
        <ClockShowButton {...{ showSettings, setShowSettings}} />
      </div>
    </div>
  );
}
