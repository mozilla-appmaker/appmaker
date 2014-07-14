define(
  ["jquery"],
  function($) {
    var Tutorial = function Tutorial(steps) {
      var _this = this;
      var currentIdx;

      function show(idx) {
        var step = steps[idx];
        if (step.init) step.init.apply(_this);
        $(step.content).dialog({
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
        $(step.content).dialog('destroy');
      }

      this.start = function() {
        currentIdx = 0;
        show(currentIdx);
      };

      this.next = function() {
        hide(currentIdx);
        currentIdx++;
        if (currentIdx < steps.length) show(currentIdx);
      }

      this.end = function() {
        hide(currentIdx);
      };

      var _this = this;
      steps.forEach(function(step, i, arr) {
        $('.next', step.content).click(_this.next.bind(_this));
        $('.skip', step.content).click(_this.end.bind(_this));
      });

      return this;
    };

    return Tutorial;
  }
);
