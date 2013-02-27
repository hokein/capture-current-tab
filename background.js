function base64ToBinary(imgUrl) {
  var BASE64_MARKER = ';base64,';
  var base64Index = imgUrl.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = imgUrl.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for (i = 0; i < rawLength; ++i) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

function saveToDisk(blob, fileName) {
  var reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onload = function (event) {
    var save = document.createElement('a');
    save.href = event.target.result;
    save.target = '_blank';
    save.download = fileName || 'unknown';

    var event = document.createEvent('Event');
    event.initEvent('click', true, true);
    save.dispatchEvent(event);
    (window.URL || window.webkitURL).revokeObjectURL(save.href);
  };
}

function caputureCurrentTab(winId) {
  chrome.tabs.captureVisibleTab(winId, {"format":"jpeg"}, function(imgUrl) {
    content = base64ToBinary(imgUrl);
    bob = new Blob([content]);
    saveToDisk(bob, "picture.jpeg");
    fileWriter.write(bob);
  });
};

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.windows.getCurrent(function (win) {
    caputureCurrentTab(win.id);
  });
});
