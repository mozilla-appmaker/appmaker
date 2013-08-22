$(document).ready(function(){
    
  fireD = $(".components .fireworks");  //draggable
  fireC = $(".fireworks-component");    //component
  
  skyD = $(".components .night-sky");   //draggable
  skyC = $(".sky-component");           //component

  phone = $(".phone-learn-canvas");
  
  changeStep(1);

});

function changeStep(step){

  timeline(step);
  
  switch(step)  {
    case 1:
      skyD.css("cursor","move").addClass("dragme-callout");
      skyD.draggable();
      phone.droppable({
        drop: function(event,ui){
          skyD.remove();
          changeStep(2);
        }
      });
    break;
    
    case 2:
      skyC.show().addClass("component-selected");
      skyC.find(".channel-ui").on("click",function(){
        $(this).hide();
        skyC.removeClass("component-selected");
        changeStep(3);
      });
    break;

    case 3:
      fireD.css("cursor","move").addClass("dragme-callout");
      fireD.draggable();
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
  break;
  
  }
}

function timeline(step){
  var timeline =   $(".timeline")
  timeline.find(".time-item").removeClass("current-time"); 
  timeline.find(".time-item:nth-child("+step+")").addClass("current-time");
}