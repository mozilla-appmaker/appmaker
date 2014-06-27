(function() {
  var loadingCover = document.querySelector(".loading-cover");
  function onReadyStateComplete() {
    if (document.readyState === "complete") {
      document.removeEventListener("readystatechange", onReadyStateComplete);
      loadingCover.style.width = "75%";
    }
  }
  function onCeciAppReady() {
    window.removeEventListener("CeciAppReady", onCeciAppReady);
    loadingCover.style.width = "50%";
  }
  function onCeciAppAttached() {
    window.removeEventListener("CeciAppAttached", onCeciAppAttached);
    loadingCover.style.width = "25%";
  }
  function onPolymerReady() {
    window.removeEventListener("polymer-ready", onPolymerReady);
    loadingCover.style.width = "0%";
  }
  document.addEventListener("readystatechange", onReadyStateComplete);
  window.addEventListener("CeciAppReady", onCeciAppReady);
  window.addEventListener("CeciAppAttached", onCeciAppAttached);
  window.addEventListener("polymer-ready", onPolymerReady);
}());
