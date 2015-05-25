function getAllTabTitles()
{
    // current tab = var queryInfo = { active: true, currentWindow: true };
    // all other tabs = var queryInfo = { active: false, currentWindow: true };

    var queryInfo = {};
    chrome.tabs.query(queryInfo, function(tabs)
    {   
        var tabCount = 1;
        var currentTabUrl = "";
        var passiveTabTitles = [];
        
        for (i = 0; i < tabs.length; i++)
        {
            currentTabUrl = tabs[i].url;
            if (currentTabUrl.substring(0, 9) != "chrome://" && 
                currentTabUrl.substring(0, 12) != "view-source:" &&
                currentTabUrl.substring(0, 19) != "chrome-extension://")
            {
                passiveTabTitles += tabCount < 10 ? "0" + tabCount.toString() : tabCount.toString();
                passiveTabTitles += "   " + tabs[i].title + "\n"; //tabs[i].title
                tabCount++;  
            }
        }

        popupStatus(passiveTabTitles);
    });
}

// test func
function fun()
{
    // current tab = var queryInfo = { active: true, currentWindow: true };
    // all other tabs = var queryInfo = { active: false, currentWindow: true };

    var queryInfo = {};
    chrome.tabs.query(queryInfo, function(tabs)
    {   
        var tabCount = 1;
        var currentTabUrl = "";
        var passiveTabTitles = "";
        
        for (i = 0; i < tabs.length; i++)
        {
            currentTabUrl = tabs[i].url;
            if (currentTabUrl.substring(0, 9) != "chrome://" && 
                currentTabUrl.substring(0, 12) != "view-source:" &&
                currentTabUrl.substring(0, 19) != "chrome-extension://")
            {
                passiveTabTitles += tabCount < 10 ? "0" + tabCount.toString() : tabCount.toString();
                passiveTabTitles += "   " + tabs[i].title + "\n"; //tabs[i].title
                tabCount++;  
            }
        }

        popupStatus(passiveTabTitles);
    });
}

function popupStatus(statusText)
{
    document.getElementById('status').textContent = statusText;
    document.getElementById("status").addEventListener("click", function(){
    alert(statusText); });

}

document.addEventListener('DOMContentLoaded', function() { getAllTabTitles() });
