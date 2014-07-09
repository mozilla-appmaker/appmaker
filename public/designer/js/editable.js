/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(['inflector', 'l10n', 'colorpicker.core'], function (Inflector, L10n) {
  var urlComponent = window.CustomElements;
  var editableTypeHandlers = {
    'multiple': function (element, attributeName, title, value, definition) {
      var options = JSON.parse(value);
      var e = $('<div>' +
        '<label>'+ title + '</label>' +
        '<div class="option-list"></div>' +
        '</div>'
      );

      for (var key in options) {
        e.find('.option-list').append('<input type="text" value="' +options[key]+'" />');
      }

      var add = $('<a class="add" href="#">Add Another</a>');
      e.append(add);

      e.on('click','.add', function(){
        e.find('.option-list').append('<input type="text" value="" />');
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
    'select': function (element, attributeName, title, value, definition) {
      var e = $('<div><label>' +
        title +
        '</label><select type="text" value="' +
        value +
        '"> '+
        '</select></div>'
      );
      $(definition.options).each(function(i,k){
        var option = document.createElement('option');
        $(option).attr('value', k);
        $(option).text(k);
        e.find('select').append(option);
      });
      e.find('select').val(value);
      e.on('change', function(evt) {
        element.setAttribute(attributeName, evt.target.value);
      });
      return e[0];
    },
    'text': function (element, attributeName, title, value, definition) {
      var e = $('<div><label>' +
        title +
        '</label><input type="text" value="' +
        value +
        '"></input></div>'
      );
      e.on('keyup', function(evt) {
        element.setAttribute(attributeName, evt.target.value);
      });
      return e[0];
    },
    'collection': function (element, attributeName, title, value, definition) {
      var e = $('<div><label>' +
        title +
        '</label><input type="text" value="' +
        value +
        '"></input></div>'
      );
      e.on('change', function(evt) {
        element.setAttribute(attributeName, evt.target.value);
      });
      return e[0];
    },
    'number': function (element, attributeName, title, value, definition) {
      var e = $(
        '<div><label>' +
        title +
        '</label><input type="number" min="' +
        definition.min +
        '" max="' +
        definition.max +
        '" value="' +
        value + '" /></div>'
      );
      e.on('change', function(evt) {
        element.setAttribute(attributeName, evt.target.value);
      });
      return e[0];
    },
    'range': function (element, attributeName, title, value, definition) {
      var e = $(
        '<div><label>' +
        title +
        '</label><input type="range" min="' +
        definition.min +
        '" max="' +
        definition.max +
        '" value="' +
        value + '" /></div>'
      );
      e.on('change', function(evt) {
        element.setAttribute(attributeName, evt.target.value);
      });
      return e[0];
    },
    'boolean': function (element, attributeName, title, value, definition) {
      var e = $(
        '<div><label>' +
        '<input type="checkbox" ' +
        (value === true || value === 'true' ? ' checked="true" ' : '') + '" value="' +
        value + '" />' + title + ' </div>'
      );
      e.on('change', function(evt) {
        evt.target.value = evt.target.value == 'true' ? 'false' : 'true';
        element.setAttribute(attributeName, evt.target.value == 'true' ? true : false);
      });
      return e[0];
    },
    'color': function (element, attributeName, title, value, definition) {
      var e = $(
        '<div><label>' + title + '</label>' +
        '<div class="colorpicker"><div class="swatch" style="background: '+value+'"></div><input type="text" value="' + value + '"/></div>' +
        '</div>'
      );

      var input = e.find('input');
      var swatch = e.find('.swatch');
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

      value = value !== null ? value : '';

      var title = L10n.get(element.localName + '/attributes/' + attributeName + '/label')
        || definition.label
        || Inflector.titleize(Inflector.underscore(attributeName));

      var handler = editableTypeHandlers[definition.editable] || editableTypeHandlers.text;
      return handler(element, attributeName, title, value, definition);
    },
    removeAttributes: function () {
      $('.editable-attributes').html('');
      $('.editable-header .name').html('');
    },
    displayAttributes: function (element) {
      $('.editable-header > .name').html(element.ceci.name);

      var attributeList = $('.editable-attributes');

      attributeList.html('');

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
