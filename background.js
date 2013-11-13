// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!

  	chrome.tabs.executeScript(null, { file: "jquery-1.10.2.min.js",'allFrames' : true }, function() {
    	chrome.tabs.executeScript(null, { 'file': "jquery.simplemodal.1.4.4.min.js", 'allFrames' : true }, function() {
    		chrome.tabs.executeScript(null, { 'file': "content_script.js", 'allFrames' : true })
    	});
	});

	chrome.windows.getCurrent(function(wind) {

		var maxWidth = window.screen.availWidth - 450;
		var maxHeight = window.screen.availHeight;
		var updateInfo = {
			left: 450,
			top: 0,
			width: maxWidth,
			height: maxHeight
		};
	chrome.windows.update(wind.id, updateInfo);});
	//console.log(myWindow);
	chrome.runtime.onMessage.addListener(
  		function popUp(request, sender, sendResponse) {
  			
  			
    		myWindow=window.open('','chromeExtensionWebpageAnalyzerResults','width=450,height='+window.screen.availHeight);
    		myWindow.document.open();
			myWindow.document.write("<html><head><title>Analysis Report</title><link rel='stylesheet' type='text/css' href='resultPopup.css'></head><body>"+request.result+"</body></html>");
			
			myWindow.focus();
			chrome.runtime.onMessage.removeListener(popUp);

      
  	});

  	


});


