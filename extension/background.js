
const iconRules = [{
    conditions: [
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'www.youtube.com'},
        })
    ],
    actions: [new chrome.declarativeContent.ShowPageAction()]
}];
chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules(iconRules);
});
