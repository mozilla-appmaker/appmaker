define([], function () {
  var master = document.getElementById('publish-pane');
  var panel = document.getElementById('publish-pane-panel');
  var content = document.getElementById('publish-pane-panel-content');
  var close = document.getElementById('close-publish-pane-panel');
  var email = document.getElementById('publish-pane-panel-email');
  var appurl = document.getElementById('applink');
  var mailButton = document.querySelector('#publish-pane-button');
  var mailNotice = document.querySelector('.mail-notice');
  var mailError = document.querySelector('.mail-error');
  var mailLink = document.querySelector('.mail-link');
  var appQRCode = document.querySelector('.qrcode[data-qrcode-for="app"]');
  var instsallQRCode = document.querySelector('.qrcode[data-qrcode-for="install"]');

  function showQRCode (kind) {
    var qrCodeTaggedElements = document.querySelectorAll('[data-qrcode-for]');

    Array.prototype.forEach.call(qrCodeTaggedElements, function (qrCode) {
      if (qrCode.getAttribute('data-qrcode-for') === kind) {
        qrCode.classList.add('on');
      }
      else {
        qrCode.classList.remove('on');
      }
    });
  }

  function closePublishPanel (e) {
    panel.classList.remove('expanded');
    content.classList.add('hidden');
    master.classList.add('hidden');
  }

  close.addEventListener("click", closePublishPanel);

  function hideEmailInput() {
    mailButton.disabled = true;
    email.disabled = true;
    mailLink.classList.add('faded');
  }

  function showEmailInput() {
    mailButton.disabled = false;
    email.disabled = false;
    mailLink.classList.remove('faded');
  }

  function onError() {
    mailError.classList.add('toggled');
    showEmailInput();
  }

  return {
    show: function(name, data) {
      var qrCodeLinks = document.querySelectorAll('a[data-qrcode-for]');

      Array.prototype.forEach.call(qrCodeLinks, function (a) {
        a.onclick = function (e) {
          showQRCode(a.getAttribute('data-qrcode-for'));
        };
      });

      showQRCode('install');

      master.classList.remove('hidden');
      showEmailInput();
      setTimeout(function() {
        panel.classList.add('expanded');
        content.classList.remove('hidden');
        mailButton.disabled = false;
        email.disabled = false;
        mailButton.classList.remove('fadeout');
        email.classList.remove('fadeout');
        email.value = '';
        appurl.setAttribute('href', data.install);
        appurl.innerHTML = data.install;

        instsallQRCode.innerHTML = '';
        appQRCode.innerHTML = '';

        new QRCode(instsallQRCode, data.install);
        new QRCode(appQRCode, data.app);

        mailNotice.classList.remove("toggled");

        (function() {
          var mailButton = document.querySelector('#publish-pane-button');
          mailButton.onclick = function (e) {
            var address = email.value.trim();

            // If the address is blank, use the address specified by webmaker auth.
            // See user-state.html for more.
            if (address.length === 0) {
              address = email.getAttribute('placeholder');
            }

            hideEmailInput();
            mailError.classList.remove('toggled');

            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'notify?appURL=' + encodeURIComponent(data.install) + '&email=' + address, true);
            xhr.onerror = function (e) {
              console.error(e);
              onError();
            };
            xhr.onreadystatechange = function (e) {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  mailNotice.classList.add('toggled');
                }
                else {
                  console.error(e);
                  onError();
                }
              }
            };
            xhr.send(null);
          };
        }());
      }, 50);
    }
  };
});

