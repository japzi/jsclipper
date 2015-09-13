// Worker related functionalities:
if (typeof(document) === "undefined" && typeof(importScripts) !== "undefined") // test if we are in worker scope
{
  importScripts('clipper.js');

  self.addEventListener('message', function(e) // We listen messages from the main page
  {
    var data = e.data;
    // according to received commands (draw500, draw6000, draw12000) we call draw() to get svg data and send it to the main page
    switch (data.cmd)
    {
      case 'draw500':
        var DrawingStart = Date.now();
        var svg = draw(500);
        var DrawingEnd = Date.now();
        var DrawingTime = DrawingEnd - DrawingStart;
        var TransferStart = Date.now();
        self.postMessage({result:svg, DrawingTime:DrawingTime, TransferStart:TransferStart});
        break;
      case 'draw6000':
        var DrawingStart = Date.now();
        var svg = draw(6000);
        var DrawingEnd = Date.now();
        var DrawingTime = DrawingEnd - DrawingStart;
        var TransferStart = Date.now();
        self.postMessage({result:svg, DrawingTime:DrawingTime, TransferStart:TransferStart});
        break;
      case 'draw12000':
        var DrawingStart = Date.now();
        var svg = draw(12000);
        var DrawingEnd = Date.now();
        var DrawingTime = DrawingEnd - DrawingStart;
        var TransferStart = Date.now();
        self.postMessage({result:svg, DrawingTime:DrawingTime, TransferStart:TransferStart});
        break;
      default:
        self.postMessage('Unknown command: ' + data.msg);
    };
  }, false);
}

// SVG source is created here
function draw(count)
{
  var scale = 100;
  var co = new ClipperLib.ClipperOffset(2, 2);
  var svg = "", offsetted_paths = new ClipperLib.Path(), i, xstart, ystart, xend, yend;
  var path = [new ClipperLib.IntPoint(), new ClipperLib.IntPoint()];
  svg += '<svg style="margin-top:10px;margin-right:10px;margin-bottom:10px;background-color:#dddddd" width="800" height="320">';
  for(i = 0; i < count; i++)
  {
    path[0].X = Math.round(Math.random()*800);
    path[0].Y = Math.round(Math.random()*320);
    path[1].X = Math.round(Math.random()*800);
    path[1].Y = Math.round(Math.random()*320);
    ClipperLib.JS.ScaleUpPath(path, scale);
    co.Clear();
    co.AddPath(path, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etOpenRound);
    co.Execute(offsetted_paths, 5 *scale);
	  // We cannot use console.log for debugging, but self.postMessage:
    //self.postMessage(JSON.stringify(offsetted_paths));
    svg += '<path stroke="black" fill="' + randomColor({red:255, green:255, blue:255}) + '" stroke-width="1" d="' + paths2string(offsetted_paths, scale) + '"/>';
  }
  svg += '</svg>';
  return svg;
}

// Converts Paths to SVG path string
// and scales down the coordinates
function paths2string (paths, scale) {
  var svgpath = "", i, j;
  if (!scale) scale = 1;
  for(i = 0; i < paths.length; i++) {
    for(j = 0; j < paths[i].length; j++){
      if (!j) svgpath += "M";
      else svgpath += "L";
      svgpath += (paths[i][j].X / scale) + ", " + (paths[i][j].Y / scale);
    }
    svgpath += "Z";
  }
  if (svgpath=="") svgpath = "M0,0";
  return svgpath;
}

// Helpers function to get random color in hex
function randomColor(mix) {
  var rand = Math.random, round = Math.round;
  var red = round(rand()*255);
  var green = round(rand()*255);
  var blue = round(rand()*255);
  if (mix != null) {
    red = round((red + mix.red) / 2);
    green = round((green + mix.green) / 2);
    blue = round((blue + mix.blue) / 2);
  }
  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
  return (rgbToHex(red, green, blue));
}
