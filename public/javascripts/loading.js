(function() {
  var loadingCover = document.querySelector(".loading-cover");
  var steps = 5;
  var currentWeight = 100;
  var stepWeight = currentWeight / steps;

  function step() {
    currentWeight -= stepWeight;
    loadingCover.style.width = currentWeight + "%";
  }

  function onReadyStateComplete() {
    if (document.readyState === "complete") {
      document.removeEventListener("readystatechange", onReadyStateComplete);
      step();
    }
  }
  function onCeciAppCreated() {
    window.removeEventListener("CeciAppCreated", onCeciAppCreated);
    step();
  }
  function onCeciAppReady() {
    window.removeEventListener("CeciAppReady", onCeciAppReady);
    step();
  }
  function onCeciAppAttached() {
    window.removeEventListener("CeciAppAttached", onCeciAppAttached);
    step();
  }
  function onCeciAppDOMReady() {
    window.removeEventListener("CeciAppDOMReady", onCeciAppDOMReady);
    step();
  }
  document.addEventListener("readystatechange", onReadyStateComplete);
  window.addEventListener("CeciAppCreated", onCeciAppCreated);
  window.addEventListener("CeciAppReady", onCeciAppReady);
  window.addEventListener("CeciAppAttached", onCeciAppAttached);
  window.addEventListener("CeciAppDOMReady", onCeciAppDOMReady);
}());
