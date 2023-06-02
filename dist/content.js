


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
  if (!controlsContainer) {/*telegram*/
    controlsContainer = document.querySelector('.VideoPlayerControls');
  }

  if (!controlsContainer) {
    controlsContainer = document.querySelector('#player-control-container');
  }

  if (!controlsContainer) {
    throw new Error(`Can't find .ytp-left-controls`);
  }

  return controlsContainer;
}

//TODO применить стили к диву родителю custom_container
/*
*/

function getPlayButtonContainer(controlsContainer) {
  let playButtonContainer = document.querySelector('.ytp-play-button');

  if (!playButtonContainer) {
    playButtonContainer = controlsContainer.querySelector('.videoplayer_timecode');

    if (playButtonContainer)
      return playButtonContainer;
  }

  if (playButtonContainer === null) {
    playButtonContainer = controlsContainer.querySelector('.buttons');
  }
  else {
    return playButtonContainer.parentElement;
  }

  if (!playButtonContainer) {
    playButtonContainer = document.querySelector('.custom_container');

    if (!playButtonContainer) {
      let container = document.createElement('div');
      container.style = `
      
  `;
      container.innerHTML = "<div style='background-color: black;'><div class='custom_container' style='display: flex;background-color: black;z-index: 3;'></div><div style='clear: both;'></div></div>";

      document.querySelector('#player-control-container').insertAdjacentElement('afterend', container);
      return document.querySelector('.custom_container');
    }
    else {
      return playButtonContainer;
    }
  }

  while (playButtonContainer != controlsContainer && playButtonContainer.parentElement !== controlsContainer) {
    playButtonContainer = playButtonContainer.parentElement;
  }
  return playButtonContainer;
}
function initApp(app) {
  {

    function createNextNSecondButton(playButtonContainer, n) {

      let name = ('next-' + n + '-seconds').replaceAll('.', '-');

      let next = playButtonContainer.parentElement.querySelector('#' + name);
      if (next) {
        return next;
      }

      if (!document.querySelector('.youtube-next-few-btn')) {
        const style = document.createElement('style');

        style.id = 'youtube-next-few-btn';
        style.innerHTML =
          `
        .youtube-next-few-btn{
          display: inline-flex;
          justify-content: center;
          align-items: center;
          min-width:32px;
          min-height:32px;
          margin:3px;
          background-color:transparent;

          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select:none; 
          user-select:none;
          -o-user-select:none;

          border:none;
        }
       
        .youtube-next-few-btn svg{
          width: auto;height: 65%;
        }
        `;

        document.head.append(style);
      }

      next = document.createElement('button');
      next.id = name;
      next.className = 'ytp-button btn-icon default__button youtube-next-few-btn';
      next.style = ""
      next.unselectable = "on"
      next.onselectstart = "return false;"
      next.innerHTML =
        `<svg viewBox="0 0 16 16"><g transform="matrix(1 0 0 1 39.5 10.67)"  >
      <text xml:space="preserve" font-family="'Open Sans', sans-serif" font-size="18" font-style="normal" font-weight="normal"
       style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4;
        fill: #ffffff; fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-40" y="5.65" >`
        //  + (n > 0 ? '+' : '')
        + (Math.abs(n) === 0.042
          ?
          (n > 0 ? 'f' : '-f')
          : n)
        + `</tspan></text>
  </g></svg>`;

      // const spanWrapper = document.createElement('span');
      // spanWrapper.appendChild(next);

      playButtonContainer.appendChild(next);
      return next;
    }

    function getVideo() {
      let video = document.querySelector('#ytd-player video');

      if (!video) {
        video = document.querySelector('.ckin__player video')
      }

      if (!video) {
        video = document.querySelector('video#media-viewer-video')
      }

      return video;
    }

    function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
      var startTimeInMs = Date.now();
      (function loopSearch() {
        if (document.querySelector(selector) != null) {
          callback();
          return;
        }
        else {
          setTimeout(function () {
            if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
              return;
            loopSearch();
          }, checkFrequencyInMs);
        }
      })();
    }

    function moveToSecond(second) {
      console.log('move to ' + second);
      let video = getVideo();

      var nextTime = video.currentTime + second;

      nextTime = Math.max(0, nextTime)
      nextTime = Math.min(nextTime, video.duration)
      video.currentTime = nextTime;
    }

    function isMobile() {
      return 'ontouchstart' in document.body;
    }

    function createNavigateButtons(playButtonContainer) {

      let seconds = [-0.042, 0.042, -5, -1, 1, 5];

      let navigate_button_container = document.querySelector('.navigate_button_container');

      if (!navigate_button_container) {
        navigate_button_container = document.createElement('div');
        navigate_button_container.classList = 'navigate_button_container';
        navigate_button_container.style = `
      `;

        playButtonContainer.appendChild(navigate_button_container);
        navigate_button_container = document.querySelector('.navigate_button_container');
      }
      let buttons = [];
      let mouseDownTimer = null;

      seconds.forEach(second => {
        const next1SecondButton = createNextNSecondButton(navigate_button_container, second);

        buttons.push(next1SecondButton);

        let mouseUp = false;
        const touchClickHandler = (e) => {
          mouseUp = false;

          let timerMove = (isFirst) => {

            if (mouseDownTimer && !next1SecondButton.matches(':hover')) {
              console.log('not active')
              clearTimeout(mouseDownTimer);
              mouseDownTimer = null;
            } else if (!mouseDownTimer && isFirst) {
              console.log('active')
              if (!mouseUp)
                mouseDownTimer = setTimeout(timerMove, 250);
              else {
                console.log('mouseup=true')
              }
            }
            else if (!isFirst) {
              moveToSecond(second);
              if (!mouseUp)
                mouseDownTimer = setTimeout(timerMove, 250);
              else
                console.log('mouseup=true')
            }
          };
          timerMove(true);
        };

        const mouseUpOrTouchEnd = () => {
          mouseUp = true;
          console.log('mouseup')
          // if (mouseDownTimer) {
          //   clearTimeout(mouseDownTimer);
          // }
          mouseDownTimer = null;
        };

        if (isMobile()) {
          next1SecondButton.ontouchstart = touchClickHandler;
          next1SecondButton.ontouchend = mouseUpOrTouchEnd;
          next1SecondButton.ontouchcancel = mouseUpOrTouchEnd;
        }
        else {
          next1SecondButton.onmousedown = touchClickHandler;
          next1SecondButton.onmouseup = mouseUpOrTouchEnd;
        }
      });

      let beginVisibleInd = 0;

      const setVisibleButton = () => {
        // for (let i = 0; i < buttons.length; i++) {
        //   if (buttons[i].hide)
        //     continue;
        //   if (i < beginVisibleInd || i >= beginVisibleInd + 3) {
        //     buttons[i].style.display = 'none'
        //   }
        //   else {
        //     buttons[i].style.display = null;
        //   }
        // }
      }

      const setFramePlayDisplay = (value) => {
        // buttons[0].style.display = buttons[1].style.display = value;
        // buttons[0].hide =
        //   buttons[1].hide = !!value;

        //   setVisibleButton();
      }

      function InitVideo(video) {
        let playIsPause = video == null ? true : video.paused;
        video.onpause = () => {
          playIsPause = true;
          setFramePlayDisplay(null);
  
        }
  
        video.onplay = () => {
          playIsPause = false;
          setFramePlayDisplay('none');
        }
      }

      setFramePlayDisplay('none');


      let initVideoHandlers = (i) => {
        if (i > 5)
          return;
        i++;
        let video = getVideo();

        if (video) {
          InitVideo(video);

          return;
        }

        setTimeout(() => initVideoHandlers(i), 200);
      }

      initVideoHandlers(0);

      setVisibleButton();

      let ongoingTouches = {};
      const mouseTouchMove = (e) => {
        const touch = e.changedTouches[0];
        let saveX = ongoingTouches[touch.identifier];

        const diffX = touch.pageX - saveX;
        if (Math.abs(diffX) > 2) {
          console.log('move')
          if (mouseDownTimer) {
            clearTimeout(mouseDownTimer);
          }

          mouseDownTimer = null;

          let diffI = Math.round(-diffX / (52 - 3 * 2) * seconds.length / 2);
          beginVisibleInd += diffI;

          //playIsPause = getVideo().paused;

          if (beginVisibleInd < 0)
            beginVisibleInd = 0
          if (beginVisibleInd >= buttons.length - (playIsPause ? 3 : 5))
            beginVisibleInd = buttons.length - (playIsPause ? 3 : 5);

          setVisibleButton();
        }

        ongoingTouches[touch.identifier] = touch.pageX;
      };

      const touchEnd = (e) => {
        const touch = e.changedTouches[0];
        delete ongoingTouches[touch.identifier];
      };

      navigate_button_container.ontouchstart = (e) => {
        const touch = e.changedTouches[0];
        ongoingTouches[touch.identifier] = touch.pageX;
      };

      navigate_button_container.ontouchend = touchEnd;
      navigate_button_container.ontouchmove = mouseTouchMove;
      navigate_button_container.ontouchcancel = (e) => touchEnd;

    }

    function toTime(seconds) {
      const player = getVideo();

      if (player.currentTime === 0) {

        let i = 0;
        const _toTime = function () {
          setTimeout(() => {
            if (player.currentTime < seconds) {
              player.currentTime = (seconds);

              if (i < 3) {
                i++;
                setTimeout(_toTime, 200);
              }
            }
          }, 200);
        };
        _toTime();
      }
      player.currentTime = seconds;
    }

    function momentChange(e) {
      console.log(e)
      const isMomentNotNull = function (i) {
        // console.log(i);
        if (e.target.value) {
          toTime(parseFloat(e.target.value));
        }
        //  else {
        //   if (i < 20) setTimeout(() => isMomentNotNull(i + 1), 500);
        // }
      };

      isMomentNotNull(0);
    }

    async function main() {

      const script = document.createElement('script');
      script.setAttribute("type", "module");
      script.setAttribute("src", chrome.runtime.getURL('db.js'));
      const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
      head.insertBefore(script, head.lastChild);

      let controlsContainer = getControlsContainer();
      let playButtonContainer = getPlayButtonContainer(controlsContainer);

      createNavigateButtons(playButtonContainer);

      waitForElementToDisplay('.tgico-fullscreen', () => {
        document.querySelector('.tgico-fullscreen').onclick = (el) => {
          if (screen.orientation.type.indexOf('portrait') !== -1) {
            this._height = document.querySelector('.media-viewer-mover').clientHeight;
            delete document.querySelector('.media-viewer-caption').style.height
            screen.orientation.lock('landscape')

            document.querySelector("head").insertAdjacentHTML('afterend', '<style id="youtube-teleg-ext-style" type="text/css"></style>');

            document.querySelector('#youtube-teleg-ext-style').sheet.insertRule(
              `.left-controls span {
              margin-left: 5px;
              margin-right: 5px;
          }`);
          }
          else {
            document.querySelector('#youtube-teleg-ext-style').remove();
            screen.orientation.lock('portrait');

            setTimeout(() => {
              document.querySelector('.media-viewer-mover').style.height = this._height + "px!important";

            }, 200);

          }
        };
      }, 200, 2000);

      if (playButtonContainer.classList.contains('custom_container')) {

        waitForElementToDisplay('ytm-single-column-watch-next-results-renderer', () => {

          let descriptionCtrl = document.querySelector('ytm-single-column-watch-next-results-renderer');
          if (descriptionCtrl) {
            descriptionCtrl.style = 'margin-top:30px';
          }

          // document.querySelector('.player-controls-pb.cbox').style.bottom = '40px';
          // document.querySelector('.player-controls-bottom.cbox').style.bottom = '70px';
          //document.querySelector('.new-controls').style['pagging-bottom'] = '40px';

          const style = document.createElement('style');

          style.id = 'youtube-next-few-mobile-portrait';
          style.innerHTML =
            `
        #player-control-overlay{
          bottom:40px !important;
        }
       
        `;

          document.head.append(style);

          document.onorientationchange = (event) => {
            console.log(event);
          };
        }, 200, 4000);
      }
      let name = ('speedSelect');

      let speedCtrl = playButtonContainer.parentElement.querySelector('#' + name);
      if (speedCtrl) {
        return;
      }

      playButtonContainer.parentElement.style.opacity = 1;
      let buttons = playButtonContainer.querySelectorAll("button.fullscreen");
      buttons[0].style.top = "-30px";
      buttons[0].style.right = "30px";
      buttons[0].style.position = "absolute";

      buttons[1].style.top = "-30px";
      buttons[1].style.right = "0px";
      buttons[1].style.position = "absolute";


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

      position: absolute;top: -30px;left: 10px;
      `;

      let speeds = [2, 1.5, 1.1, 1, 0.9, 0.75, 0.5];

      speedCtrl.innerHTML = speeds.map(speed => ('<option value="' + speed + '" ' + (speed === 1 ? 'selected="selected"' : '') + '>' + speed + 'X</option>')).join('');

      playButtonContainer.appendChild(speedCtrl);

      const playbackRateChange = () => {
        console.log("rate = " + speedCtrl.value);

        const rate = parseFloat(speedCtrl.value)
        getVideo().playbackRate = rate;
      }
      speedCtrl.onchange = playbackRateChange;

      const playbackRate = document.querySelector('.playback-rate');
      if (playbackRate)
        playbackRate.style = "display:none";
      // let timeMarks = document.createElement('select');
      // timeMarks.id = "timeMarks";
      // // next.className = 'ytp-button btn-icon default__button';
      // timeMarks.style.cssText = 'display: inline-flex;'
      //   + 'justify-content: center;'
      //   + 'align-items: center;'
      //   + 'font-size: 14px;'
      //   + 'vertical-align: top'
      //   + `-webkit-appearance: none;
      //         -moz-appearance: none;
      //         appearance: none;
      //         color: white;
      //         background-color: black;
      //         border: 0;
      //         margin-right: 5px;
      //         margin-left: 5px;
      //         max-width:50px`;

      // timeMarks.innerHTML =
      //   `<option value="" data-v-469af010="">(none)</option><option value="20.123354" data-v-469af010="">Ганчо с теневой</option>`

      // const db = window.db;
      // timeMarks.onchange = (e) => momentChange(e);


      //playButtonContainer.appendChild(timeMarks);

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
  {

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