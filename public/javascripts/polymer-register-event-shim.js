/**
 * For the design view, we want to compile a list of known
 * custom elements, which we can then tie into the designer
 * component-tray. This requires buffering new elements
 * and making sure there is a place for the component-tray
 * to ask about which components are new.
 */
(function() {
  var _oldFn = HTMLElement.register;
  HTMLElement.register = function() {
    _oldFn.apply(HTMLElement, arguments);
    var def = { name: arguments[0], prototype: arguments[1] };
    var evt = new CustomEvent("polymer-element-defined", { "detail": def });
    window.dispatchEvent(evt);
  };
}());
