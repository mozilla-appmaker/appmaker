define(['inflector'], function (Inflector) {
  var editableTypeHandlers = {
    'multiple': function (element, attributeName, title, value) {
      var options = JSON.parse(value);
      var e = $("<div>" +
        "<label>"+title + "</label>" +
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
    'select': function (element, attributeName, title, value) {
      var e = $("<div><label>" +
        title +
        "</label><select type=\"text\" value=\"" +
        value +
        "\"> "+
        "</select></div>"
      );
      $(definition.options).each(function(i,k){
        var option = document.createElement("option");
        $(option).attr("value",k);
        $(option).text(k);
        e.find("select").append(option);
      });
      e.find("select").val(value);
      e.on("change", function(evt) {
        element.setAttribute(attributeName, evt.target.value);
      });
      return e[0];
    },
    'text': function (element, attributeName, title, value) {
      var e = $("<div><label>" +
        title +
        "</label><input type=\"text\" value=\"" +
        value +
        "\"></input></div>"
      );
      e.on("keyup", function(evt) {
        console.log(attributeName);
        element.setAttribute(attributeName, evt.target.value);
      });
      return e[0];
    },
    'number': function (element, attributeName, title, value) {
      var e = $(
        "<div><label>" +
        title +
        "</label><input type=\"number\" min=\"" +
        definition.min +
        "\" max=\"" +
        definition.max +
        "\" value=\"" +
        value + "\" /></div>"
      );
      e.on("change", function(evt) {
        element.setAttribute(attributeName, evt.target.value);
      });
      return e[0];
    },
    'boolean': function (element, attributeName, title, value) {
      var e = $(
        "<div><label>" +
        "<input type=\"checkbox\" " +
        (value == "true" ? " checked=\"true\" " : "") + "\" value=\"" +
        value + "\" />" + title + " </div>"
      );
      e.on("change", function(evt) {
        evt.target.value = evt.target.value == "true" ? "false" : "true";
        element.setAttribute(attributeName, evt.target.value == "true" ? true : false);
      });
      return e[0];
    }
  };

  var editable = {
    getAttributeUIElement: function (element, attributeName, definition) {
      var value = element.getAttribute(attributeName);
      value = value !== null ? value : '';

      var title = definition.name || Inflector.titleize(Inflector.underscore(attributeName));

      if (editableTypeHandlers[definition.type]) {
        return editableTypeHandlers[definition.type](element, attributeName, title, value);
      }
      else {
        return $("<span>" + definition.type + " not implemented yet</span>");
      }
    },
    displayAttributes: function (element) {

      var attributeList = $(".editable-attributes");

      attributeList.html("");

      var attributes = Object.keys(element.ceci.editable);

      attributes.forEach(function (attribute) {
        var definition = element.ceci.editable[attribute];
        var uiElement = editable.getAttributeUIElement(element, attribute, definition);
        attributeList.append(uiElement);
      });

      var editables = $(".editable-section");
      editables.show();
    }
  };

  return editable;

});
