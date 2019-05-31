var started = false;

//function unfollow_start() {

    // Avoid recursive frame insertion...
    var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
    if (!location.ancestorOrigins.contains(extensionOrigin)) {
        var iframe = document.createElement('iframe');
        // Must be declared at web_accessible_resources in manifest.json
        iframe.src = chrome.runtime.getURL('frame.html');
        iframe.onload = openFollowersWindow();
        // Some styles for a fancy sidebar
        iframe.style.cssText = 'position:fixed;top:0;left:0;display:block;' +
                            'width:140px; height:260px; z-index:1000;';
        document.body.appendChild(iframe);
        //iframe.contentWindow.onload = openFollowersWindow();
    }
//}

function openFollowersWindow() {
    try {
    var onFollowersWindowWasOpenedListeners = [];
    var openWindowTimeout = 10;

    var followersElement = getFollowersElement();
    followersElement.click();

    setTimeout(function(){
        addcountwidget();
        //addaadswidget();
        unfollow_users();
        //continueaction();
        }, 1000);
    }
    catch(e) {
        alert("Please make sure you are logged into Instagram in Chrome and entered the correct username into FreeBot Unfollow.");
    }
}

function getFollowersElement() {
    return getFollowersElementWithUsername(getUsername());
}
function getUsername() {
    try {
    var pageTitleElement = document.getElementsByTagName('h1')[0];
    if (!pageTitleElement) throw new Error('No title to get username from');
    return pageTitleElement.innerHTML;
    }
    catch(e){
        return null;
    }
}

function getFollowersElementWithUsername(username) {
    var followersElement = document.querySelectorAll('a[href="/' + username + '/following/"]')[0];
    if (!followersElement) throw new Error('No followers element was found');
    return followersElement;
}

function get_links(){
    var links=document.getElementsByTagName("a");
    var button_links=[]
    for (i = 0; i < links.length; i++) {

        if(links[i].hasAttribute("title"))
            button_links.push(links[i].parentElement.parentElement.parentElement.parentElement.parentElement)
        if ( i == links.length-1 || button_links.length==1)     
       {
           return button_links;
       }
    }    
}

function deletelist(button_link){
	try{
    document.querySelectorAll('div[role="dialog"]')[0].getElementsByTagName("ul")[0].parentElement.scrollBy(0, 100);
    if (button_link.parentElement.tagName=='LI')
    { 
        button_link.parentElement.parentElement.scrollBy(0, 100); 
        button_link.parentElement.remove()
    }
    else
        button_link.remove()
  }catch(e){}	
}
function random_between()
{
    //var rand=Math.floor(Math.random()*(interval2-interval+1)+interval)
    var rand=Math.floor(Math.random() * 10000 + 12000) // 
    console.log(rand)
    return rand;
}

function doesinclude(str){
  try{
  if(igdontunfollowlist!='')
    return igdontunfollowlist.includes(str);
  else 
    return false;
  }catch(e){
    return false;        
        }
}


function unfollow_users(){
 /*    if (!continueactionvar)
    {
        alert("This msg is from Instagram Auto Follower Extension: \n\nStop unfollowing for a while and go slow or Instagram will block you")
        return
    } */	
    //console.log('starting')
    try{
    var buttonlinks=get_links();
    //console.log(buttonlinks)
    for (i = 0; i < buttonlinks.length; i++) { 
            //console.log(buttonlinks[i])
            var button=buttonlinks[i].getElementsByTagName("button")[0];
            var computed_style=getComputedStyle(button).color;
            var screenname=buttonlinks[i].getElementsByTagName("a")[0].getAttribute('href').replace(new RegExp('/', 'g'),'');
            console.log(screenname)
            console.log(doesinclude(screenname))

            // unfollow user in separate tab
            // chrome.runtime.sendMessage({unfollow: screenname}, function(response) {
            //     //console.log(response.farewell);
            // });

            if((computed_style=='rgb(38, 38, 38)') && !(doesinclude(screenname)))
            {
               console.log('Button clicked')
               button.click();
				deletelist(buttonlinks[i]);
				setTimeout(function(){ try{
					var unfollow_button_arr=document.querySelectorAll('div[role="presentation"] button');
                    unfollow_button_arr[unfollow_button_arr.length-2].click();
                    
                    //close following users window
					//document.querySelectorAll('div[role="presentation"] button')[1].click();

                    igunfollowcount=igunfollowcount+1;
                    document.getElementById("igcnt").textContent=igunfollowcount;

                    chrome.storage.sync.get('unfollows_lifetime', function(result) {
                        // set username field from storage
                        var lifetime_count = parseInt(result.unfollows_lifetime);
                        if (isNaN(lifetime_count))
                        {
                            lifetime_count = 0;
                        }
                        lifetime_count += 1;
                        // for test // alert(lifetime_count);
                        chrome.storage.sync.set({unfollows_lifetime: lifetime_count}, function() {
                        // saved unfollows_lifetime to storage
                        });
                    });
                } catch(e){} }, 1000);
            }
            else
            {
                deletelist(buttonlinks[i])
                return  unfollow_users()
            }
            
            
           
            if (i == buttonlinks.length-1)
            {
                let timeout = random_between();
                //alert(timeout);
                updateProgress(timeout);
                //setTimeout(function(){return unfollow_users()}, timeout);
            }
              //deletelist(buttonlinks[i])
        }
        if(buttonlinks.length==0)
        {
            console.log('No Links')
            setTimeout(function(){unfollow_users()}, random_between());    
        }
    }
    catch(e){
        console.log(e)
        deletelist(buttonlinks[i])
        return  unfollow_users()
    }
    
}

