/* All rights reserved LinkSave
 *
 * Authors: Muhammad Khalid (KingMak) and Umayah Abdennabi (sudohalt)
 *
 * This code is open source and is lincensed under the <insert licnese here>
 * Source code is available on GitHub: <link to github>
 *
 */

function search_for_title(bookmarks, title) {
  for(var i=0; i < bookmarks.length; i++) { 
    if(bookmarks[i].url == null && bookmarks[i].title == title) {
      console.log("Found bookmark folder")
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
    chrome.bookmarks.getTree(
      function(bookmarks) {
        var bookmarkId = search_for_title(bookmarks, "LinkSave bookmarks");
        if (bookmarkId == false) {
          console.log("Creating new bookmark folder");
          chrome.bookmarks.create({'title': 'LinkSave bookmarks'},
              function(newFolder) {
                  var bookmarkId = newFolder.id;
                  chrome.tabs.query(queryInfo, 
                      function(tabs) {   
                        // Clear the scroll box, and update it with the links that were saved
                        // Go through all the open tabs and save each one, and update the scroll view
                        var newScrollView = ""
                        if (document.getElementById("saveInNew").checked) {
                          var folderTitle = ""
                          if (document.getElementById("saveInNewName").value == "") {
                            var date = new Date()
                            folderTitle = date.getHours() + ":" + date.getMinutes() + " " + (date.getMonth() + 1) + "/" + date.getDay() + "/" + date.getFullYear();
                          } else {
                            folderTitle = document.getElementById("saveInNewName").value;
                          }
                          var tempScrollView = document.getElementById('openLinks').innerHTML;
                          chrome.bookmarks.create({'parentId' : bookmarkId, 'title' : folderTitle},
                            function (subNewFolder) {
                              document.getElementById('openLinks').innerHTML = tempScrollView;
                              for (i = 0; i < tabs.length; i++) {
                                if (document.getElementById(i.toString()).checked) {
                                  chrome.bookmarks.create({'parentId': subNewFolder.id,
                                    'title': tabs[i].title,
                                    'url': tabs[i].url},
                                    function(obj) {
                                      if (chrome.runtime.lastError) {
                                        console.log("Error while accessing id. Message: " + chrome.runtime.lastError.message);
                                      }
                                  });
                                  newScrollView += "<li>" + tabs[i].title + "</li>";
                                }
                              }  
                          });
                        } else {
                            for (i = 0; i < tabs.length; i++) {
                              if (document.getElementById(i.toString()).checked) {
                                chrome.bookmarks.create({'parentId': bookmarkId,
                                  'title': tabs[i].title,
                                  'url': tabs[i].url},
                                  function(obj) {
                                    if (chrome.runtime.lastError) {
                                      console.log("Error while accessing id. Message: " + chrome.runtime.lastError.message);
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
          chrome.tabs.query(queryInfo, 
            function(tabs) {   
              // Clear the scroll box, and update it with the links that were saved
              // Go through all the open tabs and save each one, and update the scroll view
              var newScrollView = ""
              if (document.getElementById("saveInNew").checked) {
                var folderTitle = ""
                if (document.getElementById("saveInNewName").value == "") {
                  var date = new Date()
                  folderTitle = date.getHours() + ":" + date.getMinutes() + " " + (date.getMonth() + 1) + "/" + date.getDay() + "/" + date.getFullYear();
                } else {
                  folderTitle = document.getElementById("saveInNewName").value;
                }                var tempScrollView = document.getElementById('openLinks').innerHTML;
                chrome.bookmarks.create({'parentId' : bookmarkId, 'title' : folderTitle},
                  function (subNewFolder) {
                    document.getElementById('openLinks').innerHTML = tempScrollView;
                    for (i = 0; i < tabs.length; i++) {
                      if (document.getElementById(i.toString()).checked) {
                        chrome.bookmarks.create({'parentId': subNewFolder.id,
                          'title': tabs[i].title,
                          'url': tabs[i].url},
                          function(obj) {
                            if (chrome.runtime.lastError) {
                              console.log("Error while accessing id. Message: " + chrome.runtime.lastError.message);
                            }
                        });
                        newScrollView += "<li>" + tabs[i].title + "</li>";
                      }
                    }  
                });
              } else {
                for (i = 0; i < tabs.length; i++) {
                  if (document.getElementById(i.toString()).checked) {
                    chrome.bookmarks.create({'parentId': bookmarkId,
                      'title': tabs[i].title,
                      'url': tabs[i].url},
                      function(obj) {
                      if (chrome.runtime.lastError) {
                        console.log("Error while accessing id. Message: " + chrome.runtime.lastError.message);
                      }
                    });
                    newScrollView += "<li>" + tabs[i].title + "</li>";
                  }
                }
              }
              document.getElementById("openLinks").innerHTML = newScrollView;
            });
        }
    });
    // Hide the Save Links button (will reappear when extension is reopened) and show status label
    document.getElementById('saveInNewP').hidden = true;
    document.getElementById("SaveLinks").hidden = true;
    document.getElementById("StatusLabel").textContent = "Links Saved in bookmarks!";
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
document.getElementById("saveInNew").addEventListener("click",
  function() {
    var cond = !document.getElementById('saveInNew').checked;
    if (cond) {
      document.getElementById('saveInNewName').value = "";
      document.getElementById('saveInNewName').disabled = true;
    } else {
      document.getElementById('saveInNewName').disabled = false;
    }
  }
);
