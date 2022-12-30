import Image from 'next/image';
import qwerty from '@/public/images/qwerty.png';


export default function ClockTutorial() {
  return (
    <div id='tutorial' className='mt-3'>
      <h2>About Shogi Clock</h2>
      <p>
        Shogi Clock is a chess clock webapp meant to be used for <a href='https://en.wikipedia.org/wiki/Shogi' target='_blank' rel='noreferrer noopener'>shogi</a> games.
      </p>
      <p>
        It has <a href='https://en.wikipedia.org/wiki/Shogi#Time_control' target='_blank' rel='noreferrer noopener'>byoyomi (countdown)</a> features which are present in few chess clocks.
      </p>
      <p>
        The code is open-source. Anyone can check out the code, report bugs, and make suggestions over at <a href='https://github.com/justremember/shogi-clock' target='_blank' rel='noreferrer noopener'>the Github page</a>.
      </p>
      <h3>Keyboard controls</h3>
      <div>
        The <span style={{color: '#cf2525'}}>left clock</span> can be triggered by:
        <ul>
          <li>
            the keys T, G, and B
          </li>
          <li>
            the alphabetical keys to the left of those three
          </li>
          <li>
            the left arrow key
          </li>
        </ul>
      </div>
      <div>
        The <span style={{color: '#0071cf'}}>right clock</span> can be triggered by:
        <ul>
          <li>
            the keys Y, H, and N
          </li>
          <li>
            the alphabet keys & symbol keys to the right of those three
          </li>
          <li>
            the right arrow key
          </li>
        </ul>
      </div>
      <Image
        src={qwerty}
        alt='Keyboard image showing the hotkeys'
        width={460}
      />
    </div>
  );
}
