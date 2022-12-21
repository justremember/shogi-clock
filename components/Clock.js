import ClockSettings from '@/components/ClockSettings';
import ClockBody from '@/components/ClockBody';
import { useClockConfig } from '@/hooks/clockConfig';
import { useClockState } from '@/hooks/clockState';

export default function Clock() {
  const [clockConfig, setClockConfig] = useClockConfig();
  const [clockState, clockDispatch] = useClockState();
  return (
    <div>
      <ClockSettings
        clockConfig={clockConfig}
        setClockConfig={setClockConfig}
        clockState={clockState}
        clockDispatch={clockDispatch}
      />
      <ClockBody
        clockConfig={clockConfig}
        clockState={clockState}
        clockDispatch={clockDispatch}
      />
    </div>
  )
}
