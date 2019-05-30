//function unfollow_start() {

    // Avoid recursive frame insertion...
    var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
    if (!location.ancestorOrigins.contains(extensionOrigin)) {
        var iframe = document.createElement('iframe');
        // Must be declared at web_accessible_resources in manifest.json
        iframe.src = chrome.runtime.getURL('frame.html');
        iframe.onload = unfollowUser();
        // Some styles for a fancy sidebar
        iframe.style.cssText = 'position:fixed;top:0;left:0;display:block;' +
                            'width:140px; height:260px; z-index:1000;';
        document.body.appendChild(iframe);
        //iframe.contentWindow.onload = openFollowersWindow();
    }
//}

let jspath_followingStatusButton = '#react-root > section > main > div > header > section > div.nZSzR > div.Igw0E.IwRSH.eGOV_._4EzTm > span > span.vBF20._1OSdk > button';
let jspath_unfollowButton = 'body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.-Cab_';

async function unfollowUser() {
    try {
        document.onreadystatechange = function () {
            if (document.readyState == "complete") {
                try 
                {

                    checkElement(jspath_followingStatusButton, "Following") 
                        .then((followingElement) => {
                            followingElement.click();
                            checkElement(jspath_unfollowButton) 
                            .then((unfollowButton) => {
                                unfollowButton.click();
                                checkElement(jspath_followingStatusButton, "Follow") 
                                .then((followElement) => {
                                    closeTab();
                                });
                            });
                        });            
                }
                catch(ex)
                {
                    alert(ex)
                    //closeTab();
                }
            }
        }
    }
    catch(e) {
        alert("Could not find the 'Following' button. Please make sure you are logged into Instagram in Chrome and on your profile page (instagram.com/yourUserName). Or Refresh this page to remove any ads or extension elements.");
        //closeTab();
    }
}

function rafAsync() {
    return new Promise(resolve => {
        requestAnimationFrame(resolve); //faster than set time out
    });
}

function checkElement(selector, textContent = "") {
    var el = document.querySelector(selector);
    if (el === null || (textContent != "" && el.innerHTML != textContent)) {
        return rafAsync().then(() => checkElement(selector));
    } else {
        return Promise.resolve(el);
    }
}

// function getFollowingElement() {
//     var followingElement = document.querySelector('#react-root > section > main > div > header > section > div.nZSzR > div.Igw0E.IwRSH.eGOV_._4EzTm > span > span.vBF20._1OSdk > button');
//     if (!followingElement || followingElement.innerHTML != "Following") throw new Error('No Following button was found');
//     return followingElement; 
// }
// function verifyUnfollowed() {
//     var followElement = document.querySelector('#react-root > section > main > div > header > section > div.nZSzR > div.Igw0E.IwRSH.eGOV_._4EzTm > span > span.vBF20._1OSdk > button');
//     if (followElement && followElement.innerHTML == "Follow") 
//     {
//         return true;
//     };
// }
// function getUnfollowButton() {
//     var unfollowButtonElement = document.querySelector('body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.-Cab_');
//     if (!unfollowButtonElement) throw new Error('No Unfollow button was found');
//     return unfollowButtonElement;
// }

function closeTab(timeout = 1000) {
    // default wait time to close tab is 1 second
    setTimeout(function() {
        chrome.runtime.sendMessage({action: "close_tab"}, function(response) {
        });
    }, timeout);
}