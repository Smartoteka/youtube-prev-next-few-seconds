function wait(t) {
  return new Promise(r => setTimeout(r, t));
}

async function getApp() {
  while (true) {

    const app = document.body.querySelector('#content ytd-watch-flexy');

    if (app !== null) {
      return app;
    }

    await wait(100);
  }
}


getApp().then(app => {

  function createNextNSecondButton(n) {

    const controlsContainer = document.querySelector('.ytp-left-controls');

    if (!controlsContainer) {
      throw new Error(`Can't find .ytp-left-controls`);
    }

    let name = ('next-' + n + '-seconds').replaceAll('.', '-');

    let next = controlsContainer.querySelector('#' + name);
    if (next) {
      return next;
    }

    next = document.createElement('button');
    next.id = name;
    next.className = 'ytp-button';
    next.style.cssText = 'display: inline-flex;'
      + 'justify-content: center;'
      + 'align-items: center;'
      + 'vertical-align: top';

    next.innerHTML =
      `<svg style="width: auto;height: 65%;" viewBox="0 0 24 24" width="24"><g transform="matrix(1 0 0 1 39.5 10.67)" style=""  >
		<text xml:space="preserve" font-family="'Open Sans', sans-serif" font-size="18" font-style="normal" font-weight="normal"
     style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4;
      fill: #ffffff; fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-40" y="5.65" >`+ (n > 0 ? '+' : '') + (Math.abs(n) === 0.042 ? 'f' : n) + `</tspan></text>
</g></svg>`;

    const spanWrapper = document.createElement('span');
    spanWrapper.appendChild(next);



    let playButtonContainer = document.querySelector('.ytp-play-button');

    while (playButtonContainer.parentElement !== controlsContainer) {
      playButtonContainer = playButtonContainer.parentElement;
    }

    playButtonContainer.insertAdjacentElement('afterend', spanWrapper);
    return next;
  }

  async function main() {

    function moveToSecond(second) {
      let video = document.querySelector('#ytd-player video');

      var nextTime = video.currentTime + second;

      nextTime = Math.max(0, nextTime)
      nextTime = Math.min(nextTime, video.duration)
      video.currentTime = nextTime;
    }

    let seconds = [-5, -1, -0.042, 0.042, 1, 5].reverse();

    seconds.forEach(second => {
      const next1SecondButton = createNextNSecondButton(second);

      next1SecondButton.onclick = () => {
        moveToSecond(second)
      };
    })

    document.onkeydown = (e) => {

      if (e.ctrlKey) {
        switch (e.key) {
          case 'ArrowLeft'://left
            {
              moveToSecond(-1);
              break;
            }
          case 'ArrowRight'://right
            {
              moveToSecond(1);
              break;
            }
          case '<':
          case 'б':
          case ','://left
            {
              moveToSecond(-0.042);
              break;
            }
          case '>':
          case 'ю':
          case '.'://right
            {
              moveToSecond(0.042);
              break;
            }
        }
      }
    }

  }


  main().catch(console.error);
  const mainObserver = new MutationObserver(main);
  mainObserver.observe(app, { attributeFilter: ['video-id', 'hidden'] });
});
