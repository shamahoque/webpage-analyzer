

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {

	//script injection
  	chrome.tabs.executeScript(null, { file: "jquery-1.10.2.min.js",'allFrames' : true }, function() {
    		chrome.tabs.executeScript(null, { 'file': "content_script.js", 'allFrames' : true })
	});

  	//resize chrome window to fit analayzer report pop-up on the left
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
	
	//create popup window
	chrome.runtime.onMessage.addListener(
  		function popUp(request, sender, sendResponse) {
  			
  			
    		myWindow=window.open('','chromeExtensionWebpageAnalyzerResults','width=450,height='+window.screen.availHeight);
    		myWindow.document.open();
    		//TO-DO: Refactor pop-up creation
			myWindow.document.write("<html><head><title>Analysis Report</title><link rel='stylesheet' type='text/css' href='resultPopup.css'></head><body><h1>Webpage Analysis Report</h1>for <a href='"+tab.url+"'target='_blank'>"+tab.title+"</a> page"+request.result+"<script src='jquery-1.10.2.min.js'></script><script src='result.js'></script></body></html>");
			
			myWindow.focus();
			chrome.runtime.onMessage.removeListener(popUp);

      
  	});

  	


});


