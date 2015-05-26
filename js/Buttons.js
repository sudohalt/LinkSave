function saveTabs()
{
    // current tab = var queryInfo = { active: true, currentWindow: true };
    // all other tabs = var queryInfo = { active: false, currentWindow: true };

    var queryInfo = {};
    chrome.tabs.query(queryInfo, function(tabs)
    {   
        var tabCount = 1;
        var tabUrls = "";
        var tabTitles = "";
        var currentTabUrl = "";
        document.getElementById("openLinks").innerHTML = "";
        for (i = 0; i < tabs.length; i++)
        {
            currentTabUrl = tabs[i].url;
            if (currentTabUrl.substring(0, 9) != "chrome://" && 
                currentTabUrl.substring(0, 12) != "view-source:" &&
                currentTabUrl.substring(0, 19) != "chrome-extension://")
            {
            	tabUrls += tabs[i].url + "\n";
                tabTitles += tabs[i].title + "\n";
                tabCount++;  
            }
            document.getElementById("openLinks").innerHTML += "<li>" + tabs[i].title + "</li>";
        }
    });
}

function SaveLinks()
{
	saveTabs();
	popupStatus("Links Saved!");
}

function OpenLinks()
{
	popupStatus("Links Opened");
}

function popupStatus(statusText)
{
    document.getElementById('StatusLabel').textContent = statusText;
}

saveTabs();
// FUNCTION CHAINGING is messed up
document.getElementById("SaveLinks").addEventListener("click", function(){ SaveLinks() });
document.getElementById("OpenLinks").addEventListener("click", function(){ OpenLinks() });
