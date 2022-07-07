function getActiveTab(windowId) {
  let params = { active: true }

  if (windowId) {
    params.windowId = windowId
  } else {
    params.currentWindow = true
  }
  return new Promise(r => chrome.tabs.query(params, (tabs) => r(tabs.length ? tabs[0] : null)))
}





chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(
    tab.id,
    {
      cmd: 'initVideo',

    },
    (result) => {
      // if (result.success) {
      //   editor.replaceSelection(
      //     '[' + formatTime(result.currentTime) + '](https://youtu.be/ZJZMirMYu5g?list=PL7iSzWmAf8tvuCOhY6utAY2TbCchP4Kla&t=' + Math.floor(result.currentTime) + ')',
      //     rememberPos,
      //     end,
      //   )
      // } else {
        console.log(result)
     // }
    },
  )
})
