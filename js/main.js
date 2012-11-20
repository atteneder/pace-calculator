//@codekit-prepend "plugins.js"
//@codekit-prepend "vendor/jquery.color.js"

(function(){
"use strict";

var undefinedPace = true;

function getDistance() {
	return parseInt($("#distance").val(),10);
}

function getTime() {
  var time = parseInt($("#timeHour").val(),10) * 3600;
  if(isNaN(time)) {
    time=0;
  }
  time += parseInt($("#timeMin").val(),10) * 60;
  time += parseInt($("#timeSec").val(),10);
  return time;
}

function getPace() {
  var pace = parseInt($("#paceMin").val(),10) * 60;
  pace += parseInt($("#paceSec").val(),10);
  return pace;
}

function getSpeed() {
	return parseFloat($("#speed").val());
}

function clampTime(input) {
  var time = parseInt(input.val(),10);
  if (time>59) {
    input.val(59);
  } else
  if (time<10) {
    input.val("0"+time);
  }
  else
  if (time<=0) {
    input.val("00");
  }
}

function clampSpeed(input) {
	var speed = parseFloat(input.val());
	input.val(speed.toFixed(3));
}

function pulsate(elem) {
	var oldcol = elem.css("background-color");
	elem
		.stop()
		.css("background-color", "#0f0")
		.animate({
			backgroundColor: oldcol
			}, 500 );
}

function setPace(pace) {
	var paceMin = Math.floor(pace/60);
  var paceSec =  Math.round(pace-paceMin*60);
  
  if (String(paceSec).length<=1) {
    paceSec = "0"+paceSec;
  }
  
  $("#paceMin").val(paceMin);
  $("#paceSec").val(paceSec);
  
  pulsate($("fieldset.pace div.inputset"));
}

function updatePace() {
  //console.log("updatePace");
  undefinedPace = true;
  var time = getTime();
  var distance = getDistance();
  
  setPace(time*1000/distance);
}

function updatePaceFromSpeed() {
	undefinedPace = true;
	var speed = getSpeed();
	setPace(3600/speed);
}

function updateSpeed() {
	var time = getTime();
	var distance = getDistance();
	var speed = (distance/1000) / (time/3600);
	$("#speed").val(speed.toFixed(3));
	pulsate($("fieldset.speed div.inputset"));
}

function updateTime() {
  //console.log("updateTime");
  undefinedPace = false;
  var pace = getPace();
  var distance = getDistance();
  
  var time = distance*pace/1000;
  var timeHour = Math.floor(time/3600);
  time -= timeHour*3600;
  
  var timeMin = Math.floor(time/60);
  if (timeMin<10) {
    timeMin = "0"+timeMin;
  }
  
  time -= timeMin*60;
  time = Math.round(time);
  if (time<10) {
    time = "0"+time;
  }
  
  $("#timeHour").val( timeHour===0 ? "": timeHour );
  $("#timeMin").val( timeMin );
  $("#timeSec").val( time );
  /*
  $("fieldset").removeClass("updated");
  $("fieldset.time").addClass("updated");
  */
  pulsate($("fieldset.time div.inputset"));
}

function onTimeUpdate() {
  clampTime( $("#timeSec") );
  clampTime( $("#timeMin") );
  updatePace();
  updateSpeed();
}

function onPaceUpdate() {
  clampTime( $("#paceSec") );
  updateTime();
  updateSpeed();
}

function onSpeedUpdate() {
	clampSpeed($("#speed"));
	updatePaceFromSpeed();
	updateTime();
}

function updateDistance() {
  if( undefinedPace ) {
    updatePace();
    updateSpeed();
  } else {
    updateTime();
  }
}

$(document).ready(function() {
  $("#distance").change(updateDistance);

  $("#timeHour").change(onTimeUpdate);
  $("#timeMin").change(onTimeUpdate);
  $("#timeSec").change(onTimeUpdate);

  $("#paceMin").change(onPaceUpdate);
  $("#paceSec").change(onPaceUpdate);
  
  $("#speed").change(onSpeedUpdate);
  
  $("input[type=number]").click(function() {
    $(this).select();
  });

  // SVG workaround
  if(!Modernizr.svg) {
		$('img[src*="svg"]').attr('src', function () {
			return $(this).attr('src').replace('.svg', '.png');
		});
	}
	
  // android placeholder on input type number fix
  $("input[type='number']").each(function(i, el) {
    el.type = "text";
    el.onfocus = function(){this.type="number";};
    el.onblur = function(){this.type="text";};
  });

  updatePace();
  updateSpeed();
});

})();