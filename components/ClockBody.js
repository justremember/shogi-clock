import { useHotkeys } from 'react-hotkeys-hook';
import ClockButton from '@/components/ClockButton';

export default function ClockBody({ clockConfig, clockState, clockDispatch }) {
  useHotkeys(
    'q, w, e, r, t, a, s, d, f, g, z, x, c,v, b',
    () => clockDispatch({ type: 'pressClock', clock: 0 })
  );
  useHotkeys(
    'y, u, i, o, p, [, ], h, j, k, l, ;, \', n, m, comma, ., /',
    () => clockDispatch({ type: 'pressClock', clock: 1 })
  );
  useHotkeys(
  'enter, backspace, tab',
    () => {},
    { preventDefault: true }
  );

  return (
    <div>
      {/* Clock buttons */}
      <div>
        <ClockButton
          clockConfig={clockConfig}
          clockState={clockState}
          clockDispatch={clockDispatch}
          id={0}
        />
        <ClockButton
          clockConfig={clockConfig}
          clockState={clockState}
          clockDispatch={clockDispatch}
          id={1}
        />
      </div>
    </div>
  );
}
