define(
  ["jquery"],
  function($) {

    $(document).ready(function(){
      setTimeout(function(){
        appMaster.init();
      },100);
    });

    var appMaster = {

      currentLevelNumber : 0,   //Placeholder for the level number
      currentLevel : {},        //Placeholder for level object
      levelGoalStep : 0,        //This is the goal step of the level

      //Various element placeholders
      levelStatus : "",
      stepStatus : "",
      gameStatus : "",
      phoneCanvas : "",
      bubbleTimeout : "",
      lastHint : 0,

      levels : [
      //Level 1
        {
        "description" : "Button-down", 
        "rank" : "Assistant to the Junior Paperboy", 
        "hints" : [
          "Components live in the tray on left hand side!",
          "You can drag and drop components to the phone."
          ],
        "steps" : [
          {
            "description" : "Add a button to your app.",
            "component" : "app-button",
            "goal"    : "place",
            // "eventName"   : "broadcast",
            // "eventValue" : "Click",
            "completed" : false,
            "levelgoal" : true
          }]
        },
        {
        "description" : "Cat.Random()",
        "rank" : "Assistant to the Junior Paperboy", 
        "steps" : [
          {
            "description" : "Drag and drop a button onto the phone.",
            "component" : "app-button",
            "goal"    : "place",
            "completed" : false
          },
          {
            "description" : "Add a randomcat component to your app.",
            "component" : "app-randomcat",
            "goal"    : "place",
            "completed" : false,
            "levelgoal" : true
          }
          ]
        }, 


        {
        "description" : "That food sucked!", 
        "steps" : [
          {
            "description" : "Give a one star rating",
            "component" : "app-rating",
            "goal"    : "event",
            "eventName"   : "emit",
            "eventValue" : 1,
            "completed" : false,
            "levelgoal" : true
          }]
        },
        {
        "description" : "Humble Beginnings", 
        "steps" : [
          {
            "description" : "Place a button on the page",
            "component" : "app-button",
            "goal"    : "place",
            "completed" : false
          },
          {
            "description" : "Place a fireworks on the page",
            "component" : "app-fireworks",
            "goal"    : "place",
            "completed" : false
          },
          {
            "description" : "Shoot a firework",
            "component" : "app-fireworks",
            "goal"    : "event",
            "eventName"   : "shootRocket",
            "completed" : false,
            "levelgoal" : true
          }
          ]
        },
      ],
      init : function(){
        if (localStorage.gameModeEnabled != "no") {
          this.startGame();
        }
      },
      startGame : function(){

        this.gameStatus = $(".game-status");
        this.levelStatus = $(".game-status .level-status");
        this.levelIntro = $(".game-status .level-intro");
        this.stepList = $(".game-status .step-list");
        this.levelFinished = $(".game-status .level-finished");
        this.hintBubble = $(".game-status .hint");
        this.phoneCanvas = $(".phone-canvas");
        this.levelIndicator = $(".game-status .level-indicator");

        var t = this;

        if(localStorage.levelCompleted){
          this.loadLevel(parseInt(localStorage.levelCompleted,10) + 1);
        } else { 
          this.loadLevel(1);
        }

        this.gameStatus.find(".start").on("click",function(){
          t.gameStatus.removeClass("big");
          t.levelIntro.hide();
          t.levelStatus.show();
          return false;
        });

        this.gameStatus.find(".show-hints").on("click",function(){
          t.showHint();
          return false;
        });

        this.gameStatus.find(".next-level").on("click",function(){
          t.currentLevelNumber++;
          t.loadLevel(t.currentLevelNumber);
          return false;
        });

        this.gameStatus.find(".optout").on("click",function(){
          t.endGame();
          return false;
        });

        this.gameStatus.find(".restart").on("click",function(){
          t.currentLevelNumber = 0;
          localStorage.levelCompleted = "";
          t.loadLevel(1);
          return false;
        });

      },
      endGame : function() {
        localStorage.gameModeEnabled = "no";
        this.gameStatus.remove();
      },
      loadLevel : function(levelNumber){

        this.phoneCanvas.find("*").remove();
        this.currentLevelNumber = levelNumber;
        this.gameStatus.addClass("big");
        this.levelFinished.hide();
        this.levelIntro.show();

        this.currentLevel = this.levels[this.currentLevelNumber-1]; 

        //Builds out the level indicator
        this.levelIndicator.find(".level-circle").remove();

        var levelCount = this.levels.length;
        var maxLeft = this.levelIndicator.width();
        var increment = maxLeft / levelCount;

        for(var i = 0; i <= levelCount; i++){
          var levelCircle = document.createElement("div");
          $(levelCircle).addClass("level-circle");
          if(i < this.currentLevelNumber){
            $(levelCircle).addClass("got-here");
          }

          $(levelCircle).css("left", i * Math.floor(increment) - 10 +"px");
          this.levelIndicator.append(levelCircle);
        }

        this.levelIndicator.find(".level-progress").width((this.currentLevelNumber -1) * increment);
        this.levelIndicator.find(".current-level").css("left", (this.currentLevelNumber -1) * increment - 18);

        var description = this.currentLevel["description"];
        var steps = this.currentLevel["steps"];

        this.levelIntro.find(".level-number").text("Level " + this.currentLevelNumber);
        this.levelIntro.find(".level-name").html("&quot;" + description + "&quot;");

        this.levelStatus.find(".level-number").text("Level " + this.currentLevelNumber);
        this.levelStatus.find(".level-name").text(description);

        //Loads all the Steps and listners
        this.stepList.html("");

        for(var j = 0;  j < steps.length; j++){
          var step = steps[j];

          var stepEl = document.createElement("div");

          $(stepEl).text(step["description"]);
          $(stepEl).attr("level",j);

          if(step["levelgoal"]){
            this.levelGoalStep = j;
            $(stepEl).addClass("goal-step");
          } else {
            $(stepEl).addClass("hint-step");
          }

          this.stepList.append(stepEl);

          if(step["goal"] == "place"){
            this.addPlaceChecker(step["component"],j);
          }
          if(step["goal"] == "event"){
            this.addEventChecker(step["component"],step["eventName"],step["eventValue"],j);
          }
        }
      },
      showHint : function(){
        var hints = this.levels[this.currentLevelNumber-1]["hints"] || false;
        var t = this;
        window.clearTimeout(this.bubbleTimeout);
        delete this.bubbleTimeout;
        if(hints){
          var randomHint = Math.floor(Math.random(1)*hints.length);
          while (randomHint == this.lastHint){
            randomHint = Math.floor(Math.random(1)*hints.length);
          }
          this.lastHint = randomHint;
          this.hintBubble.show().addClass("show-hint").find(".hint-text").text(hints[randomHint]);
          this.bubbleTimeout = setTimeout(function(){
            t.hintBubble.fadeOut();
          },2000);
        }
      },
      checkLevelFinish : function(){
        var t = this;
        var done = this.levels[this.currentLevelNumber-1]["steps"][this.levelGoalStep]["completed"];
        if(done){
          setTimeout(function(){
            t.gameStatus.addClass("big").show();
            t.levelStatus.hide();
            t.levelFinished.show();
            t.levelIntro.hide();
            t.levelFinished.find(".level-number").text(t.currentLevelNumber);
            t.levelFinished.find(".player-rank").text(t.currentLevel["rank"]);
            localStorage.levelCompleted = t.currentLevelNumber;
          },1000);
        }
      },
      finishStep : function(step){
        this.levels[this.currentLevelNumber-1]["steps"][step]["completed"] = true;
        var stepItem = this.stepList.find("div[level="+step+"]");
        stepItem.css("text-decoration","line-through");
        this.checkLevelFinish();
      },
      addPlaceChecker : function(component,step){
        var t = this;
        var checkerInterval = setInterval(function(){
          var present = false;
          if($(".phone-canvas").find(component).length > 0){
            present = true;
            t.finishStep(step);
            clearInterval(checkerInterval);
          }
        },300);
      },
      addEventChecker : function(component,eventName,eventValue,step){
        var t = this;
        var checkerInterval = setInterval(function(){
          var present = false;
          if($(".phone-canvas").find(component).length > 0){

            var el = $(component)[0];
            var originalEvent = el[eventName];

            el[eventName] = function(value){
              if(eventValue){
                if(value == eventValue){
                  t.finishStep(step);
                  el[eventName] = originalEvent;
                  el[eventName](value);
                }
              } else {
                t.finishStep(step);
                el[eventName] = originalEvent;
                el[eventName](value);
              }
            };
            clearInterval(checkerInterval);
          }
        },300);
      }
    };
});