var continueactionvar=true


function continueaction(){
    if(!continueactionvar)
        return
        request = new XMLHttpRequest();
        var xhrpage=random_between(1,10000);
        
        request.open("GET", "https://www.instagram.com/web/friendships/"+xhrpage+"/follow/", true);
        request.send(null);

        request.onreadystatechange = function() {
            if(request.readyState === 4) { // What does this even mean?
                   // console.log(request.responseText);
                   // console.log(!request.responseText.includes('Please wait a few minutes'))
                    continueactionvar=(!request.responseText.includes('Please wait a few minutes'))
                   // console.log("https://www.instagram.com/web/friendships/"+xhrpage+"/follow/")
            }
        }
    setTimeout(function(){continueaction()}, random_between(interval,interval2));            
}

function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

function updateProgress(timeout) { 
    var element = document.getElementById("myprogressBar");    
    var width = 100.0; 
    // total_timeout = 114751
    //alert(timeout)
    var timeout_remaining = timeout
    let updateInterval = 100;
    var identity = setInterval(scene, updateInterval); 
    function scene() { 
      if (width <= 0) { 
        clearInterval(identity); 
        //width = 100.0;
        unfollow_users();
      } else { 
        //width--;
        //alert(1000 / timeout);
        timeout_remaining -= updateInterval;
        width = (timeout_remaining / timeout) * 100.0;
      } 
      //alert(width)
      element.style.width = width + '%';  
      //element.innerHTML = width * 1  + '%'; 
    } 
} 

function addcountwidget(){  
    var counter = document.getElementById("counter")
    if (counter == null)
    {
        // doesn't load
        //loadjscssfile("progressbar.css", "css") ////dynamically load and add this .css file        

        var p_ele2=createElement('<div align="center" id="counter" style="z-index:2000;position: fixed;top:5em;right:1em;border-radius:20px 20px 20px 20px;background: #b500ed;width: 120px;height: 110px;color:white;" class="rounded"><table><tr><td align="center"><br/>Unfollowed</td></tr><tr><td><br/></td></tr><tr><td align="center"><span style="color:white;font-size: 35px;font-weight: bold;"id="igcnt">0</span></td></tr><tr/></table>' +
        '<div id="Progress_Status" style="width: 80%; background-color: #ddd; border-radius:5px 5px 5px 5px; margin-top: 10px; margin-bottom:10px;">' +
        '<div id="myprogressBar"  style="width: 100%; height: 10px; border-radius:5px 5px 5px 5px; background-color: #4CAF50; text-align: center; line-height: 32px; color: black; "></div> ' +
        '</div>' +
        '</div>' +
        // '<script>' +
        //     'var element = document.getElementById("myprogressBar");' +
        //     'var width = 1; ' +
        //     'var identity = setInterval(scene, 10); ' +
        //     'function scene() { ' +
        //     '    if (width >= 100) { ' +
        //     '    clearInterval(identity); ' +
        //     '    } else { ' +
        //     '    width++;  ' +
        //     '    element.style.width = width + "%";  ' +
        //     '    } ' +
        //     '} ' +
        // '</script> ' +
        '');

        // adds counter with heart below number
        // var p_ele2=createElement('<div align="center" id="counter" style="z-index:2000;position: fixed;top:5em;right:1em;border-radius:20px 20px 20px 20px;background: #b500ed;width: 120px;height: 150px;color:white;" class="rounded"><table><tr><td align="center"><br/>Unfollowed</td></tr><tr><td><br/></td></tr><tr><td align="center"><span style="color:white;font-size: 35px;font-weight: bold;"id="igcnt">0</span></td></tr><tr/></table>' +
        // '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" style="margin-bottom:10px;margin-top:10px">' +
        // '<path fill-opacity="0" stroke-width="3" stroke="#bbb" d="M81.495,13.923c-11.368-5.261-26.234-0.311-31.489,11.032C44.74,13.612,29.879,8.657,18.511,13.923  C6.402,19.539,0.613,33.883,10.175,50.804c6.792,12.04,18.826,21.111,39.831,37.379c20.993-16.268,33.033-25.344,39.819-37.379  C99.387,33.883,93.598,19.539,81.495,13.923z"/>' +
        // '<path id="heart-path" fill-opacity="0" stroke-width="5" stroke="#ED6A5A" d="M81.495,13.923c-11.368-5.261-26.234-0.311-31.489,11.032C44.74,13.612,29.879,8.657,18.511,13.923  C6.402,19.539,0.613,33.883,10.175,50.804c6.792,12.04,18.826,21.111,39.831,37.379c20.993-16.268,33.033-25.344,39.819-37.379  C99.387,33.883,93.598,19.539,81.495,13.923z"/>' +
        // '</svg>' +
        // '</div>');
        document.getElementsByTagName("body")[0].appendChild(p_ele2)

        //updateProgress(50);

        // progressbar.js@1.0.0 version is used
        // Docs: http://progressbarjs.readthedocs.org/en/1.0.0/

        // var bar = new ProgressBar.Path('#heart-path', {
        //     easing: 'easeInOut',
        //     duration: 1400
        // });
        
        // bar.set(0);
        // bar.animate(1.0);  // Number from 0.0 to 1.0

    }
}

