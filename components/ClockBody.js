import { useHotkeys } from 'react-hotkeys-hook';
import ClockButton from '@/components/ClockButton';

export default function ClockBody({ clockConfig, clockState, clockDispatch }) {
  const onKeyPress = (clock) => {
    return (e) => {
      clockDispatch({ type: 'pressClock', clock })
    }
  }
  useHotkeys(
    'q, w, e, r, t, a, s, d, f, g, z, x, c, v, b, left',
    onKeyPress(0)
  );
  useHotkeys(
    'y, u, i, o, p, [, ], h, j, k, l, ;, \', n, m, comma, ., /, right',
    onKeyPress(1)
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
