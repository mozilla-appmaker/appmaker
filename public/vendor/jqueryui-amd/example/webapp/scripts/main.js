/**
  * Ask for 'require', 'jquery' and 'jqueryui/tabs' as dependencies.
  *
  * 'require' is asked for as best practice, since it used inside the
  * require callback to dynamically load the datepicker. Since 'require'
  * is a module (provided by RequireJS), it is passed as the first argument
  * to the require callback. "req" is used as the function argument name
  * so the RequireJS optimizer will not pick up the dynamic load of
  * the 'jqueryui/datepicker', 'jqueryui/datepicker-fr' modules and
  * include them in the optimized build for main.js (see app.build.js
  * for more information on the optimized main.js build profile.)
  *
  * The require-jquery.js file registers jQuery as a module,
  * so this require callback will receive it as the second function
  * argument, since 'jquery' is the second dependency in the
  * dependency array.
  *
  * 'jquery/ui/tabs' does not export a module
  * value (it just augments jQuery), so it will not have a value for it
  * passed to the require callback. No need to assign a function argument
  * for it.
  */
require({
    //Set config for finding 'jqueryui'. The path is relative
    //to the location of require-jquery.js.
    paths: {
        jqueryui: 'jquery-ui-1.8.21/jqueryui'
    }
}, ['require', 'jquery', 'jqueryui/tabs'], function (req, $) {

    //Wait for dom ready before setting up widgets.
    $(function () {

        //Make the tabs.
        $('#tabs')
            .tabs({
                load: function (event, ui) {
                    //If the second tab is clicked, dynamically load
                    //the datepicker.
                    if (ui.index === 1) {
                        //Load the datepicker in French, on demand.
                        req(['jqueryui/datepicker', 'jqueryui/datepicker-fr'],
                            function () {
                                $('#datepicker').datepicker();
                            }
                        );
                    }
                }
            })
            //Make the tabs visible now that the widget has been instantiated.
            .removeClass('invisible');
    });
});
