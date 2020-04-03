function downloadFile(options) {
  if (!options.url) {
    let blob = new Blob([options.content],
        {type: "application/zip"});
    options.url = window.URL.createObjectURL(blob);
  }
  chrome.downloads.download({
    url: options.url,
    filename: options.filename
  })
}

function randomNumericString() {
  return String(Math.floor(Math.random() * Math.floor(10000000)))
  .padStart(15, '0');
}

function zipAndDownload(links, carName) {
  let zip = new JSZip();
  let count = 0;

  links.forEach(function (url) {
    let imageName = `${carName}_${randomNumericString()}.png`;

    // noinspection JSIgnoredPromiseFromCall
    JSZipUtils.getBinaryContent(url, function (err, data) {
      if (err) {
        throw err;
      }
      zip.file(imageName, data, {binary: true});
      count++;
      if (count === links.length) {
        zip.generateAsync({type: 'blob'})
        .then(function (content) {
          downloadFile({
            content: content,
            filename: `${carName}.zip`
          });
        });
      }
    });
  });
}

function toSafeFileSystemString(text) {
  return text
  .split(' ').join("_")
  .split('<').join("_")
  .split('>').join("_")
  .split(':').join("_")
  .split('"').join("_")
  .split('\\').join("_")
  .split('/').join("_")
  .split('|').join("_")
  .split('?').join("_")
  .split('*').join("_")

}