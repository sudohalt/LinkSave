/* All rights reserved LinkSave
 *
 * Authors: Muhammad Khalid and Umayah Abdennabi
 *
 * This code is open source and is lincensed under the <insert licnese here>
 * Source code is available on GitHub: <link to github>
 *
 */

function search_for_title(bookmarks, title) {
  for(var i=0; i < bookmarks.length; i++) { 
    if(bookmarks[i].url != null && bookmarks[i].title == title) {
      return bookmarks[i].id;
    } else {
      if(bookmarks[i].children) {  
        // inception recursive stuff to get into the next layer of children
        var id = search_for_title(bookmarks[i].children, title);
        if(id) return id;
      }
    }
  }
  // No results :C
  return false;
}

// Function saves all the currently open tabs in the active chrome window
function saveTabs() {
    var queryInfo = {'lastFocusedWindow': true};
    var folderExists = ""
    /* Check whether the LinkSave folder exists if not create it.  If it does
     * exist use it by getting its id from chrome.storage.sync (that is where 
     * everything is stored).  Since the operations are asynchronous we must do
     * everything in the callback functions. */
    chrome.storage.sync.get('linkSaveFolderExists',
        function(exists) {
            if (chrome.runtime.lastError) {
                console.log("Error unable to determine whether LinkSave folder exists. Message: " + chrome.runtime.lastError.message);
                return;
            }
            /* The first case means that the LinkSave folder exists, and the default
             * case is when the LinkSave folder does not exist.  If it does exists
             * we access it and create the bookmarks within the folder, and if it
             * doesn't we create the bookmark folder and then save the bookmarks.
             * Since the chrome api is asynchronous we have nested asynchrounous 
             * calls to make sure everything is done in the right order.  A problem
             * arises when the user manually deletes the LinkSave folder in this
             * case we have to recreate it and this is handled in case 1. */
            switch(exists["linkSaveFolderExists"]) {
                case 1:
                    /* We have chosen to use chrome.storage.sync instead of 
                     * chrome.storage.sync because we do not want to recreate
                     * the bookmark folder when the user uses a new device */
                    chrome.storage.sync.get('linkSaveFolderId',
                        function(folderId) {
                            if (chrome.runtime.lastError) {
                                console.log("Error: Unable to get LinkSave folder id. Message: " + chrome.runtime.lastError.message);
                                return;
                            }
                            var bookmarkId = folderId["linkSaveFolderId"];
                            console.log("Bookmare ID one" + bookmarkId)
                            chrome.tabs.query(queryInfo, 
                                function(tabs) {   
                                    // Clear the scroll box, and update it with the links that were saved
                                    // Go through all the open tabs and save each one, and update the scroll view
                                    var newScrollView = ""
                                    var recreate = false;
                                    if (document.getElementById("newFolder").checked) {
                                        chrome.bookmarks.create({'parentId' : bookmarkId, 'title' : getCurrentDate(),
                                            function (newFolder) {
                                                for (i = 0; i < tabs.length; i++) {
                                                    if (document.getElementById(i.toString()).checked) {
                                                        console.log("Bookmark ID two" + newFolder.id);
                                                        chrome.bookmarks.create({'parentId': newFolder.id,
                                                            'title': tabs[i].title,
                                                            'url': tabs[i].url},
                                                            function(obj) {
                                                                if (chrome.runtime.lastError) {
                                                                    console.log("Error while accessing id. Message: " + chrome.runtime.lastError.message);
                                                                    console.log("This probably means that you deleted the folder, no worry I will recreate it");
                                                                    recreate = true;
                                                                    break;
                                                                }
                                                            });
                                                        newScrollView += "<li>" + tabs[i].title + "</li>";
                                                    }
                                                }  
                                            }
                                        });
                                    } else {
                                        for (i = 0; i < tabs.length; i++) {
                                            if (document.getElementById(i.toString()).checked) {
                                                console.log("Bookmark ID two" + bookmarkId);
                                                chrome.bookmarks.create({'parentId': bookmarkId,
                                                    'title': tabs[i].title,
                                                    'url': tabs[i].url},
                                                    function(obj) {
                                                        if (chrome.runtime.lastError) {
                                                            console.log("Error while accessing id. Message: " + chrome.runtime.lastError.message);
                                                            console.log("This probably means that you deleted the folder, no worry I will recreate it");
                                                            recreate = true;
                                                            break;
                                                        }
                                                    });
                                                newScrollView += "<li>" + tabs[i].title + "</li>";
                                            }
                                        }
                                    }
                                    // If the user manually deletes the LinkSave 
                                    // folder we have to recreate it.
                                    if (recreate) {
                                        chrome.bookmarks.create({'title': 'LinkSave bookmarks'},
                                            function(newFolder) {
                                                console.log("added folder: " + newFolder.title);
                                                chrome.storage.sync.set({'linkSaveFolderExists' : 1},
                                                    function() {
                                                        console.log("Created new storage");
                                                    });
                                                chrome.storage.sync.set({'linkSaveFolderId' : newFolder.id});
                                                var bookmarkId = newFolder.id;
                                                chrome.tabs.query(queryInfo, 
                                                    function(tabs) {   
                                                        // Clear the scroll box, and update it with the links that were saved
                                                        // Go through all the open tabs and save each one, and update the scroll view
                                                        var newScrollView = ""
                                                        if (document.getElementById("newFolder").checked) {
                                                            chrome.bookmarks.create({'parentId' : bookmarkId, 'title' : getCurrentDate(),
                                                                function (newFolder) {
                                                                    for (i = 0; i < tabs.length; i++) {
                                                                        if (document.getElementById(i.toString()).checked) {
                                                                            console.log("Bookmark ID two" + newFolder.id);
                                                                            chrome.bookmarks.create({'parentId': newFolder.id,
                                                                                'title': tabs[i].title,
                                                                                'url': tabs[i].url},
                                                                                function(obj) {
                                                                                    if (chrome.runtime.lastError) {
                                                                                        console.log("Error while accessing id. Message: " + chrome.runtime.lastError.message);
                                                                                        console.log("This probably means that you deleted the folder, no worry I will recreate it");
                                                                                        recreate = true;
                                                                                        break;
                                                                                    }
                                                                                });
                                                                            newScrollView += "<li>" + tabs[i].title + "</li>";
                                                                        }
                                                                    }  
                                                                }
                                                            });
                                                        } else {
                                                            for (i = 0; i < tabs.length; i++) {
                                                                if (document.getElementById(i.toString()).checked) {
                                                                    console.log("Bookmark ID two" + bookmarkId);
                                                                    chrome.bookmarks.create({'parentId': bookmarkId,
                                                                        'title': tabs[i].title,
                                                                        'url': tabs[i].url},
                                                                        function(obj) {
                                                                            if (chrome.runtime.lastError) {
                                                                                console.log("Error while accessing id. Message: " + chrome.runtime.lastError.message);
                                                                                console.log("This probably means that you deleted the folder, no worry I will recreate it");
                                                                                recreate = true;
                                                                                break;
                                                                            }
                                                                        });
                                                                    newScrollView += "<li>" + tabs[i].title + "</li>";
                                                                }
                                                            }
                                                        }
                                                        document.getElementById("openLinks").innerHTML = newScrollView;
                                                });
                                        });
                                    } else {
                                        document.getElementById("openLinks").innerHTML = newScrollView;
                                    }
                                });
                        });
                    break;
                default:
                    chrome.bookmarks.create({'title': 'LinkSave bookmarks'},
                        function(newFolder) {
                            console.log("added folder: " + newFolder.title);
                            chrome.storage.sync.set({'linkSaveFolderExists' : 1},
                                function() {
                                    console.log("Created new storage");
                                });
                            chrome.storage.sync.set({'linkSaveFolderId' : newFolder.id});
                            var bookmarkId = newFolder.id;
                            chrome.tabs.query(queryInfo, 
                                function(tabs) {   
                                    // Clear the scroll box, and update it with the links that were saved
                                    // Go through all the open tabs and save each one, and update the scroll view
                                    var newScrollView = ""
                                    if (document.getElementById("newFolder").checked) {
                                        chrome.bookmarks.create({'parentId' : bookmarkId, 'title' : getCurrentDate(),
                                            function (newFolder) {
                                                for (i = 0; i < tabs.length; i++) {
                                                    if (document.getElementById(i.toString()).checked) {
                                                        console.log("Bookmark ID two" + newFolder.id);
                                                        chrome.bookmarks.create({'parentId': newFolder.id,
                                                            'title': tabs[i].title,
                                                            'url': tabs[i].url},
                                                            function(obj) {
                                                                if (chrome.runtime.lastError) {
                                                                    console.log("Error while accessing id. Message: " + chrome.runtime.lastError.message);
                                                                    console.log("This probably means that you deleted the folder, no worry I will recreate it");
                                                                    recreate = true;
                                                                    break;
                                                                }
                                                            });
                                                        newScrollView += "<li>" + tabs[i].title + "</li>";
                                                    }
                                                }  
                                            }
                                        });
                                    } else {
                                        for (i = 0; i < tabs.length; i++) {
                                            if (document.getElementById(i.toString()).checked) {
                                                console.log("Bookmark ID two" + bookmarkId);
                                                chrome.bookmarks.create({'parentId': bookmarkId,
                                                    'title': tabs[i].title,
                                                    'url': tabs[i].url},
                                                    function(obj) {
                                                        if (chrome.runtime.lastError) {
                                                            console.log("Error while accessing id. Message: " + chrome.runtime.lastError.message);
                                                            console.log("This probably means that you deleted the folder, no worry I will recreate it");
                                                            recreate = true;
                                                            break;
                                                        }
                                                    });
                                                newScrollView += "<li>" + tabs[i].title + "</li>";
                                            }
                                        }
                                    }
                                    document.getElementById("openLinks").innerHTML = newScrollView;
                            });
                        });
                    break;

            }
        });
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
