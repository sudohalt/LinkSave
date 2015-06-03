/* All rights reserved LinkSave
 *
 * Authors: Muhammad Khalid and Umayah Abdennabi
 *
 * This code is open source and is lincensed under the <insert licnese here>
 * Source code is available on GitHub: <link to github>
 *
 */

// Function saves all the currently open tabs in the active chrome window
function saveTabs() {
    var queryInfo = {'lastFocusedWindow': true};
    var bookmarkId = null;
    var folderExists = ""
    chrome.storage.sync.get('linkSaveFolderExists',
        function(exists) {
            if (chrome.runtime.lastError) {
                console.log("Error unable to determine whether LinkSave folder exists");
                return;
            }
            switch(exists["linkSaveFolderExists"]) {
                case 1:
                    chrome.storage.sync.get('linkSaveFolderId',
                        function(folderId) {
                            if (chrome.runtime.lastError) {
                                console.log("Error: Unable to get LinkSave folder id");
                                return;
                            }
                            bookmarkId = folderId["linkSaveFolderId"];
                        }
                    );
                    chrome.tabs.query(queryInfo, 
                        function(tabs) {   
                            // Clear the scroll box, and update it with the links that were saved
                            // Go through all the open tabs and save each one, and update the scroll view
                            var newScrollView = ""
                            for (i = 0; i < tabs.length; i++) {
                                if (document.getElementById(i.toString()).checked) {
                                    chrome.bookmarks.create({'parentId': bookmarkId,
                                        'title': tabs[i].title,
                                        'url': tabs[i].url});
                                    newScrollView += "<li>" + tabs[i].title + "</li>";
                                }
                            }
                            document.getElementById("openLinks").innerHTML = newScrollView;
                    });
                    break;
                default:
                    chrome.tabs.query(queryInfo, 
                        function(tabs) {   
                            // Clear the scroll box, and update it with the links that were saved
                            // Go through all the open tabs and save each one, and update the scroll view
                            var newScrollView = ""
                            for (i = 0; i < tabs.length; i++) {
                                if (document.getElementById(i.toString()).checked) {
                                    chrome.bookmarks.create({'parentId': bookmarkId,
                                        'title': tabs[i].title,
                                        'url': tabs[i].url});
                                    newScrollView += "<li>" + tabs[i].title + "</li>";
                                }
                            }
                            document.getElementById("openLinks").innerHTML = newScrollView;
                    });
                    chrome.bookmarks.create({'title': 'LinkSave bookmarks'},
                        function(newFolder) {
                            console.log("added folder: " + newFolder.title);
                            chrome.storage.sync.set({'linkSaveFolderExists' : 1},
                                function() {
                                    console.log("Created new storage");
                                });
                            chrome.storage.sync.set({'linkSaveFolderId' : newFolder.id});
                            bookmarkId = newFolder.id;
                        }
                    );
                    break;

            }
        }
    );
    // Hide the Save Links button (will reappear when extension is reopened) and show status label
    document.getElementById("SaveLinks").hidden = true;
    document.getElementById("StatusLabel").textContent = "Links Saved!";
    document.getElementById("TopLabel").textContent = "Saved Tabs"
}

// Function displays all the open tabs in the currently active window in a 
// scroll box.  Checkboxs are added by each link to include it in the save
function viewTabs() {
    var queryInfo = {lastFocusedWindow: true};
    chrome.tabs.query(queryInfo, function(tabs) {
        document.getElementById("openLinks").innerHTML = "";
        for (i = 0; i < tabs.length; i++) {
            document.getElementById("openLinks").innerHTML += 
                "<li><input type=\"checkbox\" id = \"" + i.toString() + "\" checked>" + 
                tabs[i].title + "</li>";
        }
    });
}

// Display all currently open tabs on active window when extension is open
viewTabs();
document.getElementById("SaveLinks").addEventListener("click", 
    function() { 
        saveTabs() 
    }
);
