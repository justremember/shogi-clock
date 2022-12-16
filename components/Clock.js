import ClockSettings from '@/components/ClockSettings';
import ClockBody from '@/components/ClockBody';
import { useClockConfig, ClockConfigContext } from '@/hooks/clockConfig';
import { useClockState, ClockStateContext } from '@/hooks/clockState';

export default function Clock() {
  const [clockConfig, setClockConfig] = useClockConfig();
  const [clockState, clockDispatch] = useClockState();
  return (
      <ClockConfigContext.Provider value={{ clockConfig, setClockConfig }}>
        <ClockSettings clockDispatch={clockDispatch} />
        <ClockStateContext.Provider value={{ clockState, clockDispatch }}>
          <ClockBody />
        </ClockStateContext.Provider>
      </ClockConfigContext.Provider>
  )
}
