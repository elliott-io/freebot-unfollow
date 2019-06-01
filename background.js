var windowUnfollowId = -1;
var tabUnfollowId = 0;
var windowMainId = -1;

chrome.runtime.onSuspend.addListener(function() {
  //alert("suspended");
  // Do some simple clean-up tasks.
  chrome.storage.sync.set({status: "received chrome.runtime.onSuspend"}, function() {
    // saved to storage
  });
});

chrome.runtime.onRestarted.addListener(function() {
  alert("restarted");
  chrome.storage.sync.set({status: "restarted"}, function() {
    // saved to storage
  });
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
