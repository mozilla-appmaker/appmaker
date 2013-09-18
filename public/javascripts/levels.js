define(
  ["jquery"],
  function($) {

    $(document).ready(function(){
      setTimeout(function(){
        appMaster.init();
      },100);
    });

    var appMaster = {

      currentLevel : 0,
      levelGoalStep : 0, //This is the goal step of the level

      //Various element placeholders
      levelStatus : "",
      stepStatus : "",
      gameStatus : "",
      phoneCanvas : "",

      levels : [
        {
        "description" : "Cat.Random()", 
        "steps" : [
          {
            "description" : "Drag and drop a button onto the phone.",
            "component" : "app-button",
            "goal"    : "place",
            "completed" : false
          },
          {
            "description" : "Place a randomcat component on the phone",
            "component" : "app-randomcat",
            "goal"    : "place",
            "completed" : false,
            "levelgoal" : true
          }
          ]
        }, 
        {
        "description" : "Butt Out!", 
        "steps" : [
          {
            "description" : "Click a button",
            "component" : "app-button",
            "goal"    : "event",
            "eventName"   : "broadcast",
            "eventValue" : "Click",
            "completed" : false,
            "levelgoal" : true
          }]
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
        if(localStorage.wantGame == "yep"){
          this.startGame();  
        }
      },
      startGame : function(){

        this.gameStatus = $(".game-status");
        this.levelStatus = $(".level-status");
        this.levelName = $(".level-name");
        this.levelNumber = $(".level-number");
        this.levelIntro = $(".level-intro");
        this.stepList = $(".step-list");
        this.levelFinished = $(".level-finished");

        this.phoneCanvas = $(".phone-canvas");
        var t = this;

        this.loadLevel(1);

        this.gameStatus.find(".start").on("click",function(){
          t.gameStatus.removeClass("big");
          t.levelIntro.hide();
          t.levelStatus.show();
          return false;
        });

        this.gameStatus.find(".show-hints").on("click",function(){
          $(this).hide();
          t.gameStatus.find(".hint-step").show();
          return false;
        });

        this.gameStatus.find(".next-level").on("click",function(){
          t.currentLevel++;
          t.loadLevel(t.currentLevel);
          return false;
        });

        this.gameStatus.find(".optout").on("click",function(){
          t.endGame();
          return false;
        });

      },
      endGame : function() {
        localStorage.wantGame = "nah";
        this.gameStatus.remove();
      },

      loadLevel : function(levelNumber){

        this.phoneCanvas.find("*").remove();
        this.currentLevel = levelNumber;
        this.gameStatus.addClass("big");
        this.levelFinished.hide();
        this.levelIntro.show();

        var level = this.levels[levelNumber-1]; 
        var description = level["description"];
        var steps = level["steps"];
        this.levelNumber.text("Level " + this.currentLevel);
        this.levelName.text(description);

        //Loads all the Steps and listners
        this.stepList.html("");
        
        for(var i = 0;  i < steps.length; i++){
          var step = steps[i];

          var stepEl = document.createElement("div");

          $(stepEl).text(step["description"]);
          $(stepEl).attr("level",i);

          if(step["levelgoal"]){
            this.levelGoalStep = i;
            $(stepEl).addClass("goal-step");
          } else {
            $(stepEl).addClass("hint-step");
          }

          this.stepList.append(stepEl);

          if(step["goal"] == "place"){
            this.addPlaceChecker(step["component"],i);
          }
          if(step["goal"] == "event"){
            this.addEventChecker(step["component"],step["eventName"],step["eventValue"],i);
          }
        }

        if (steps.length > 1) {
          this.gameStatus.find(".show-hints").show();
        } else {
          this.gameStatus.find(".show-hints").hide();
        }

      },
      checkLevelFinish : function(){
        var t = this;
        var done = this.levels[this.currentLevel-1]["steps"][this.levelGoalStep]["completed"];
        if(done){
          setTimeout(function(){
            t.gameStatus.addClass("big").show();          
            t.levelStatus.hide();
            t.levelFinished.show();
            t.levelIntro.hide();
            t.gameStatus.find(".level-finished h1").text("Congrats, you finished Level " + t.currentLevel + ", you monster!");
          },1000);
        }
      },
      finishStep : function(step){
        this.levels[this.currentLevel-1]["steps"][step]["completed"] = true;
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
