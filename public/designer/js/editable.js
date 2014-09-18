/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(['jquery', 'inflector', 'l10n', 'colorpicker.core'], function ($, Inflector, L10n) {

  var urlComponent = window.CustomElements;

  /**
   * We build a label/input combination for quite a number of our
   * editables, so this function captures that build step.
   */
  var createLabeledTextfield = function(title, value) {
    var e = $('<div><label></label><input type="text"></input></div>');
    e.find("label").text(title);
    e.find("input").val(value);
    return e;
  };

  var editableTypeHandlers = {

    'multiple': function (element, attributeName, title, value, definition) {
      var options = JSON.parse(value);
      var e = $('<div><label></label><div class="option-list"></div></div>');
      e.find('label').text(title);

      $(options).each(function(key, value) {
        var input = $('<input type="text">').val(value);
        e.find('.option-list').append(input);
      });

      var add = $('<span class="add">Add Another</span>');
      e.append(add);

      e.on('click','.add', function(){
        e.find('.option-list').append('<input type="text">');
      });

      e.on('keyup', function(evt) {
        var options = [];
        e.find('input').each(function(){
          options.push($(this).val());
        });
        element.setAttribute(attributeName, JSON.stringify(options));
      });

      return e[0];
    },

    'select': function (element, attributeName, title, selectedValue, definition) {
      var e = $('<div><label></label><select></select></div>');
      e.find("label").text(title);

      var selectedIndex = false;
      var options = Object.keys(definition.options);

      $(options).each(function(idx, label){

        var value = definition.options[label] || label;
        var option = $("<option></option").text(label).val(value);
        e.find('select').append(option);
        if(value.toLowerCase() === selectedValue.toLowerCase()) {
          selectedIndex = idx;
        }
      });

      e.find('select > option:eq('+selectedIndex+')').attr('selected', true);
      e.on('change', function(evt) {
        element.setAttribute(attributeName, evt.target.value);
      });

      return e[0];
    },

    'text': function (element, attributeName, title, value, definition) {
      var e = createLabeledTextfield(title, value);

      e.on('input', function(evt) {
        element.setAttribute(attributeName, evt.target.value);
      });
      return e[0];
    },

    // FIXME: TODO: what makes this a collection? The code didn't make use of
    //              the "definition" variable at all. Do we still use this?
    'collection': function (element, attributeName, title, value, definition) {
      var e = $('<div><label></label><data-manager></data-manager></div>');
      e.find("label").text(title);
      var dataManager = e.find("data-manager")[0];
      dataManager.addEventListener('collectionchange', function(evt) {
        element.setAttribute(attributeName, evt.target.getAttribute("collection"));
      });
      dataManager.setAttribute("collection", value);
      return e[0];
    },

    'textarea': function (element, attributeName, title, value, definition) {
      var e = $('<div><label></label><textarea></textarea></div>');
      e.find("label").text(title);
      e.find("textarea").val(value);

      e.on('input', function(evt) {
        var text = evt.target.value;
        element.setAttribute(attributeName, text);
      });

      return e[0];
    },

    'number': function (element, attributeName, title, value, definition) {
      definition.step = definition.step || 1;
      var e = createLabeledTextfield(title, value);
      e.find("input").attr('type', 'number')
                     .attr('min', definition.min)
                     .attr('max', definition.max)
                     .attr('step', definition.step);

      e.on('change', function(evt) {
        var val = parseFloat(evt.target.value);
        if(val > definition.max) {
          val = definition.max;
        }
        if(val < definition.min) {
          val = definition.min;
        }
        $(e).find("input").val(val);
        element.setAttribute(attributeName, val);
      });
      return e[0];
    },

    'range': function (element, attributeName, title, value, definition) {
      var e = $('<div class="range"><label></label><input type="range"><span class="value"></span></div>');

      e.find("label").text(title);
      e.find("input").val(value)
                     .attr('min', definition.min)
                     .attr('max', definition.max);
      e.find("span").text(value);

      e.on('input', function(evt) {
        element.setAttribute(attributeName, evt.target.value);
        $(this).find(".value").text(evt.target.value);
      });
      e.on('change', function(evt) {
        element.setAttribute(attributeName, evt.target.value);
        $(this).find(".value").text(evt.target.value);
      });
      return e[0];
    },

    'boolean': function (element, attributeName, title, value, definition) {
      var e = $('<div><label></label></div>');
      e.find("label").text(title).append($('<input type="checkbox">'));

      if (value === true || value === 'true') {
        e.find("input").attr('checked','checked').attr('value', value);
      }

      e.on('change', function(evt) {
        evt.target.value = evt.target.value == 'true' ? 'false' : 'true';
        element.setAttribute(attributeName, evt.target.value == 'true' ? true : false);
      });

      return e[0];
    },

    'color': function (element, attributeName, title, value, definition) {
      var e = $('<div><label></label><div class="colorpicker"><div class="swatch"></div><input type="text"></div></div>');

      e.find('label').text(title);

      var input = e.find('input');
      var swatch = e.find('.swatch');

      input.val(value);
      swatch.css('background', value);

      var oldColor;

      input.colorpicker({
        init: function (event, color) {
        },
        select: function (event, color) {
          input[0].value = '#' + color.formatted;
          swatch.css('background', '#' + color.formatted);
          element.setAttribute(attributeName, '#' + color.formatted);
        },
        open: function (event, color) {
          oldColor = input[0].value;
        },
        cancel: function (event, color) {
          element.setAttribute(attributeName, oldColor);
        }
      });

      swatch.on("click",function(){
        input.focus();
        return false;
      });

      e.on('change', function (evt) {
        element.setAttribute(attributeName, evt.target.value);
      });

      return e[0];
    }
  };

  var editable = {
    getAttributeUIElement: function (element, attributeName, definition) {
      // Use element[attributeName] instead of element.getAttribute(attributeName) because Polymer's
      // DOM might not reflect most recent attribute changes yet.
      var value = element[attributeName];
      value = (value !== null && value !== undefined) ? value : '';
      var title = L10n.get(element.localName + '/attributes/' + attributeName + '/label')
                  || definition.label
                  || Inflector.titleize(Inflector.underscore(attributeName));
      var handler = editableTypeHandlers[definition.editable] || editableTypeHandlers.text;
      return handler(element, attributeName, title, value, definition);
    },
    removeAttributes: function () {
      $('.editable-attributes').empty();
      $('.editable-header .name').empty();
      $('.editable-header .description').empty();
    },
    clearAttributes : function(){
      $('.section-customize').hide();
    },
    displayAttributes: function (element) {
      $('.section-customize').show();
      $('.editable-header > .name').text(element.ceci.name);

      var description = L10n.get(element.localName + '/description') || element.ceci.description;
      $('.editable-header > .description').text(description);

      var attributeList = $('.editable-attributes');
      attributeList.empty();

      var attributes = element.ceci.attributes;

      Object.keys(attributes).forEach(function (attributeName) {
        var attributeDefinition = attributes[attributeName];
        if (!attributeDefinition.editable) return;
        var uiElement = editable.getAttributeUIElement(element, attributeName, attributeDefinition);
        attributeList.append(uiElement);
      });
    }
  };

  return editable;

});
