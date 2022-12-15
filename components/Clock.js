import ClockConfig from '@/components/ClockSettings';
import ClockBody from '@/components/ClockBody';
import { useClockState, ClockContext } from '@/hooks/clockState';

export default function Clock() {
  const [clockState, clockDispatch] = useClockState();
  return (
    <ClockContext.Provider value={{ clockState, clockDispatch }}>
      <ClockConfig />
      <ClockBody />
    </ClockContext.Provider>
  )
}
