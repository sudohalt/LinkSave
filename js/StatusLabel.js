/* File: StatusLabel.js
 *
 */
// Used for formatting the StatusLabel
var len = document.getElementById("StatusLabel").innerHTML;
if (len > 0) {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d"); 
	ctx.font = "17px Arial";        
	var styleWidth = ctx.measureText(len).width;
	var styleWidthString = styleWidth.toString() + "px";

	document.getElementById("StatusLabel").style.width = styleWidthString;
}
