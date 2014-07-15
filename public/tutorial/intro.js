define(
  ["jquery", "tutorial/index", "text!tutorial/intro.html", "designer/component-tray"],
  function ($, Tutorial, TutorialSteps, Tray) {

    function matchTarget(offset, elements) {
      $(this).css({
        width: elements.target.width,
        height: elements.target.height,
        left: elements.target.left,
        top: elements.target.top,
        'box-sizing': 'border-box'
      });
    }

    var $content = $(TutorialSteps);
    $content.find('[data-controls]').remove().appendTo($content.find('[data-step]:not(:last-child)'));

    var Intro = function() {
      return new Tutorial([
        {
          name: "welcome",
          position: {
            my: "center",
            at: "center",
            of: document.querySelector('ceci-app'),
            using: matchTarget
          }
        },
        {
          name: "bricks",
          position: {
            my: "left top",
            at: "right+20 top+50",
            of: $('.tray')
          },
          dialogClass: "tutorial-dialog-arrow tutorial-dialog-arrow-left"
        },
        {
          name: "customize",
          position: {
            my: "right top",
            at: "left-20 top+50",
            of: $('.right-column')
          },
          dialogClass: "tutorial-dialog-arrow tutorial-dialog-arrow-right",
          init: function() {
            this.button = Tray.addComponentToCard('ceci-button');
          },
          destroy: function() {
            $(this.button).remove();
          }
        },
        {
          name: "project-settings",
          position: {
            my: "right top",
            at: "left-20 top+50",
            of: $('.right-column')
          },
          dialogClass: "tutorial-dialog-arrow tutorial-dialog-arrow-right",
          init: function() {
            var tab = "project-settings";
            // From designer/js/modes.js changeEditableTab()
            // FIXME: expose this method in modes.js and use it here
            $(".tray-tabs").find("a").removeClass("selected-tab");
            $(".tray-tabs [tab='"+tab+"']").addClass("selected-tab");
            $(".tab-sections .section").hide();
            $(".tab-sections .section-" + tab).show();
            $(".tab-sections .section-" + tab + " textarea").focus();
          }
        },
        {
          name: "pages",
          position: {
            my: "center top",
            at: "center bottom+20",
            of: $('.add-card')
          },
          dialogClass: "tutorial-dialog-arrow tutorial-dialog-arrow-top",
        },
        {
          name: "channels",
          position: {
            my: "right center",
            at: "left center",
            of: $(".container")
          },
          dialogClass: "tutorial-dialog-arrow tutorial-dialog-arrow-right",
          init: function() {
            this.hands = Tray.addComponentToCard('ceci-jazzhands');
            this.button = Tray.addComponentToCard('ceci-button');
          }
        },
        {
          name: "colors",
          position: {
            my: "right center",
            at: "left center",
            of: $(".container")
          },
          dialogClass: "tutorial-dialog-arrow tutorial-dialog-arrow-right",
          init: function() {
            this.drum = Tray.addComponentToCard('ceci-kickdrum');
            this.button2 = Tray.addComponentToCard('ceci-button');
            setTimeout(function() {
              $('ceci-button:last-of-type ceci-channel-menu[channeltype="broadcast"]')[0].toggleMenu();
            }, 100);
          },
          destroy: function() {
            $(this.button).remove();
            $(this.hands).remove();
            $(this.button2).remove();
            $(this.drum).remove();
          }
        },
        {
          name: "end",
          position: {
            my: "center",
            at: "center",
            of: document.querySelector('ceci-app'),
            using: matchTarget
          },
          init: function() {
            var _this = this;
            setTimeout(function() {
              $(document).one("click", function () {
                _this.next();
              });
            }, 0);
          }
        }
      ], $content);
    }

    return Intro;
  }
);
