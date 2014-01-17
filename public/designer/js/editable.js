/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(['inflector', 'colorpicker.core', 'l10n'], function (Inflector, ColorPickerDummy, L10n) {
  var urlComponent = window.CustomElements;
  var editableTypeHandlers = {
    'multiple': function (element, attributeName, title, value, definition) {
      var labelName = L10n.get(element.localName+"/attributes/"+attributeName+"/label") || title;
      var eValue = L10n.get(element.localName+"/attributes/"+attributeName) || value;
      var options = JSON.parse(value);
      var e = $("<div>" +
        "<label>"+ labelName + "</label>" +
        "<div class=\"option-list\"></div>" +
        "</div>"
      );

      for (var key in options) {
        e.find(".option-list").append("<input type=\"text\" value=\"" +options[key]+"\" />");
      }

      var add = $("<a class=\"add\" href=\"#\">Add Another</a>");
      e.append(add);

      e.on("click",".add", function(){
        e.find(".option-list").append("<input type=\"text\" value=\"\" />");
      });

      e.on("keyup", function(evt) {
        var options = [];
        e.find("input").each(function(){
          options.push($(this).val());
        });
        element.setAttribute(attributeName, JSON.stringify(options));
      });
      return e[0];
    },
    'select': function (element, attributeName, title, value, definition) {
      var labelName = L10n.get(element.localName+"/attributes/"+attributeName+"/label") || title;
      var eValue = L10n.get(element.localName+"/attributes/"+attributeName) || value;
      var e = $("<div><label>" +
        labelName +
        "</label><select type=\"text\" value=\"" +
        eValue +
        "\"> "+
        "</select></div>"
      );
      $(definition.options).each(function(i,k){
        var option = document.createElement("option");
        $(option).attr("value", k);
        $(option).text(k);
        e.find("select").append(option);
      });
      e.find("select").val(value);
      e.on("change", function(evt) {
        element.setAttribute(attributeName, evt.target.value);
      });
      return e[0];
    },
    'text': function (element, attributeName, title, value, definition) {
      var labelName = L10n.get(element.localName+"/attributes/"+attributeName+"/label") || title;
      var eValue = L10n.get(element.localName+"/attributes/"+attributeName) || value;
      var e = $("<div><label>" +
        labelName +
        "</label><input type=\"text\" value=\"" +
        eValue +
        "\"></input></div>"
      );
      e.on("keyup", function(evt) {
        element.setAttribute(attributeName, evt.target.value);
      });
      return e[0];
    },
    'number': function (element, attributeName, title, value, definition) {
      var labelName = L10n.get(element.localName+"/attributes/"+attributeName+"/label") || title;
      var eValue = L10n.get(element.localName+"/attributes/"+attributeName) || value;
      var e = $(
        "<div><label>" +
        labelName +
        "</label><input type=\"number\" min=\"" +
        definition.min +
        "\" max=\"" +
        definition.max +
        "\" value=\"" +
        eValue + "\" /></div>"
      );
      e.on("change", function(evt) {
        element.setAttribute(attributeName, evt.target.value);
      });
      return e[0];
    },
    'boolean': function (element, attributeName, title, value, definition) {
      var labelName = L10n.get(element.localName+"/attributes/"+attributeName+"/label") || title;
      var eValue = L10n.get(element.localName+"/attributes/"+attributeName) || value;
      var e = $(
        "<div><label>" +
        "<input type=\"checkbox\" " +
        (value == "true" ? " checked=\"true\" " : "") + "\" value=\"" +
        eValue + "\" />" + labelName + " </div>"
      );
      e.on("change", function(evt) {
        evt.target.value = evt.target.value == "true" ? "false" : "true";
        element.setAttribute(attributeName, evt.target.value == "true" ? true : false);
      });
      return e[0];
    },
    'color': function (element, attributeName, title, value, definition) {
      var labelName = L10n.get(element.localName+"/attributes/"+attributeName+"/label") || title;
      var eValue = L10n.get(element.localName+"/attributes/"+attributeName) || value;
      var e = $(
        '<div><label>' + labelName + '</label>' +
        '<input type="text" value="' + eValue + '">' +
        '</div>'
      );

      var input = e.find('input');
      var oldColor;

      input.colorpicker({
        init: function (event, color) {
        },
        select: function (event, color) {
          input[0].value = '#' + color.formatted;
          element.setAttribute(attributeName, '#' + color.formatted);
        },
        close: function (event, color) {
        },
        ok: function (event, color) {
        },
        open: function (event, color) {
          oldColor = input[0].value;
        },
        cancel: function (event, color) {
          element.setAttribute(attributeName, oldColor);
        }
      });

      e.on("change", function (evt) {
        element.setAttribute(attributeName, evt.target.value);
      });

      return e[0];
    }
  };

  var editable = {
    getAttributeUIElement: function (element, attributeName, definition) {
      var value = element.getAttribute(attributeName);
      value = value !== null ? value : '';

      var title = definition.label || Inflector.titleize(Inflector.underscore(attributeName));
      var handler = editableTypeHandlers[definition.editable] || editableTypeHandlers.text;
      return handler(element, attributeName, title, value, definition);
    },
    displayAttributes: function (element) {
      var attributeList = $(".editable-attributes");

      attributeList.html("");

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
