define(
  ["jquery"],
  function($) {
    function Tutorial(steps, content) {
      var _this = this;
      var currentIdx;

      function show(idx) {
        var step = steps[idx];
        if (step.init) step.init.apply(_this);
        step.$content = $('[data-step="' + step.name + '"]', content);
        step.$content.dialog({
          dialogClass: [].concat("tutorial-dialog", step.dialogClass || []).join(' '),
          maxWidth: 300,
          modal: false,
          resizable: false,
          position: step.position
        });
      }

      function hide(idx) {
        var step = steps[idx];
        if (step.destroy) step.destroy.apply(_this);
        step.$content.dialog('destroy');
      }

      this.start = function() {
        currentIdx = 0;
        show(currentIdx);
      };

      this.next = function() {
        if (currentIdx >= steps.length) return;
        hide(currentIdx);
        currentIdx++;
        if (currentIdx < steps.length) show(currentIdx);
      }

      this.end = function() {
        hide(currentIdx);
        currentIdx = steps.length;
      };

      $('.tutorial-next', content).click(function () {
        _this.next();
        return false;
      });
      $('.tutorial-end', content).click(function () {
        _this.end();
        return false;
      });

      return this;
    };

    return Tutorial;
  }
);
