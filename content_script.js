

var wrongColors = [];
var fontSizes = {};
var fontStyles = {};
var fontFamilies = {};
var total = 0;
var totalElements = $('body *').length;
var count=0;
var totalInputTags = 0;
var totalInputTagsWithAlt = 0;
var totalImageTags = 0;
var totalImageTagsWithAlt = 0;
console.log(totalElements);

$('body *').each(function(){


if($(this).prop("tagName")!= "IFRAME" && $(this).prop("tagName")!= "SCRIPT" && $(this).prop("tagName")!= "NOSCRIPT")
{
	if(textPresent($(this))){
		analyzeColor($(this).css('backgroundColor'), $(this).css('color'), $(this));
		analyzeFont($(this).css('font-size'), $(this).css('font-family'), $(this).css('font-style'));
	}
	//alternate text for image and input
	if($(this).prop("tagName") == "IMG" || $(this).prop("tagName") == "INPUT"){
		analyzeAltText($(this));
	}

}

	count++;
});

if(count == totalElements){
	
	    
		var $resultDiv = $("<div>", {id: "result", class: "result"});
		$resultDiv.css({
			"display" : "none"
		});

		
		var $wrongDiv = $("<div>", {id: "wrong", class: "wrong"});
		var $sortofDiv = $("<div>", {id: "sorta", class: "sorta"});
		var $fontDiv = fontAnalysis();
		var $altTextDiv = altTextResults();

		$wrongDiv.html("<h4>Color & Brightness Issues</h4>");
		$sortofDiv.text("Sort of...can be improved");
		for(var i in wrongColors){
			var $r = createDiv(wrongColors[i]);
			if(wrongColors[i][2]=="NO")
				$r.appendTo($wrongDiv);
			if(wrongColors[i][2]=="sort of...")
				$r.appendTo($sortofDiv);
		}
		
		

			$wrongDiv.appendTo($resultDiv);
			//$sortofDiv.appendTo($resultDiv);
			$fontDiv.appendTo($resultDiv);
			$altTextDiv.appendTo($resultDiv);
			chrome.runtime.sendMessage({result: $resultDiv.html()});

			
	
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
//var totalInputImageTags = 0;
//var totalTagsWithAlt = 0;

function analyzeAltText($element){
	if($element.prop("tagName") == "IMG"){
		totalImageTags++;
		if($element.attr('alt'))
			totalImageTagsWithAlt++;
	}
	console.log($element.prop("tagName"));
	if($element.prop("tagName") == "INPUT"){
		totalInputTags++;
		if($element.attr('alt'))
			totalInputTagsWithAlt++;
	}
}
function altTextResults(){
	//TO-DO: refactor code

	var $altTextDiv = $("<div>", {id: "altText_result", class: "font_result"});
	$altTextDiv.html("<h4>Alternate Text for image and input elements</h4>");
	var $imageTagDiv = $("<div>", {id: "image_tag", class: "font_r"});
	$imageTagDiv.text("Image Elements with Alt Text");
	var $inputTagDiv = $("<div>", {id: "input_tag", class: "font_r"});
	$inputTagDiv.text("Input Elements with Alt Text");

	//var $textSpanImage = $("<span>", {class: "label"});
	var $percentage_blockImage = $('<div>');
		var percentageAltText = parseFloat(totalImageTagsWithAlt/totalImageTags * 100).toFixed(1);
		var width_percentage_block = (percentageAltText/100) * 250;
		console.log(totalImageTagsWithAlt + " " + totalImageTags);
		if(width_percentage_block < 1){
			width_percentage_block = 1;
		}
		$percentage_blockImage.css({"height" : "18px", 
			"width": width_percentage_block, 
			"display" : "inline-block", 
			"backgroundColor": "gray",
			"margin-right": "5px",
			"margin-left" : "5px",
			"margin-bottom": "-3px"});

		$percentage_blockImage.appendTo($imageTagDiv);
		$imageTagDiv.append(document.createTextNode(percentageAltText + "%"));

	var $percentage_blockInput = $('<div>');
		percentageAltText = parseFloat(totalInputTagsWithAlt/totalInputTags * 100).toFixed(1);
		width_percentage_block = (percentageAltText/100) * 250;
		
		if(width_percentage_block < 1){
			width_percentage_block = 1;
		}
		$percentage_blockInput.css({"height" : "18px", 
			"width": width_percentage_block, 
			"display" : "inline-block", 
			"backgroundColor": "gray",
			"margin-right": "5px",
			"margin-left" : "5px",
			"margin-bottom": "-3px"});

		$percentage_blockInput.appendTo($inputTagDiv);
		$inputTagDiv.append(document.createTextNode(percentageAltText + "%"));

		if(totalImageTags != 0)
			$imageTagDiv.appendTo($altTextDiv);
		if(totalInputTags != 0)
		$inputTagDiv.appendTo($altTextDiv);

	return $altTextDiv;

}
function analyzeFont(fontSize, fontFamily, fontStyle){
	total++;
	
	if (fontSize in fontSizes) {
		fontSizes[fontSize]++;
	}else{
		fontSizes[fontSize] = 1;
	}
	
	if (fontFamily in fontFamilies) {
		fontFamilies[fontFamily]++;
	}else{
		fontFamilies[fontFamily] = 1;
	}

	if (fontStyle in fontStyles) {
		fontStyles[fontStyle]++;
	}else{
		fontStyles[fontStyle] = 1;
	}

}
function fontAnalysis(){

	var $fontDiv = $("<div>", {id: "font_result", class: "font_result"});
	$fontDiv.html("<h4>Font Analysis</h4>");
	var $fontSizeDiv = $("<div>", {id: "f_size", class: "font_r"});
	$fontSizeDiv.text("Font Sizes");
	var $fontFamDiv = $("<div>", {id: "f_family", class: "font_r"});
	$fontFamDiv.text("Fonts Used");
	var $fontStyleDiv = $("<div>", {id: "f_Style", class: "font_r"});
	$fontStyleDiv.text("Font Styles");

	//Font sizes
		$fontSizeDiv =  fontResultDisplay('font-size',fontSizes, $fontSizeDiv);
	//Font Families
	  $fontFamDiv = fontResultDisplay('font-family', fontFamilies, $fontFamDiv);
	//Font Styles
	  $fontStyleDiv = fontResultDisplay('font-style', fontStyles, $fontStyleDiv);
	  //console.log($fontStyleDiv);

	
	$fontSizeDiv.appendTo($fontDiv);
	$fontStyleDiv.appendTo($fontDiv);
	$fontFamDiv.appendTo($fontDiv);

	return $fontDiv;
}
function fontResultDisplay(style_param,json, $Div){
	var smallFont = false;
	$Div.append('</br>');
	$Div.append('</br>');
	resultLineHeight = "18px";

	if(style_param == "font-size")
		json = sortResults(json);

	$.each(json, function(key, val){
		json[key] = parseFloat(val/total * 100).toFixed(1);
		var $textSpan = $("<span>", {class: "label"});
		if(style_param == "font-family"){
			$textSpan.css({"font-family" : key});
		}
		if(style_param == "font-size"){
			$textSpan.css({"font-size" : key});
			resultLineHeight = key;
			if(fontSizeValue(key) < 2){
				smallFont = true;
				$textSpan.css({"font-size" : "12px"});
				resultLineHeight = "18px;"
			}
		}
		if(style_param == "font-style"){
			$textSpan.css({"font-style" : key});

		}
		var $percentage_block = $('<div>');
		//$percentage_block.append(document.createTextNode(json[key]));
		var width_percentage_block = json[key]/100 * 250;
		if(width_percentage_block < 1){
			width_percentage_block = 1;
		}
		$percentage_block.css({"height" : "20px", 
			"width": width_percentage_block, 
			"display" : "inline-block", 
			"backgroundColor": "gray",
			"margin-right": "5px",
			"margin-bottom": "-3px"});
		
		var $resultLine = $("<div>");
		$resultLine.css({"height" : resultLineHeight});
		
		$resultLine.append($textSpan);
		if(smallFont){
			var label = "< 2px";
		}else
			var label = key;	
		$textSpan.append(document.createTextNode(label));
		if(style_param != "font-family"){
			$textSpan.css({"width": "80px"});
			$textSpan.append(document.createTextNode(" : "));
			$resultLine.append($percentage_block);
			$resultLine.append(document.createTextNode(json[key] + "%"));
		}
		//$Div.append('</br>');
		$Div.append($resultLine);
		$Div.append('</br>');
		smallFont =false;
	});	
	
	return $Div;
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
//check if elment has text node
function textPresent ($element){
	var textPresence = false;
	var childNode = $element.get(0).childNodes;
	for (var i = 0; i < childNode.length; i++){
		if (childNode[i].nodeType == Node.TEXT_NODE && /\S/.test(childNode[i].nodeValue)){
			textPresence = true;
			break;
		}

	}

	return textPresence;
}

//sort JSON

function sortResults(json){
	var sortedJSONArray = [];
	var sortedJSON = {};
	$.each(json, function(key, value){
		sortedJSONArray.push({"key" : fontSizeValue(key), "value" : value});
	});

	sortedJSONArray.sort(function(a, b){
	    if (a.key > b.key) return 1;
	    if (b.key > a.key) return -1;
	    return 0;
	});
	$.each(sortedJSONArray, function(){
		sortedJSON[this.key+"px"] = this.value;
	});
	return sortedJSON;
}

function fontSizeValue(key){
	return parseInt(/(\d+)px/.exec(key));
}

