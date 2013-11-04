// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log('Turning ' + tab.url + ' red!');
  	chrome.tabs.executeScript(null, { file: "jquery-1.10.2.min.js",'allFrames' : true }, function() {
    	chrome.tabs.executeScript(null, { 'file': "jquery.simplemodal.1.4.4.min.js", 'allFrames' : true }, function() {
    		chrome.tabs.executeScript(null, { 'file': "content_script.js", 'allFrames' : true })
    	});
	});

	chrome.tabs.insertCSS(null, {file: "resultPopup.css"});
});

