// very creative hack?
var len = document.getElementById("statusLabel").innerHTML;
if (len > 0)
{
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d"); 
	ctx.font = "17px Arial";        
	var styleWidth = ctx.measureText(len).width;
	var styleWidthString = styleWidth.toString() + "px";

	document.getElementById("statusLabel").style.width = styleWidthString;
}
