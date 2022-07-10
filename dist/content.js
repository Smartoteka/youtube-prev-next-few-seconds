function wait(t) {
  return new Promise(r => setTimeout(r, t));
}

async function getApp() {
  for (let i = 0; i < 20; i++) {

    let app = document.body.querySelector('#content ytd-watch-flexy');

    if (app !== null) {
      return app;
    }

    app = document.body.querySelector('.ckin__player');

    if (app !== null) {
      return app;
    }

    app = document.querySelector('video');

    if (app !== null) {
      return app;
    }

    app = document.querySelector('iframe#player');

    if (app !== null) {
      return app;
    }

    await wait(100);
  }

  console.log("App not found")
  return null;
}

function getControlsContainer() {
  let controlsContainer = document.querySelector('.ytp-left-controls');

  if (!controlsContainer) {
    controlsContainer = document.querySelector('.left-controls');
  }

  if (!controlsContainer) {
    controlsContainer = document.querySelector('#player-control-container');
  }

  if (!controlsContainer) {
    throw new Error(`Can't find .ytp-left-controls`);
  }

  return controlsContainer;
}

function getPlayButtonContainer(controlsContainer) {
  // for (let i = 0; i < 20; i++) {
  let playButtonContainer = document.querySelector('.ytp-play-button');

  if (playButtonContainer === null) {
    playButtonContainer = controlsContainer.querySelector('.default__button');
  }

  if (playButtonContainer === null) {
    playButtonContainer = document.querySelector('.playlist-controls-primary');
    return playButtonContainer;
  }

  //   await wait(100);
  // }

  // if (!playButtonContainer) {
  //   playButtonContainer = document.querySelector('.custom_container');

  //   if (!playButtonContainer) {
  //     let container = document.createElement('div');
  //     container.style = `
  //     background-color: black;
  //     z-index: 3;
  //     position: relative;
  //     padding-top: 10px;
  // `;
  //     container.innerHTML = "<div class='custom_container'></div>";

  //     document.querySelector('#player-control-container').insertAdjacentElement('afterend', container);
  //     return document.querySelector('.custom_container');
  //   }
  //   else {
  //     return playButtonContainer;
  //   }
  //}

  while (playButtonContainer != controlsContainer && playButtonContainer.parentElement !== controlsContainer) {
    playButtonContainer = playButtonContainer.parentElement;
  }
  return playButtonContainer;
}

