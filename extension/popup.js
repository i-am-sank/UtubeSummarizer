const summarizeForm = document.getElementById("summarize-form");
const languageForm = document.getElementById("language-form");

summarizeForm.onsubmit = function(e){
    e.preventDefault();
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var e = document.getElementById('lang');
        chrome.tabs.sendMessage(tabs[0].id, {action: "GET_TRANSCRIPT", lang: e.options[e.selectedIndex].value});
		window.close();
    });
}

languageForm.onsubmit = (e) => {
    e.preventDefault();
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "GET_LANGUAGE"}, (langs) => {
            if (typeof langs == "undefined"){
                if (chrome.runtime.lasterror){
                    console.log('error');
                }
            }
            else{
                addLanguageContent(langs);
            }
        });
    });
}

function addLanguageContent(langList){
    
    var langContent = document.createElement('select');
    langContent.id = 'lang'
    let result = '';
        langList.forEach(product => {
            result += `
             <option value=${product.code}>${product.language}</option>
            `;
        });
        langContent.innerHTML = result;
        summarizeForm.appendChild(langContent);
}

