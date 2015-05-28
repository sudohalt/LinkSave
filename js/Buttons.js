var showStatsBool = false;

function saveTabs()
{
    // current tab = var queryInfo = { active: true, currentWindow: true };
    // all other tabs = var queryInfo = { active: false, currentWindow: true };

    var queryInfo = {'lastFocusedWindow': true};
    var bookmarkId = null;
    chrome.bookmarks.create({'title': 'LinkSave bookmarks'},
                          function(newFolder) {
    console.log("added folder: " + newFolder.title);
    bookmarkId = newFolder.id;
    });
    chrome.bookmarks.getTree(function(c) {console.log(c);});
    chrome.tabs.query(queryInfo, function(tabs)
    {   
        var tabCount = 1;
        var tabUrls = "";
        var tabTitles = "";
        var currentTabUrl = "";
        // Creat folder
        document.getElementById("openLinks").innerHTML = "";
        for (i = 0; i < tabs.length; i++)
        {
            chrome.bookmarks.create({'parentId': bookmarkId,
                               'title': tabs[i].title,
                               'url': tabs[i].url});
            document.getElementById("openLinks").innerHTML += "<li>" + tabs[i].title + "</li>";
        }
    });
}

function viewTabs() {
    var queryInfo = {lastFocusedWindow: true};
    chrome.tabs.query(queryInfo, function(tabs) {
        var currentTabUrl = "";
        document.getElementById("openLinks").innerHTML = "";
        for (i = 0; i < tabs.length; i++) {
            document.getElementById("openLinks").innerHTML += "<li><input type=\"checkbox\" checked>" + tabs[i].title + "</li>";
        }
    });
}

function SaveLinks()
{
	saveTabs();
    document.getElementById("SaveLinks").hidden = true;
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

function ShowStats() {
    if (showStatsBool != true) {
        var totalBlocked = 123; 
        var shareString = "<br>Share on:<br><img src=''><img src=''><img src=''>"
        document.getElementById("StatsBox").innerHTML = "<b>Total: </b>" + totalBlocked + shareString; 
        showStatsBool = true;
    } else {
        document.getElementById("StatsBox").innerHTML = "";
        showStatsBool = false;
    }
}

viewTabs();
// FUNCTION CHAINGING is messed up
document.getElementById("SaveLinks").addEventListener("click", function() { SaveLinks() });
document.getElementById("Stats").addEventListener("click", function() { ShowStats() });
