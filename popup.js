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
    // for testing
    // chrome.storage.sync.remove('username', function(result) {
    // });
    chrome.storage.sync.get('username', function(result) {
        let saved_username = result.username;
        if (typeof saved_username != "undefined") {
            // set username field from storage
            username.value = saved_username;
        }
    });
    chrome.storage.sync.get('unfollows_lifetime', function(result) {
        let saved_count = result.unfollows_lifetime;
        if (typeof saved_count != "undefined") {
            // show count with commas
            lifetime_count.innerText = "Lifetime Unfollows: " + parseFloat(result.unfollows_lifetime).toLocaleString('en-US');
        }
    });
    var circle = new ProgressBar.Circle('#progress', {
        color: '#FCB03C',
        duration: 3000,
        easing: 'easeInOut'
    });

    circle.animate(1);
}
function unfollow() {
    // run unfollow script
    chrome.tabs.executeScript(null, {
        file: 'base.js'
    }, function(ob) {
        //startButton.textContent = "Running..."
    });
}

startButton.onclick = function(element) {

    if (username.value == "") {
        alert("Please add a username to start.")
        return;
    }
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0].url != "https://www.instagram.com/" + username.value + "/" &&
        tabs[0].url != "https://www.instagram.com/" + username.value + "/following/" )
        {
            // let background = chrome.extension.getBackgroundPage();
            // background.windowMainId = chrome.window.currentWindow.id;

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
