var windowUnfollowId = -1;
var tabUnfollowId = 0;
var windowMainId = -1;

// add google analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-141260128-1']);
_gaq.push(['_trackPageview']);

// add google analytics script
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

chrome.tabs.onRemoved.addListener(function(tabId) { 
  //alert("tab removed with id: " + tabId);
  if (tabId == tabUnfollowId) {
    tabUnfollowId = 0;
    chrome.storage.sync.set({status: "received chrome.tabs.onRemoved"}, function() {
      // saved to storage
    });
  }
});

chrome.windows.onRemoved.addListener(function(windowId) { 
  //alert("window removed with id: " + windowId);
  if (windowId == windowUnfollowId) {
    tabUnfollowId = 0;
    chrome.storage.sync.set({status: "received chrome.windows.onRemoved"}, function() {
      // saved to storage
    });
  }
});
// chrome.runtime.onSuspend.addListener(function() {
//   //alert("onSuspend");
//   // Do some simple clean-up tasks.
//   tabUnfollowId = 0;
//   chrome.storage.sync.set({status: "received chrome.runtime.onSuspend"}, function() {
//     // saved to storage
//   });
// });

// chrome.runtime.onSuspendCanceled.addListener(function() {
//   alert("onSuspendCanceled");
//   // Do some simple clean-up tasks.
//   tabUnfollowId = 0;
//   chrome.storage.sync.set({status: "received chrome.runtime.onSuspendCanceled"}, function() {
//     // saved to storage
//   });
// });

// chrome.runtime.onRestarted.addListener(function() {
// //  alert("restarted");
//   chrome.storage.sync.set({status: "restarted"}, function() {
//     // saved to storage
//   });
// });

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
  //alert("message received");
  let analytics_action = request.analytics;
    if (analytics_action == "unfollow") {
      //stop("paused");
      //sendResponse({action: "paused"});
      _gaq.push(['_trackEvent', 'bot', 'unfollow']);
    }
    else if (analytics_action == "started" || analytics_action == "resumed") {
      _gaq.push(['_trackEvent', 'session', analytics_action]);
    }
    else if (request.action == "close_tab") {
      chrome.tabs.remove(sender.tab.id, null);
    }

  });

// chrome.runtime.onInstalled.addListener(function() {
//     chrome.storage.sync.set({color: '#3aa757'}, function() {
//       console.log("The color is green.");
//     });
//   });
  // chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  //   chrome.declarativeContent.onPageChanged.addRules([{
  //     conditions: [new chrome.declarativeContent.PageStateMatcher({
  //       pageUrl: {hostEquals: 'developer.chrome.com'},
  //     })
  //     ],
  //         actions: [new chrome.declarativeContent.ShowPageAction()]
  //   }]);
  // });

  // chrome.runtime.onMessage.addListener(
  //   function(request, sender, sendResponse) {
  //     console.log(sender.tab ?
  //                 "from a content script:" + sender.tab.url :
  //                 "from the extension");

  //       alert("message received");
  //       if (typeof request.start != "undefined") {
  //         unfollow_start();
  //       }
  //   //let unfollow_username = request.unfollow;
  //   //   alert(sender.tab.url);
  //   //   if (typeof request.start != "undefined") {
  //   //     let tabId = request.start;
  //   //     alert(tabId);
  //   //     chrome.tabs.executeScript(tabId, {file: "base.js"});
  //   //     // chrome.runtime.sendMessage(tabId, {limit: unfollow_limit_daily}, function(response) {
  //   //     //   alert("limit sent rto tabId: " + tabId);
  //   //     // });
  //   //   }
  //   //   else if (request.action == "close_tab") {
  //   //     chrome.tabs.remove(sender.tab.id, null);
  //   //     //sendResponse({message: sender.tab.id});
  //   //   }
  //   //   // else if (typeof unfollow_username != "undefined") {
  //   //   //   var newURL = "https://www.instagram.com/" + unfollow_username + "/";

  //   //   //   chrome.tabs.create( { windowId: windowUnfollowId, url: newURL }, function(tab) {
  //   //   //     chrome.tabs.executeScript(tab.id, {file: "unfollow-user.js"});
  //   //   //   });
  //   //   // }
  //   });

  /////////////////////////////////
