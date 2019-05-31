var windowUnfollowId = -1;
var windowMainId = -1;

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log("The color is green.");
    });
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");

      let unfollow_username = request.unfollow;
      if (request.action == "start") {
        chrome.tabs.executeScript({file: "base.js"});
      }
      else if (request.action == "close_tab") {
        chrome.tabs.remove(sender.tab.id, null);
        //sendResponse({message: sender.tab.id});
      }
      else if (typeof unfollow_username != "undefined") {
        var newURL = "https://www.instagram.com/" + unfollow_username + "/";

        chrome.tabs.create( { windowId: windowUnfollowId, url: newURL }, function(tab) {
          chrome.tabs.executeScript(tab.id, {file: "unfollow-user.js"});
        });
      }
    });

  /////////////////////////////////
  