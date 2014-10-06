/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var jQuery = require('jquery');
var Inflector = require('inflection');
var L10n = require('vendor/l10n');

var $ = jQuery;

require('vendor/jquery-ui')(jQuery);
require('vendor/colorpicker')(jQuery);

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

  'sprite': function (element, attributeName, title, value, definition) {

    var scale = definition.scale || 1;
    var mainContainer = document.createElement("div");
    var previewCanvas = document.createElement("canvas");
    var dataInput = document.createElement("input");
    var expandIcon = document.createElement("span");
    expandIcon.classList.add("icon");
    expandIcon.classList.add("icon-angle-down");
    expandIcon.classList.add("expand-sprite-editor");
    dataInput.type = "text";
    var height = 16 * scale;
    var width = 16 * scale;
    previewCanvas.height = height;
    previewCanvas.width = width;
    var previewCtx = previewCanvas.getContext("2d");
    var container = document.createElement("div");
    var label = document.createElement("label");
    label.textContent = title;
    container.classList.add("sprite-container");
    var grid = document.createElement("div");
    grid.classList.add("grid-container");
    var colourContainer = document.createElement("div");
    var toolBar = document.createElement("div");
    toolBar.classList.add("sprite-toolbar");
    colourContainer.classList.add("colour-container");
    var clearPalette = document.createElement("span");
    clearPalette.classList.add("clear-palette");
    toolBar.appendChild(clearPalette);
    var redLine = document.createElement("span");
    clearPalette.appendChild(redLine);
    var selectedColor = "";

    clearPalette.addEventListener("mousedown", function() {
      clearPalette.classList.add("selected");
      selectedColor = "";
      var selectedPalette = colourContainer.querySelector(".colour-div.selected");
      if (selectedPalette) {
        selectedPalette.classList.remove("selected");
      }
    });

    var customColours = {
      "rgb(222, 3, 16)": "",
      "rgb(232, 47, 10)": "",
      "rgb(239, 81, 6)": "",
      "rgb(248, 115, 3)": "",
      "rgb(248, 146, 0)": "",
      "rgb(204, 161, 8)": "",
      "rgb(160, 175, 14)": "",
      "rgb(120, 188, 19)": "",
      "rgb(86, 187, 45)": "",
      "rgb(61, 172, 93)": "",
      "rgb(37, 156, 139)": "",
      "rgb(13, 139, 184)": "",
      "rgb(19, 115, 210)": "",
      "rgb(57, 81, 210)": "",
      "rgb(95, 48, 210)": "",
      "rgb(138, 11, 210)": ""
    };

    var defaultColours = Object.keys(customColours);

    // Need to do this on demand
    function createColours() {
      mainContainer.appendChild(colourContainer);

      defaultColours.forEach(function(value, index) {

        var colourPicker = document.createElement("input");
        var colourDiv = document.createElement("div");
        var colourPickerDisplay = document.createElement("div");
        colourDiv.classList.add("colour-div");
        colourPicker.type = "color";
        colourPickerDisplay.classList.add("sprite-color-picker");
        colourPickerDisplay.addEventListener("click", function() {
          colourPicker.click();
        });

        colourDiv.style.backgroundColor = value;
        var parts = value.replace("rgb(", "").replace(")", "").split(", ");
        var colourHash = "#" + parts.map(function(c) {
          c = parseInt(c,10).toString(16);
          if (c.length <= 1) {
            c = "0" + c;
          }
          return c;
        }).join("");
        colourPicker.value = colourHash;
        function onClick() {
          selectedColor = colourDiv.style.backgroundColor;
          var selectedPalette = colourContainer.querySelector(".colour-div.selected");
          if (selectedPalette) {
            selectedPalette.classList.remove("selected");
          } else {
            clearPalette.classList.remove("selected");
          }
          colourDiv.classList.add("selected");
        }
        colourDiv.addEventListener("mousedown", onClick);

        if (index === 0) {
          onClick();
        }

        colourPicker.addEventListener("change", function() {
          var div = document.createElement("div");
          div.style.backgroundColor = this.value;
          colourDiv.style.backgroundColor = this.value;
          selectedColor = div.style.backgroundColor;
          var selectedPalette = colourContainer.querySelector(".colour-div.selected");
          if (selectedPalette) {
            selectedPalette.classList.remove("selected");
          }
          colourDiv.classList.add("selected");
        });
        colourDiv.appendChild(colourPickerDisplay);
        colourContainer.appendChild(colourDiv);
      });
    }

    var isMouseDown = false;
    function onPixelMouseup() {
	    isMouseDown = false;
      dataInput.classList.remove("error");
      var newData = previewCanvas.toDataURL();
      dataInput.value = newData;
      window.removeEventListener("mouseup", onPixelMouseup);
      element.setAttribute(attributeName, newData);
    }
    function paintPixel(block, row, col) {
      var row = row || block.parentNode.getAttribute("data-tile-editor-row");
      var col = col || block.getAttribute("data-tile-editor-col");
      if (!selectedColor) {
        block.style.backgroundColor = "rgba(0, 0, 0, 0)";
        previewCtx.clearRect(col*scale,row*scale,scale,scale);
      } else {
        block.style.backgroundColor = selectedColor;
        previewCtx.fillStyle = selectedColor;
        previewCtx.fillRect(col*scale,row*scale,scale,scale);
      }
    }
    function onPixelMousedown(e) {
      e.preventDefault();
      isMouseDown = true;
      window.addEventListener("mouseup", onPixelMouseup);
      paintPixel(this);
    }
    function onPixelMouseover(e) {
      if (!isMouseDown) {
        return;
      }
      paintPixel(this);
    }

    function fillGrid() {
      var imgd = previewCtx.getImageData(0, 0, previewCanvas.width, previewCanvas.height);
      var gridElement = mainContainer.querySelector(".grid-container");

      if (!gridElement) {
        return;
      }

      for (var x = 0; x < imgd.width; x+=scale) {
        var realX = x/scale;
        for (var y = 0; y < imgd.height; y+=scale) {
          var realY = y/scale;
          var i = x*4+y*4*imgd.width;
          var targetRow = gridElement.querySelector('*[data-tile-editor-row="'+ (realY) + '"]');
          var targetCol = targetRow.querySelector('*[data-tile-editor-col="'+ (realX) + '"]');
          // for now convert transparent to white
          if (imgd.data[i+3] === 0) {
            targetCol.style.backgroundColor = "rgba(0, 0, 0, 0)";
          } else {
            var red = imgd.data[i];
            var green = imgd.data[i+1];
            var blue = imgd.data[i+2];
            var alpha = imgd.data[i+3];
            var colour = "rgb("+red+", "+green+", "+blue+")";
            if (imgd.data[i+3] === 0) {
              colour = "rgba("+red+", "+green+", "+blue+", " + alpha + ")";
            }
            if (!customColours[colour]) {
              customColours[colour] = colour;
              defaultColours.pop();
              defaultColours.unshift(colour);
            }
            targetCol.style.backgroundColor = colour;
          }
        }
      }
    }

    function fillPreview(data, callback) {
      var image = document.createElement("img");
      image.onload = function() {
        dataInput.classList.remove("error");
        previewCtx.drawImage(image,0,0);
        callback && callback();
      };
      image.onerror = function() {
        dataInput.classList.add("error");
      };
      if (!data) {
        dataInput.classList.remove("error");
        callback && callback();
        return;
      }
      image.src = data;
    }

    fillPreview(value);
    dataInput.value = value;
    dataInput.addEventListener("change", function() {
      var value = this.value;
      previewCtx.clearRect(0, 0, width, height);
      fillPreview(value, function() {
        fillGrid();
      });
      element.setAttribute(attributeName, this.value);
    });

    container.appendChild(label);
    container.appendChild(previewCanvas);
    container.appendChild(expandIcon);
    mainContainer.appendChild(toolBar);
    container.appendChild(mainContainer);

    function onExpandIconClick() {
      if (expandIcon.classList.contains("icon-angle-down")) {
        mainContainer.classList.remove("hidden");
        expandIcon.classList.remove("icon-angle-down");
        expandIcon.classList.add("icon-angle-up");
      } else {
        mainContainer.classList.add("hidden");
        expandIcon.classList.add("icon-angle-down");
        expandIcon.classList.remove("icon-angle-up");
      }
    }
    // First click creates the content, following clicks just hide/show.
    function onExpandIconFirstClick() {

      mainContainer.appendChild(grid);
      for (var r = 0; r < 16; r++) {
        var row = document.createElement("div");
        row.classList.add("tile-editor-row");
        row.setAttribute("data-tile-editor-row", r);
        for (var c = 0; c < 16; c++) {
          var col = document.createElement("span");
          col.setAttribute("data-tile-editor-col", c);
          col.classList.add("tile-editor-pixel");
          col.addEventListener("mouseover", onPixelMouseover);
          col.addEventListener("mousedown", onPixelMousedown);
          row.appendChild(col);
        }
        grid.appendChild(row);
      }
      expandIcon.removeEventListener("mousedown", onExpandIconFirstClick);
      expandIcon.addEventListener("mousedown", onExpandIconClick);
      onExpandIconClick();
      fillGrid();
      createColours();
    }

    expandIcon.addEventListener("mousedown", onExpandIconFirstClick);
    mainContainer.classList.add("hidden");
    container.appendChild(dataInput);

    return container;
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
    e.find("input").attr('min', definition.min)
      .attr('max', definition.max)
      .attr('step', definition.step)
      .val(value);
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
    window.dispatchEvent(new CustomEvent("change-tray-tab", { detail: { tab: "customize"}}));

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

module.exports = editable;
