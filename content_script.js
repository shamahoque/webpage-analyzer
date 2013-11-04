console.log(chrome.extension.getURL("images/x.png"));

if($('#simplemodal-placeholder').length > 0){
			$("#result").modal.close();
		}

var wrongColors = [];
$('body *').each(function(){

if($(this).prop("tagName")!= "IFRAME" && $(this).prop("tagName")!= "SCRIPT")
{
	// console.log($(this).prop("tagName")+ " " +$(this).css('backgroundColor'));
	// console.log("Text color: "+$(this).css('color'));
	analyzeColor($(this).css('backgroundColor'), $(this).css('color'), $(this));

}

});
if(wrongColors.length>0){
	console.log(wrongColors);
	    if($('#result').length > 0){
				$('#result').remove();
		}
		var $resultDiv = $("<div>", {id: "result", class: "result"});
		$resultDiv.css({
			"display" : "none"
		});

		$resultDiv.html("<h1>Webpage Analysis Report:</h1>");
		var $wrongDiv = $("<div>", {id: "wrong", class: "wrong"});
		var $sortofDiv = $("<div>", {id: "sorta", class: "sorta"});
		$wrongDiv.text("Colors NOT compliant");
		$sortofDiv.text("Sort of...can be improved");
		for(var i in wrongColors){
			var $r = createDiv(wrongColors[i]);
			if(wrongColors[i][2]=="NO")
				$r.appendTo($wrongDiv);
			if(wrongColors[i][2]=="sort of...")
				$r.appendTo($sortofDiv);
		}
		
			$wrongDiv.appendTo($resultDiv);
			$sortofDiv.appendTo($resultDiv);
			$resultDiv.appendTo($('body'));
			$("#result").modal();
	

	
}

function createDiv(wrongColor){
	var $resultShow = $("<div>", {class: "show"});
	$resultShow.text("Text Color");
	$resultShow.css({
		"backgroundColor" : wrongColor[0],
		"color" : wrongColor[1]
	});
	return $resultShow;
}

function analyzeColor(bgColor, fgColor, $element){
	var background_RGB = getRGBarray(bgColor); 
	//for transparent backgrounds get parent background color
	if(background_RGB.length > 3){
		while(background_RGB[3] == 0 && background_RGB.length > 3 && $element.prop("tagName")!= "BODY" ){
			$element = $element.parent();
			background_RGB = getRGBarray($element.css('backgroundColor'));
		}
		if(background_RGB[0] == 0 && background_RGB[1] == 0 && background_RGB[2] == 0 && background_RGB[3] == 0){
			background_RGB = getRGBarray("rgb(255,255,255)");
			bgColor = "rgb(255,255,255)";
		}else
		bgColor = $element.css('backgroundColor');
	}

	var foreground_RGB = getRGBarray(fgColor); 
	var brightnessThreshold = 125;
	var colorThreshold = 500;
	var results = [];
	

	var bY=((background_RGB[0] * 299) + (background_RGB[1] * 587) + (background_RGB[2] * 114)) / 1000;
	var fY=((foreground_RGB[0] * 299) + (foreground_RGB[1] * 587) + (foreground_RGB[2] * 114)) / 1000;
	var brightnessDifference = Math.abs(bY-fY);
	console.log(brightnessDifference);

    var colorDifference = (Math.max (foreground_RGB[0], background_RGB[0]) - Math.min (foreground_RGB[0], background_RGB[0])) +
                          (Math.max (foreground_RGB[1], background_RGB[1]) - Math.min (foreground_RGB[1], background_RGB[1])) +
                          (Math.max (foreground_RGB[2], background_RGB[2]) - Math.min (foreground_RGB[2], background_RGB[2]));

    var cResult = "";
    if(brightnessDifference == 0 && colorDifference == 0)
    	cResult = "Not Applicable"
	else if ((brightnessDifference >= brightnessThreshold) && (colorDifference >= colorThreshold))	{
	    cResult = "YES"; // compliant
	}else if ((brightnessDifference >= brightnessThreshold) || (colorDifference >= colorThreshold)){
		cResult = "sort of..."; // sort of compliant
	}else{
		cResult = "NO"; // not compliant "Poor visibility between text and background colors."
	}

	// if(brightnessDifference < brightnessThreshold)
	// 	cResult = "sort of...";
	// if(colorDifference < colorThreshold)
	// 	cResult = "NO";
	
	if(cResult == "sort of..." || cResult == "NO"){
		results[0] = bgColor;
		results[1] = fgColor;
		results[2] = cResult;
	}
	
	if(results.length > 0){
		var match = false;

		for(var d in wrongColors){

			if(compareArray(wrongColors[d],results)){
			 	match = true;
			 	break;
			}
		}
		if(!match){
			wrongColors.push(results);
		}
	}
	
	
	
	var ratio = 1;
	var l1 = getLuminance([foreground_RGB[0]/255, foreground_RGB[1]/255, foreground_RGB[2]/255]);
	var l2 = getLuminance([background_RGB[0]/255, background_RGB[1]/255, background_RGB[2]/255]);

	if (l1 >= l2) {
		ratio = (l1 + .05) / (l2 + .05);
	} else {
		ratio = (l2 + .05) / (l1 + .05);
	}
	ratio = Math.round(ratio * 100) / 100; // round to 2 decimal places
	var contrastratio = ratio;
	var w2b = (ratio >= 4.5 ? 'YES' : 'NO');
	var w2a = (ratio >= 3 ? 'YES' : 'NO');
	var w2aaab = (ratio >= 7 ? 'YES' : 'NO');
	var w2aaaa = (ratio >= 4.5 ? 'YES' : 'NO');


}

// perform math for WCAG2
	function getLuminance (rgb){
			
		for (var i =0; i<rgb.length; i++) {
			if (rgb[i] <= 0.03928) {
				rgb[i] = rgb[i] / 12.92;	
			} else {
				rgb[i] = Math.pow( ((rgb[i]+0.055)/1.055), 2.4 );
			}
		}
		var l = (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]);
		return l;
	};

function getRGBarray(color){
	var rgb = color.match(/\d+/g);
	var rgbArray = [];
	for(var i in rgb) {
  		rgbArray[i]=rgb[i];
	}
	return rgbArray;
}

function compareArray(array1, array2) {
    // if the other array is a falsy value, return
    if (!array2)
        return false;

    // compare lengths - can save a lot of time
    if (array1.length != array2.length)
        return false;

    for (var i = 0; i < array1.length; i++) {
        // Check if we have nested arrays
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            // recurse into the nested arrays
            if (!array1[i].compare(array2[i]))
                return false;
        }
        else if (array1[i] != array2[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
