'use strict';

window.onload = function () {
  let links = [];
  let carName;

  let linksContainer = document.getElementById('linksContainer');

  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.executeScript(
        tabs[0].id, {
          code: `
            links = [];
            document.querySelectorAll('.ImageGalleryDesktop__thumb')
              .forEach(e => links.push(e.getAttribute('src')));
            links;
          `
        }, function (result) {
          result[0].forEach(link => addLink(link));
        });
    chrome.tabs.executeScript(
        tabs[0].id, {
          code: `
            document.querySelector('.CardHead-module__title').textContent
          `
        }, function (result) {
          console.log("Result: " + result);
          carName = result[0];
        });

  });

  function addLink(text) {

    text = text.replace("small", "orig");
    text = "https:" + text;

    let li = document.createElement("li");
    let a = document.createElement("a");

    a.setAttribute("href", text);
    a.text = text;

    li.appendChild(a);
    linksContainer.appendChild(li);

    links.push(text);
  }

  document.getElementById("downloadButton").onclick = function () {
    chrome.tabs.query({active: true, currentWindow: true},
        function (tabs) {
          zipAndDownload(links, `${toSafeFileSystemString(carName)}`);
        })
  };

  document.getElementById("detailsButton").onclick = function () {
    linksContainer.hidden = !linksContainer.hidden;
  }
};


