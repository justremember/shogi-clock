import ClockSettings from '@/components/ClockSettings';
import ClockBody from '@/components/ClockBody';
import { useClockState, ClockContext } from '@/hooks/clockState';

export default function Clock() {
  const [clockState, clockDispatch] = useClockState();
  console.log('Clock.js clockState', clockState);
  return (
    <ClockContext.Provider value={{ clockState, clockDispatch }}>
      <ClockSettings />
      <ClockBody />
    </ClockContext.Provider>
  )
}
