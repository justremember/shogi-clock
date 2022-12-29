import { useState } from 'react';
import ClockTutorial from '@/components/ClockTutorial';
import ClockShowButton from '@/components/ClockShowButton';
import ClockSettingsForm from '@/components/ClockSettingsForm';
import { useMountTransition } from '@/hooks/useMountTransition';

const TRANSITION_DELAY = 500;

export default function ClockSettings({ clockConfig, setClockConfig, clockState, clockDispatch }) {
  const [showSettings, setShowSettings] = useState(false);
  const hasTransitionedIn = useMountTransition(showSettings, TRANSITION_DELAY);
  return (
    <div
      id='clock-settings-with-show-button'
      class={
        clockConfig.layout === 'settingsOnSide'
          ? 'settings-on-side'
          : 'settings-on-top'
      }
    >
      { (showSettings || hasTransitionedIn) && (
        <div
          id='clock-settings-wrapper'
          className={`${
            (showSettings && hasTransitionedIn)
            && 'visible'
          } bg-light`}
          style={{
            transitionDuration: TRANSITION_DELAY + 'ms'
          }}
        >
          <div id='clock-settings-content'>
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
        </div>
      )}
      <ClockShowButton {...{ showSettings, setShowSettings}} />
    </div>
  );
}
