(function() {
  var gamelogic = {
    generateBoard: function(that) {

      function paintTile(block) {
        block.setAttribute("data-col-type", that.groundPalette);
        var selectedPalette = that.shadowRoot.querySelector(".palette-selected");
        var backgroundImage = selectedPalette.style.backgroundImage;
        block.style.backgroundImage = backgroundImage;
      }
      function paintObject(block) {
        var objectBlock = block.querySelector(".object-block");

        if (that.objectPalette === "clearobject") {
          if (objectBlock ) {
            block.removeChild(objectBlock);
          }
          return;
        } else if (!objectBlock) {
          objectBlock = document.createElement("span");
          objectBlock.classList.add("object-block");
          objectBlock.style.position = "absolute";
          objectBlock.style.height = "100%";
          objectBlock.style.width = "100%";
          block.appendChild(objectBlock);
        }

        var selectedPalette = that.shadowRoot.querySelector(".palette-selected");
        var backgroundImage = selectedPalette.style.backgroundImage;
        objectBlock.style.backgroundImage = backgroundImage;
        objectBlock.setAttribute("data-col-type", that.objectPalette);
      }
      function paintWall(block) {
        var wallBlock = block.querySelector(".wall-block");

        if (that.wallPalette === "clearobject") {
          if (wallBlock ) {
            block.removeChild(wallBlock);
          }
          return;
        } else if (!wallBlock) {
          wallBlock = document.createElement("span");
          wallBlock.classList.add("wall-block");
          wallBlock.style.position = "absolute";
          wallBlock.style.height = "100%";
          wallBlock.style.width = "100%";
          block.appendChild(wallBlock);
        }

        var selectedPalette = that.shadowRoot.querySelector(".palette-selected");
        var backgroundImage = selectedPalette.style.backgroundImage;
        wallBlock.style.backgroundImage = backgroundImage;
        wallBlock.setAttribute("data-col-type", that.wallPalette);
      }
      var isMouseDown = false;
      function onMouseUp() {
        isMouseDown = false;
        window.removeEventListener("mouseup", onMouseUp);
      }
      function onBlockMousedown(e) {
        if ((!that.groundPalette && !that.objectPalette && !that.wallPalette) || !that.classList.contains("selected")) {
          return;
        }
        e.preventDefault();
        window.addEventListener("mouseup", onMouseUp);
        isMouseDown = true;
        if (that.groundPalette) {
          paintTile(this);
        }
        if (that.objectPalette) {
          paintObject(this);
        }
        if (that.wallPalette) {
          paintWall(this);
        }
      }
      function onBlockOver() {
        if (!isMouseDown || (!that.groundPalette && !that.objectPalette && !that.wallPalette) || !that.classList.contains("selected")) {
          return;
        }
        if (that.groundPalette) {
          paintTile(this);
        }
        if (that.objectPalette) {
          paintObject(this);
        }
        if (that.wallPalette) {
          paintWall(this);
        }
      }
      var board = that.querySelector(".board");
      if (board) {
        var player = board.querySelector(".player");
        if (player) {
          player.parentNode.removeChild(player);
        }
        for (var r = 0; r <= that.rows; r++) {
          var row = board.querySelector('*[data-row="'+ r + '"]');
          for (var c = 0; c <= that.cols; c++) {
            var col = row.querySelector('*[data-col="'+ c + '"]');
            col.addEventListener("mousedown", onBlockMousedown);
            col.addEventListener("mouseover", onBlockOver);
            col.classList.remove("pressed");
          }
        }
      } else {
        board = document.createElement("div");
        board.classList.add("board");
        board.style.fontSize = 0;
        board.style.margin = "auto";
        board.style.width = "288px";
        board.style.position = "relative";

        for (var r = 0; r <= that.rows; r++) {
          var row = document.createElement("div");
          row.style.margin = "auto";
          row.classList.add("row");
          row.setAttribute("data-row", r);
          if (r === 0) {
            row.classList.add("topside");
          } else if (r === 8) {
            row.classList.add("bottomside");
          }
          for (var c = 0; c <= that.cols; c++) {
            var col = document.createElement("span");
            col.style.height = "32px";
            col.style.width = "32px";
            col.style.display = "inline-block";
            col.style.position = "relative";
            col.style.padding = 0;
            col.style.cursor = "pointer";
            col.classList.add("col");
            if (c === 0) {
              col.classList.add("leftside");
            } else if (c === 8) {
              col.classList.add("rightside");
            }

            col.setAttribute("data-col", c);
            col.addEventListener("mousedown", onBlockMousedown);
            col.addEventListener("mouseover", onBlockOver);
            col.setAttribute("data-col-type", "ground1");
            col.style.backgroundImage = "url('" + that.groundsprite1 + "')";
            row.appendChild(col);
          }
          board.appendChild(row);
        }
        that.appendChild(board);
      }
    }
  };
  window.gamelogic = gamelogic;
}())
