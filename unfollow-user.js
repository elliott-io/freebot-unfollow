//function unfollow_start() {

    // Avoid recursive frame insertion...
    var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
    if (!location.ancestorOrigins.contains(extensionOrigin)) {
        var iframe = document.createElement('iframe');
        // Must be declared at web_accessible_resources in manifest.json
        iframe.src = chrome.runtime.getURL('/ads/aads.html');
        iframe.onload = unfollowUser();
        // Some styles for a fancy sidebar
        iframe.style.cssText = 'position:fixed;top:0;left:0;display:block;' +
                            'width:140px; height:260px; z-index:1000;';
        document.body.appendChild(iframe);
        //iframe.contentWindow.onload = openFollowersWindow();
    }
//}

// most profiles have this js_path




// this path caused the process to get stuck. Profile: https://www.instagram.com/sabrina_nicole_8/
                  // document.querySelector("#react-root > section > main > div > header > section > div.Y2E37 > div > span > span.vBF20._1OSdk > button")



let jspath_followingStatusButton_option_1 = '#react-root > section > main > div > header > section > div.nZSzR > div.Igw0E.IwRSH.eGOV_._4EzTm > span > span.vBF20._1OSdk > button';
// this profile has an alternate "Following" button js_path: https://www.instagram.com/vheinrich75/
let jspath_followingStatusButton_option_2 = '#react-root > section > main > div > header > section > div.nZSzR > button';
// difference in profiles can be noticed with no down arrow button next to their "Following" button

//// notes
//let jspath_followingStatusButton_option_1 = '#react-root > section > main > div > header > section > div > div > span > span > button';
//let jspath_followingStatusButton_option_2 = '#react-root > section > main > div > header > section > div > button';
                                         // #react-root > section > main > div > header > section > div.Y2E37 > div > span > span.vBF20._1OSdk > button
// let xpath_followingStatusButton_option_1 = '//*[@id="react-root"]/section/main/div/header/section/div[2]/div/span/span[1]/button';
// let xpath_followingStatusButton_option_2 = '//*[@id="react-root"]/section/main/div/header/section/div[2]/button';
//// end notes
//let xpath_unfollowButton = '/html/body/div[3]/div/div/div[3]/button[1]';
let jspath_unfollowButton = 'body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.-Cab_';
//let jspath_unfollowButton = 'body > div > div > div > div > button';

async function unfollowUser() {
    try {
        document.onreadystatechange = function () {
            if (document.readyState == "complete") {
                try 
                {

                    checkElement([jspath_followingStatusButton_option_1, jspath_followingStatusButton_option_2], "Following") 
                        .then((followingElement) => {
                            followingElement.click();
                            index = 0;
                            checkElement([jspath_unfollowButton]) 
                            .then((unfollowButton) => {
                                unfollowButton.click();
                                index = 0;
                                checkElement([jspath_followingStatusButton_option_1, jspath_followingStatusButton_option_2], "Follow", "Follow Back") 
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

var index = 0;
function checkElement(selector, textContent = "", textContentAlt = "") {
    
    //alert(textContent + " || " + index + " || " + selector[index]);

    var el = document.querySelector(selector[index]);
    //var el = document.querySelector(selector);
    // 
    //var el = document.evaluate("//html[1]/body[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    //var el = document.evaluate("//*[@id='react-root']/section/main/div/header/section/div[2]/button", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    //var el = document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    //var el = document.evaluate(selector[index], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    //alert(el);
    // if (el != null){
    //     alert("el.innerHTML: " + el.innerHTML);
    // }
    if (el != null && (el.innerHTML == textContent || el.innerHTML == textContentAlt))
    {
        return Promise.resolve(el);
    }
    //if (el === null || (textContent != "" && el.innerHTML != textContent))
    else
    {
        // try different path
        if (selector.length > index + 1) {
            index += 1;
            //alert(index + " || " + selector[index]);
            return rafAsync().then(() => checkElement(selector, textContent, textContentAlt));
        } else {
            index = 0;
            //alert(index + " || " + selector[index]);
            return rafAsync().then(() => checkElement(selector, textContent, textContentAlt));
        }
    }
    }    // else if (textContent != "" && el.innerHTML != textContent) {
    //     alert(index + "wrong innerHTML: " + el.innerHTML);
    //     return rafAsync().then(() => checkElement(selector[index], textContent));
    // } 
//     else {
// //        alert(el.innerHTML);
//         return Promise.resolve(el);
//     }
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