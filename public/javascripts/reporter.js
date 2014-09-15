define(function() {

  var console = window.console;

  return {

    /**
     * report to the user. Right now this simply alerts by
     * wrapping this.errorReport
     */
    confirm: function(label) {
      return confirm(label);
    },

    /**
     * report to console. Right now this simply wraps console.log
     */
    consoleReport: function() {
      Function.apply.call(console.log, console, arguments);
    },

    /**
     * report to the user. Right now this simply alerts by
     * wrapping this.errorReport
     */
    notify: function() {
      this.errorReport.call(arguments);
    },

    /**
     * report an error. Right now this generates an alert, but
     * having a single location for it means we can easily slot
     * in a dialog or modal to notify the user of these errors.
     */
    errorReport: function() {
      var list = Array.prototype.slice.call(arguments).filter(function(v) {
        return !!v;
      }).map(function(v) {
        if(typeof v === "string") return v;
        return JSON.stringify(v,null,2);
      });
      if(list.length === 0) {
        console.error("report attempted with exclusively empty arguments. Stack trace:");
        console.trace();
      } else {
        window.alert(list.join("\n"));
      }
    }

  };
});
