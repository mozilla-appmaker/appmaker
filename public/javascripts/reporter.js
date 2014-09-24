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
     * Report an error!
    */
    errorReport: function() {
      this.report("error",arguments);
    },

    /**
     * Report a success!
    */
    successReport: function() {
      this.report("success",arguments);
    },

    report : function(type,arguments){
      var list = Array.prototype.slice.call(arguments).filter(function(v) {
        return !!v;
      }).map(function(v) {
        if(typeof v === "string") return v;
        return JSON.stringify(v,null,2);
      });
      if(list.length === 0) {
        console.log("report attempted with exclusively empty arguments. Stack trace:");
        console.trace();
      } else {
        var message = list.join("\n");
        var event = new CustomEvent("notification",
          { detail: {
              message: message,
              type: type
          }});
        window.dispatchEvent(event);
      }
    }
  };
});