function initApp(app) {
  {

    function createNextNSecondButton(n) {

      let controlsContainer = getControlsContainer();
      let playButtonContainer = getPlayButtonContainer(controlsContainer);
      let name = ('next-' + n + '-seconds').replaceAll('.', '-');

      let next = playButtonContainer.querySelector('#' + name);
      if (next) {
        return next;
      }

      next = document.createElement('button');
      next.id = name;
      next.className = 'ytp-button btn-icon default__button';
      next.style.cssText = `padding: 0.075rem;display: inline-flex;justify-content: center;align-items: center;`;

      next.innerHTML =
        `<svg style="width: auto;height: 65%;" viewBox="0 0 24 24" width="24"><g transform="matrix(1 0 0 1 39.5 10.67)" style=""  >
      <text xml:space="preserve" font-family="'Open Sans', sans-serif" font-size="18" font-style="normal" font-weight="normal"
       style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4;
        fill: #ffffff; fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-40" y="5.65" >`+ (n > 0 ? '+' : '') + (Math.abs(n) === 0.042 ? 'f' : n) + `</tspan></text>
  </g></svg>`;

      const spanWrapper = document.createElement('span');
      spanWrapper.appendChild(next);

      
      playButtonContainer.insertAdjacentElement('afterend', spanWrapper);
      return next;
    }

    function getVideo() {
      let video = document.querySelector('#ytd-player video');

      if (!video) {
        video = document.querySelector('.ckin__player video')
      }

      if (!video) {
        video = document.querySelector('video')
      }

      return video;
    }
    async function main() {

      function moveToSecond(second) {
        let video = getVideo();

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
      });

      let controlsContainer = getControlsContainer();
      let playButtonContainer = getPlayButtonContainer(controlsContainer);

      let name = ('speedSelect');

      let speedCtrl = playButtonContainer.querySelector('#' + name);
      if (speedCtrl) {
        return speedCtrl;
      }

      speedCtrl = document.createElement('select');
      speedCtrl.id = name;
      // next.className = 'ytp-button btn-icon default__button';
      speedCtrl.style.cssText = `
      display: inline-flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      vertical-align: top;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      color: white;
      background-color: black;
      border: 0;
      margin-right: 5px;
      margin-left: 5px;
      `;

      let speeds = [2, 1.5, 1.1, 1, 0.9, 0.75, 0.5];

      speedCtrl.innerHTML = speeds.map(speed => ('<option value="' + speed + '" ' + (speed === 1 ? 'selected="selected"' : '') + '>' + speed + 'X</option>')).join('');

      playButtonContainer.insertAdjacentElement('afterend', speedCtrl);

      const playbackRateChange = () => {
        console.log("rate = " + speedCtrl.value);

        const rate = parseFloat(speedCtrl.value)
        getVideo().playbackRate = rate;
      }
      speedCtrl.onchange = playbackRateChange;

      document.querySelector('.playback-rate').style = "display:none";
      //       let timeMarks = document.createElement('select');
      //       timeMarks.id = "timeMarks";
      //       // next.className = 'ytp-button btn-icon default__button';
      //       timeMarks.style.cssText = 'display: inline-flex;'
      //         + 'justify-content: center;'
      //         + 'align-items: center;'
      //         + 'font-size: 14px;'
      //         + 'vertical-align: top';

      //         timeMarks.innerHTML =
      // `<option value="" data-v-469af010="">(none)</option><option value="20.123354" data-v-469af010="">Ганчо с теневой</option>`

      // let span=document.createElement('span');
      // span.innerHTML=`<span v-if="showTimeMarkName">
      // [{{ getCurrentTimeStr() }}] Mark name
      // <input v-model="timeMarkName" />
      // <img
      //   class="add ctrl-img"
      //   src="/src/assets/check-square.svg"
      //   @click="addTime"
      // />
      // </span>

      // <img
      // v-if="!showTimeMarkName"
      // class="add ctrl-img"
      // src="/src/assets/plus-square.svg"
      // @click="toAddTime"
      // />
      // <img
      // v-if="!showTimeMarkName && moment"
      // class="add ctrl-img"
      // src="/src/assets/trash-2.svg"
      // @click="removeTime"
      // />`;

      // playButtonContainer.insertAdjacentElement('afterend', timeMarks);
      // playButtonContainer.insertAdjacentElement('afterend', span);
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
            case 'ArrowUp':
              {
                if (speedCtrl.selectedIndex > 0) {
                  speedCtrl.selectedIndex -= 1;
                  playbackRateChange();
                }
                else {
                  let speedOption = speedCtrl.options[0];
                  speedOption.text = speedOption.value = parseFloat(speedCtrl.value) + 1;
                  playbackRateChange();
                }
                break;
              }
            case 'ArrowDown'://right
              {
                if (speedCtrl.selectedIndex === 0 && parseFloat(speedCtrl.value) > 2) {
                  let speedOption = speedCtrl.options[0];
                  speedOption.text = speedOption.value = parseFloat(speedCtrl.value) - 1;
                  playbackRateChange();
                }
                else
                  if (speedCtrl.selectedIndex < speedCtrl.options.length - 1) {
                    speedCtrl.selectedIndex += 1;
                    playbackRateChange();
                  }
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
    mainObserver.observe(app, { attributeFilter: ['video-id', 'hidden', 'src'] });
  }
}
getApp().then(app => {
  if (app) {
    initApp(app);
  }
  // else
  {
    //     let next = document.createElement('button');
    //     next.id = "initLater";
    //    // next.className = 'ytp-button btn-icon default__button';
    //     next.style.cssText = 'position: absolute;z-index: 1000;bottom: 0px;right: 0px;color: red;border-color: black;';

    //     next.innerHTML =
    //       `<svg style="width: auto;height: 65%;" viewBox="0 0 24 24" width="24"><g transform="matrix(1 0 0 1 39.5 10.67)" style=""  >
    //     <text xml:space="preserve" font-family="'Open Sans', sans-serif" font-size="18" font-style="normal" font-weight="normal"
    //      style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4;
    //       fill: #ffffff; fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-40" y="5.65" >`+ 111 + `</tspan></text>
    // </g></svg>`;

    //     document.body.appendChild(next);
    //     next.onclick = () => {

    document.body.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        getApp().then(app => {
          initApp(app);
        });
      }
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request)

  switch (request.cmd) {
    case 'initVideo':
      {
        getApp().then(app => {
          initApp(app);
          sendResponse({
            success: true,
            message: "success"
          });
        });


        break
      }
    default: {
      throw new Error('Unexpected command ' + request.cmd)
    }
  }
})