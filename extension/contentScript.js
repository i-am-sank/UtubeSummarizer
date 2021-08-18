function addTranscriptContent(transcript){
    var divContent = document.getElementById("meta");
    var transContent = document.createElement('p');
    transContent.appendChild(document.createTextNode(transcript));
    
    transContent.className = 'ytb-transcript';
    transContent.style.color = 'rgb(70,70,70)';
    transContent.style.fontSize = "medium";
    transContent.style.margin = '5px';
    transContent.style.padding = '3px';
    transContent.style.backgroundColor = 'rgb(245,245,245)';
    transContent.style.fontFamily = "cursive"
    divContent.appendChild(transContent);
}

function getVideoTranscript(langcode){
    console.log("ready...");
    const youtubeUrl = window.location.href
    const youtubeVideoId = youtubeUrl.split("=")[1]
    if (typeof langcode === "undefined")
    {
        url = "http://localhost:5000/api/summarize/" + youtubeVideoId
    }
    else{
        url = "http://localhost:5000/api/summarize/" + langcode +"/"+ youtubeVideoId
    }
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url);
    xhttp.onload = (res) => { 
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
              var response = JSON.parse(xhttp.responseText);
              addTranscriptContent(response.transcript)
            } else {
              console.error(xhttp.statusText);
            }
        }
    };
    xhttp.onerror = (e) => {
        console.error(xhttp.statusText);
    }
    xhttp.send();
}

window.onload = () => {
    const youtubeUrl = window.location.href
    const youtubeVideoId = youtubeUrl.split("=")[1]
    url = "http://localhost:5000/api/language/" + youtubeVideoId
    
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url);
    xhttp.onload = (res) => { 
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                langList = JSON.parse(xhttp.responseText);
            } else {
            console.error(xhttp.statusText);
            }
        }
    };
    xhttp.onerror = (e) => {
        console.error(xhttp.statusText);
    }
    xhttp.send();
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if(message.action === 'GET_TRANSCRIPT'){
        console.log(message.lang);
        getVideoTranscript(message.lang);
    }
    else if (message.action === 'GET_LANGUAGE'){
        sendResponse(langList);
    }
});