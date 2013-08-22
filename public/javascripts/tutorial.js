$(document).ready(function(){
    
  fireD = $(".components .fireworks");  //draggable
  fireC = $(".fireworks-component");    //component
  
  skyD = $(".components .night-sky");   //draggable
  skyC = $(".sky-component");           //component

  phone = $(".phone-learn-canvas");
  
  changeStep(1);

  $(".channel-ui").on("click",".active-channel",function(e){
    var parent = $(this).closest(".channel-ui");
    parent.toggleClass("ui-open");
  });

  $(".channel-ui").on("click",".channel-options .channel",function(e){
    var color = $(this).attr("channelColor");
    var parent = $(this).closest(".channel-ui");
    parent.find(".active-channel").attr("channelColor",color);
    parent.find(".selected-channel").removeClass("selected-channel");
    $(this).addClass("selected-channel");
    $(parent).toggleClass("ui-open");
  });

});

function changeStep(step){

  timeline(step);
  
  switch(step)  {
    case 1:
      skyD.css("cursor","move").addClass("dragme-callout").find(".drag-arrow").show();
      skyD.draggable({
        revert :  true,
        start : function(event,ui){
          ui.helper.addClass("im-flying").css("z-index",1000).removeClass("dragme-callout").find(".drag-arrow").remove();
        }
      });
      phone.droppable({
        hoverClass: "drop-hover",
        drop: function(event,ui){
          skyD.remove();
          changeStep(2);
        }
      });
    break;
    
    case 2:
      skyC.show().addClass("component-selected");
      
      skyC.find(".channel-ui .channel-options .channel").on("click",function(){

        skyC.removeClass("component-selected");
        changeStep(3);
      });
    break;

    case 3:
      fireD.css("cursor","move").addClass("dragme-callout").find(".drag-arrow").show();
      fireD.draggable({
        revert :  true,
        start : function(event,ui){
          ui.helper.addClass("im-flying").css("z-index",1000).removeClass("dragme-callout").find(".drag-arrow").remove();
        }
      });
      phone.droppable({

        drop : function(event,ui){
          fireD.remove();
          fireC.show().addClass("component-selected"); 
          changeStep(4)
        }
      });
    break;
    
    case 4: "value", 
      fireC.find(".channel-ui").on("click",function(){
        changeStep(5);
      });
    break;

  case 5: 
    skyC.addClass("fireworks-on");
    $("button").css("opacity","1");
  break;
  
  }
}

function timeline(step){
  var timeline =   $(".timeline")
  timeline.find(".time-item").removeClass("current-time"); 
  timeline.find(".time-item:nth-child("+step+")").addClass("current-time");
}