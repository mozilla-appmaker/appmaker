define(['jquery', 'list', 'fuzzySearch', 'analytics'], function ($, List, Fuzzy, analytics) {
  return {
    ready: function (options, mobile) {
      var that = this;
      mobile = !!mobile;

      var $currentLang = $('#current-language');
      var $languageList = $('#list-of-languages');
      var $languageSearch = $('#language-search');
      var $emptyMessage = $('#empty-message');
      var $clickLang = $('.langList');
      var cssOptions = {};

      $clickLang.click(function () {
        analytics.event('Language Picked', {
          label: $(this).data().value
        });
        that.langRedirector($(this).data().value);
      });

      var fuzzy = new Fuzzy({
        threshold: 1
      });
      var langs = new List('list-of-languages', {
        valueNames: ['localized-name', 'english-name'],
        plugins: [fuzzy]
      });

      $currentLang.on('click', function (e) {
        analytics.event('Language Picker Opened');
        if ($(window).width() < 500 && !mobile) {
          return;
        }
        e.preventDefault();
        var offset = $currentLang.offset();

        if ($languageList.is(':visible')) {
          $languageList.fadeOut(100);
          return;
        }

        if(options.position === "bottom" && options.arrow === "right") {
          if($languageList.attr("dir") === "rtl") {
            cssOptions = {
              top: (offset.top - 18) + 'px',
              left: (offset.left + $currentLang.width() + 25) + 'px'
            }
          } else {
            cssOptions = {
              top: (offset.top - 18) + 'px',
              right: (offset.left + $currentLang.width() + 25) + 'px'
            }
          }
          $languageList.addClass("bottomRight");
        } else if(options.position === "top" && options.arrow === "left") {
          if($languageList.attr("dir") === "rtl") {
            cssOptions = {
              bottom: '-25px',
              right: $currentLang.width() + 18 + 'px'
            }
          } else {
            cssOptions = {
              bottom: '-25px',
              left: $currentLang.width() + 18 + 'px'
            }
          }
          $languageList.addClass("topLeft");
        } else if(options.position === "bottom" && options.arrow === "top") {
          cssOptions = {
            top: offset.top + 5 + 'px',
            right: offset.left/-10 + 'px'
          }
          $languageList.addClass("bottomTop");
        }
        if(options.nav !== undefined && !options.nav) {
          cssOptions.top = offset.top/10 + 'px';
        }
        $languageList.css(cssOptions).fadeIn(100);

        $languageSearch.val('');
        langs.search();

        $(document).on('mousedown', function hideLanguageList() {
          $languageList.fadeOut(100);
          $(document).off('mousedown', hideLanguageList);
        });

      });

      $languageList.on('mousedown', function (e) {
        e.stopPropagation();
      });

      if ($languageList.length) {
        $languageSearch.on('keyup', function (e) {
          var $firstResult;
          if (e.which === 13) {
            $firstResult = $languageList.find('li > a:first-child');
            if ($firstResult.length) {
              $(this).val($firstResult.find('.localized-name').data('hint'));
              window.location = $firstResult[0].href;
              return;
            } else {
              return;
            }
          }
          langs.fuzzySearch.search(this.value);
          if (!langs.visibleItems.length) {
            $emptyMessage.show();
          } else {
            $emptyMessage.hide();
          }
        });
      }
    },
    langRedirector: function (selectedLang) {
      var matchesLang,
        href = document.location.pathname,
        lang = document.querySelector("html").lang,
        supportedLanguages = $('*[data-supported]').data('supported');
        // matches any of these:
        // `en`, `en-us`, `en-US` or `ady`
        matches = href.match(/([a-z]{2,3})([-]([a-zA-Z]{2}))?/);

      if (matches) {
        if (matches[1] && matches[2]) {
          matchesLang = matches[1].toLowerCase() + matches[2].toUpperCase();
        } else {
          matchesLang = matches[1].toLowerCase();
        }
      }
      // if the selected language is match to the language in the header
      if (selectedLang === lang) {
        return;
        // check if we have any matches and they are exist in the array we have
      } else if ((matches && matches[0]) && supportedLanguages.indexOf(matchesLang) !== -1) {
        href = href.replace(matches[0], selectedLang);
        window.location = href;
      } else {
        window.location = "/" + selectedLang + href;
      }
    }
  }
});