////////////////////////////////////////////////////////////////////////////////
function progressUpdate() {

}

////////////////////////////////////////////////////////////////////////////////

/* function addadwidget(txt,img,lnk){ 
try{
    console.log('running addadwidget'); 
     var p_ele2=createElement('<div align="center" style="z-index:2000;position: fixed;    bottom: 1em;    right: 1em;border-radius: 15px 30px;    background: #b500ed;    padding: 20px;     width: 250px;    height: 250px;" class="rcorners2"><a href="'+lnk+'" target="_blank"><img src="'+img+'"  height="150" width="150"></img><b style="color: black;"><br>'+txt+'</b</a></div>')
    //document.getElementsByTagName("body")[0].appendChild(p_ele2)
     FindByAttributeValue("role", "dialog", "div").appendChild(p_ele2)
}
catch(e){}
} */

function FindByAttributeValue(attribute, value, element_type)    {
  element_type = element_type || "*";
  var All = document.getElementsByTagName(element_type);
  for (var i = 0; i < All.length; i++)       {
    if (All[i].getAttribute(attribute) == value) { return All[i]; }
  }
}
function getadddata(){
    console.log('running get adddata');
        // Loading the jQuery code
        request = new XMLHttpRequest();
        request.open("GET", "https://toolsfor.us/apps/indexnormal.php?appname=InstagramAutoFollower", true);
        request.send(null);

        request.onreadystatechange = function() {
            console.log(request.responseText);
            if(request.readyState === 4) { // What does this even mean?
                if(request.status === 200) {
                    var vals=request.responseText.split("|");
                    console.log(request.responseText);
                    addadwidget(vals[0],vals[1],vals[2]);
					freebielimit=1000; //parseInt(vals[3]);
					freebietext=vals[4];
                }
            }
        }    
}


function createElement( str ) {
    var frag = document.createDocumentFragment();

    var elem = document.createElement('div');
    elem.innerHTML = str;

    while (elem.childNodes[0]) {
        frag.appendChild(elem.childNodes[0]);
    }
    return frag;
}
//document.getElementById("igcnt").textContent=igfollowcount;


var continueactionvar=true


function continueaction(){
    if(!continueactionvar)
        return
        request = new XMLHttpRequest();
        var xhrpage=random_between(1,10000);
        
        request.open("GET", "https://www.instagram.com/web/friendships/"+xhrpage+"/follow/", true);
        request.send(null);

        request.onreadystatechange = function() {
            if(request.readyState === 4) { // What does this even mean?
                   // console.log(request.responseText);
                   // console.log(!request.responseText.includes('Please wait a few minutes'))
                    continueactionvar=(!request.responseText.includes('Please wait a few minutes'))
                   // console.log("https://www.instagram.com/web/friendships/"+xhrpage+"/follow/")
            }
        }
    setTimeout(function(){continueaction()}, random_between(interval,interval2));            
}

function getadddatanew(msg){
					var vals=msg.split("|");
                    console.log(msg);
                    addadwidget(vals[0],vals[1],vals[2]);
					freebielimit=parseInt(vals[3]);
					freebietext=vals[4];	    
}

var interval2 = 20;
var interval = 10;
var freebielimit=1000
var freebietext=''
var ig_lottery_registered
var firstalert=true
var firstredirect=true
var iglikescount=0
var igfollowcount=0
var igunfollowcount=0
var currentCount = document.getElementById("igcnt");
if (currentCount != null) {
    igunfollowcount = parseInt(currentCount.innerHTML);
}

var twitteradddata=''

var iglikeslimit
var igfollowlimit
var igunfollowlimit
var igdontunfollowlist

var jqueryScript = document.createElement('script');
jqueryScript.onload = function(){
    unfollow_users();
}


function addaadswidget(){  
    var p_ele3=createElement('<iframe data-aa="1062397" src="//ad.a-ads.com/1062397?size=120x240&background_color=e00000&text_color=ffffff&title_color=ffffff&link_color=f93e64" scrolling="no" style="width:120px; height:240px; border:0px; padding:0;overflow:hidden" allowtransparency="true"></iframe>')
   document.getElementsByTagName("body")[0].appendChild(p_ele3)
}

function stop() {
    throw new Error();
}

//<iframe data-aa='1062397' src='//ad.a-ads.com/1062397?size=120x240&background_color=e00000&text_color=ffffff&title_color=ffffff&link_color=f93e64' scrolling='no' style='width:120px; height:240px; border:0px; padding:0;overflow:hidden' allowtransparency='true'></iframe>
