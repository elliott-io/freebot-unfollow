// add google analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-141260128-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

let startButton = document.getElementById('startButton');
//let stopButton = document.getElementById('stopButton');
let username = document.getElementById('username');
let lifetime_count = document.getElementById('lifetime_count')
let unfollow_limit_daily = 1900; // exceeding 2000 may result in a ban from Instagram

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
    // var circle = new ProgressBar.Circle('#progress', {
    //     color: '#FCB03C',
    //     duration: 3000,
    //     easing: 'easeInOut'
    // });

    // circle.animate(1);

        // find status
        chrome.storage.sync.get('status', function(result) {
            var status = result.status;            
            if (status == "running" || status == "started") {
                startButton.textContent = "Pause";
                startButton.className = "button";
            }
            else {
                startButton.className = "button is-success";
                startButton.textContent = "Start";
            }
        });
}
function unfollow() {

    _gaq.push(['_trackEvent', 'session', 'started']);

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

    // check daily limit to prevent user getting banned by Instagram for too manu unfollows
    chrome.storage.sync.get('unfollows_daily_date', function(result) {
        let daily_date = result.unfollows_daily_date;
        let today = new Date().toLocaleDateString();
        if (typeof daily_date != "undefined") {
            if (daily_date == today) {
                // there have been unfollows today
                //alert("boo");
                chrome.storage.sync.get('unfollows_daily_count', function(result) {
                    let daily_count = parseInt(result.unfollows_daily_count);
                    // check if unfollows for today reaches the max limit from Instagram
                    if (daily_count >= unfollow_limit_daily) {
                        alert("FreeBot has unfollowed " + daily_count + " users for you today.\n\nYou're too close to Instagram's daily unfollow limits for FreeBot to keep going without risking your account being banned.\n\nPlease try again tomorrow.");
                        return;
                    } else {
                        checkExisting();
                    }
                });
            }
            else {
                // no unfollows today
                //alert("yay");
                chrome.storage.sync.set({unfollows_daily_date: today}, function() {
                    // saved to storage
                });
                chrome.storage.sync.set({unfollows_daily_count: 0}, function() {
                    // saved to storage
                });
                checkExisting();
            }
        } else {
            // no unfollows today
            //alert("yay");
            chrome.storage.sync.set({unfollows_daily_date: today}, function() {
                // saved to storage
            });
            chrome.storage.sync.set({unfollows_daily_count: 0}, function() {
                // saved to storage
            });
            checkExisting();
        }
    });
}
function checkExisting() {
    let background =  chrome.extension.getBackgroundPage();
    //alert(background.tabUnfollowId);
    chrome.tabs.get(background.tabUnfollowId, function(tab) {
    //    alert(tab);
        if (typeof tab != "undefined") {
            if (startButton.textContent == "Start") {
                resume();
            } 
            else if (startButton.textContent == "Pause") {
                pause();
            }
        }
        else {
            start();
        }
    });
}
function start() {
    chrome.storage.sync.set({status: "started"}, function() {
        // saved to storage
    });
    _gaq.push(['_trackEvent', 'session', 'started']);
    startButton.textContent = "Pause";
    startButton.className = "button";

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
                background.tabUnfollowId = win.tabs[0].id;
                // // run script in new window
                chrome.tabs.executeScript(background.tabUnfollowId, {
                    file: 'base.js'
                }, function(ob) {
                    chrome.tabs.sendMessage(background.tabUnfollowId, {action: "start"}, function(response) {
                        alert(response.farewell);
                      });    
                });
            });
        }
        else 
        {
            unfollow();
        }
    });
}
function pause() {
    let background =  chrome.extension.getBackgroundPage();
    //alert("pause: " + background.tabUnfollowId);
    chrome.tabs.sendMessage(background.tabUnfollowId, {action: "pause"}, function(response) {
//        alert(response.action);
        startButton.textContent = "Start";
        startButton.className = "button is-success";
        chrome.storage.sync.set({status: "paused"}, function() {
            // saved to storage
        });
    });
}
function resume() {
    let background =  chrome.extension.getBackgroundPage();
    //alert("resume: " + background.tabUnfollowId);
    chrome.tabs.sendMessage(background.tabUnfollowId, {action: "resume"}, function(response) {
//        alert(response.action);
        startButton.textContent = "Pause";
        startButton.className = "button";
        chrome.storage.sync.set({status: "running"}, function() {
            // saved to storage
        });
    });        
}