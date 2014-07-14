define(
  ["jquery", "tutorial/index", "text!/tutorial/intro.html", "designer/component-tray"],
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

    var content = $(TutorialSteps).children().toArray();

    var Intro = function() {
      return new Tutorial([
        {
          content: $('#welcome', TutorialSteps),
          position: {
            my: "center",
            at: "center",
            of: document.querySelector('ceci-app'),
            using: matchTarget
          }
        },
        {
          content: $('#bricks', TutorialSteps),
          position: {
            my: "left top",
            at: "right+20 top+50",
            of: $('.tray')
          },
          dialogClass: "tutorial-dialog-arrow tutorial-dialog-arrow-left"
        },
        {
          content: $('#customize', TutorialSteps),
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
          content: $('#project-settings', TutorialSteps),
          position: {
            my: "right top",
            at: "left-20 top+50",
            of: $('.right-column')
          },
          dialogClass: "tutorial-dialog-arrow tutorial-dialog-arrow-right",
          init: function() {
            var tab = "project-settings";
            //From js/modes.js changeEditableTab()
            $(".tray-tabs").find("a").removeClass("selected-tab");
            $(".tray-tabs [tab='"+tab+"']").addClass("selected-tab");
            $(".tab-sections .section").hide();
            $(".tab-sections .section-" + tab).show();
            $(".tab-sections .section-" + tab + " textarea").focus();
            if(tab == "view-source"){
            } else {
              if($(".right-column").not(".remix-mode").length == 1){
              }
            }
          }
        },
        {
          content: $("#pages", TutorialSteps),
          position: {
            my: "center top",
            at: "center bottom+20",
            of: $('.add-card')
          },
          dialogClass: "tutorial-dialog-arrow tutorial-dialog-arrow-top",
        },
        {
          content: $("#channels", TutorialSteps),
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
          content: $("#colors", TutorialSteps),
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
          content: $("#end", TutorialSteps),
          position: {
            my: "center",
            at: "center",
            of: document.querySelector('ceci-app'),
            using: matchTarget
          },
          init: function() {
            var _this = this;
            console.log('xxx', _this);
            setTimeout(function() {
              $(document).one("click", function () {
                _this.next();
              });
            }, 0);
          }
        }
      ]);
    }

    return Intro;
  }
);
