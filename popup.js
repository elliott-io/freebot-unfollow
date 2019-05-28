let startButton = document.getElementById('startButton');
let stopButton = document.getElementById('stopButton');
let username = document.getElementById('username');
let lifetime_count = document.getElementById('lifetime_count')

username.onchange = function() {
    chrome.storage.sync.set({username: username.value}, function() {
        // saved username to storage
        //alert(username.value)
    });
}

window.onload = function(element) {
    chrome.storage.sync.get('username', function(result) {
        // set username field from storage
        username.value = result.username;
    });
    chrome.storage.sync.get('unfollows_lifetime', function(result) {
        // show count with commas
        lifetime_count.innerText = "Lifetime Unfollows: " + parseFloat(result.unfollows_lifetime).toLocaleString('en-US');
    });
}
function unfollow() {
    // run unfollow script
    chrome.tabs.executeScript(null, {
        file: 'base.js'
    }, function(ob) {
        startButton.textContent = "Running..."
    });
}

startButton.onclick = function(element) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0].url != "https://www.instagram.com/" + username.value + "/" &&
        tabs[0].url != "https://www.instagram.com/" + username.value + "/following/" )
        {
            chrome.windows.create({
                url: "https://www.instagram.com/" + username.value + "/",
                type: "normal"
              }, function(win) {
                let background =  chrome.extension.getBackgroundPage();
                background.windowUnfollowId = win.id;
                // win represents the Window object from windows API
                // Do something after opening
                // win.executeScript(null, {
                //     file: 'base.js'
                // }, function(ob) {
                //     startButton.textContent = "Running..."
                // });

                // add listener so callback executes only if window loaded. otherwise calls instantly
                // var listener = function(winId, changeInfo, tab) {
            
                //     alert(changeInfo.status);

                //     if (winId == win.id && changeInfo.status === 'complete') {
                //         // remove listener, so only run once
                //         chrome.windows.onUpdated.removeListener(listener);

                        // run script in new window

                        chrome.runtime.sendMessage({action: "start"}, function(response) {
                        });
                            
                        // win.tabs[0].executeScript(null, {
                        //     file: 'base.js'
                        // }, function(ob) {
                        //     startButton.textContent = "Running..."
                        // });

                //     }
                // }
                // chrome.windows.onUpdated.addListener(listener);
            });
            // chrome.tabs.update(tabs[0].id, {url: "https://www.instagram.com/" + username.value + "/", active: true}, function(tab1) {

            //     // add listener so callback executes only if page loaded. otherwise calls instantly
            //     var listener = function(tabId, changeInfo, tab) {
            
            //         if (tabId == tab1.id && changeInfo.status === 'complete') {
            //             // remove listener, so only run once
            //             chrome.tabs.onUpdated.removeListener(listener);
            //             // enable buttons
            //             //enableStartButton();
            //             unfollow();
            //         }
            //     }
            //     chrome.tabs.onUpdated.addListener(listener);
            // });
        }
        else 
        {
            unfollow();
        }
    });
}

stopButton.onclick = function(element) {
    chrome.tabs.executeScript(null, {
        file: 'stop.js'
    }, function(ob) {
        startButton.textContent = "Resume"
    });
}
