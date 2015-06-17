/* File: Button.js
 * All rights reserved LinkSave
 * Version: 1.0
 * Authors: Muhammad Khalid (KingMak) and Umayah Abdennabi (sudohalt)
 *
 * Source code is available on GitHub: https://github.com/sudohalt/LinkSave
 *
 * This is where everything important in LinkSave happens.  LinkSave 
 * is a chrome-extension to save all currently open tabs in the active
 * window.  This is done through a simple UI that allows the user to
 * select the tabs that they want to save, and then save the links of 
 * each tabs.  Saving here means bookmarking.  Everthing is bookmarked
 * in the "LinkSave" folder in the bookmark folder.
 */

var checkedTabsArr = {};
var tabTitles = [];

/* This function searches the bookmark tree starting at the root
 * for the LinkSave folder, if it is found the id is returned if
 * not false is returned. */
function findFolder(bookmarks, title) {
    for (var i = 0; i < bookmarks.length; i++) {
        if (bookmarks[i].url == null && bookmarks[i].title == title) {
            return bookmarks[i].id;
        } else {
            if (bookmarks[i].children) {
                var id = findFolder(bookmarks[i].children, title);
                if (id) return id;
            }
        }
    }
    return false;
}

// Function saves all the currently open tabs in the active chrome window
function saveTabs(params) {
    var folderName = params;
    var queryInfo = {
        'lastFocusedWindow': true
    };
    var folderExists = ""
        /* Get the bookmark tree and use the findFolder to see if the LinkSave folder
         * exists.  If it does exist we create the bookmarks in that folder, or in a 
         * new folder within it if the checkbox is clicked.  If the folder does not exist
         * we create it and then do the above. Since the operations are asynchronous 
         * we must do everything in the callback functions, so there is a lot of nesting */
    chrome.bookmarks.getTree(
        function(bookmarks) {
            var bookmarkId = findFolder(bookmarks, "LinkSave bookmarks");
            // bookmark folder does not exist so create it
            if (bookmarkId == false) {
                chrome.bookmarks.create({
                        'title': 'LinkSave bookmarks'
                    },
                    function(newFolder) {
                        var bookmarkId = newFolder.id;
                        // Go through all the open tabs and bookmark the links
                        chrome.tabs.query(queryInfo,
                            function(tabs) {
                                // Clear the scroll box, and update it with the links that were saved
                                // Go through all the open tabs and save each one, and update the scroll view
                                var newScrollView = ""
                                    // The user wants to save the tabs in a new folder (within LinkSave folder)
                                if (document.getElementById("saveInNew").checked) {
                                    // The name of the new folder will be the date if nothing is entered otherwise
                                    // it will be the name the user entered in the textbox below the checkbox

                                    // We create a new folder within the LinkSave folder by setting the parent as the LinkSave folder
                                    chrome.bookmarks.create({
                                            'parentId': bookmarkId,
                                            'title': folderName
                                        },
                                        function(subNewFolder) {
                                            // Go through all the tabs only saving the checked ones
                                            for (i = 0; i < tabs.length; i++) {
                                                tabTitles.push(tabs[i].title);
                                                if (checkedTabsArr[i.toString()]) {
                                                    chrome.bookmarks.create({
                                                            'parentId': subNewFolder.id,
                                                            'title': tabs[i].title,
                                                            'url': tabs[i].url
                                                        },
                                                        function(obj) {
                                                            if (chrome.runtime.lastError) {
                                                                console.log("Error while accessing id. Message: " + chrome.runtime.lastError.message);
                                                            }
                                                        }); // end chrome.bookmarks.create
                                                }
                                            }
                                        }); // end chrome.bookmarks.create
                                } else { // User just wants to save everything in the root of the LinkSave folder
                                    for (i = 0; i < tabs.length; i++) {
                                        if (document.getElementById(i.toString()).checked) {
                                            chrome.bookmarks.create({
                                                    'parentId': bookmarkId,
                                                    'title': tabs[i].title,
                                                    'url': tabs[i].url
                                                },
                                                function(obj) {
                                                    if (chrome.runtime.lastError) {
                                                        console.log("Error while accessing id. Message: " + chrome.runtime.lastError.message);
                                                    }
                                                }); // end chrome.bookmarks.create
                                            newScrollView += "<li>" + tabs[i].title + "</li>";
                                        }
                                    }
                                }
                                if (document.getElementById("saveInNew").checked) {
                                    document.getElementById("openLinks").innerHTML = "";
                                    for (i = 0; i < tabs.length; i++) {
                                        if (checkedTabsArr[i.toString()]) {
                                            document.getElementById("openLinks").innerHTML += "<li>" + tabs[i].title + "</li>";
                                        }
                                    }
                                } else {
                                    document.getElementById("openLinks").innerHTML = newScrollView;
                                }
                            }); // end chrome.tabs.query
                    }); // end chrome.bookmarks.create
            } else { // The Folder has already been created, so do the same as above just not creating the LinkSave folder
                chrome.tabs.query(queryInfo,
                    function(tabs) {
                        var newScrollView = ""
                            // Create new folder
                        if (document.getElementById("saveInNew").checked) {

                            var tempScrollView = document.getElementById("openLinks").innerHTML;
                            chrome.bookmarks.create({
                                    'parentId': bookmarkId,
                                    'title': folderName
                                },
                                function(subNewFolder) {
                                    //console.log(tabs.length);
                                    for (i = 0; i < tabs.length; i++) {
                                        tabTitles.push(tabs[i].title);
                                        if (checkedTabsArr[i.toString()]) {
                                            chrome.bookmarks.create({
                                                    'parentId': subNewFolder.id,
                                                    'title': tabs[i].title,
                                                    'url': tabs[i].url
                                                },
                                                function(obj) {
                                                    if (chrome.runtime.lastError) {
                                                        console.log("Error while accessing id. Message: " + chrome.runtime.lastError.message);
                                                    }
                                                }); // end chrome.bookmarks.create
                                        }
                                    }
                                }); // end chrome.bookmarks.create
                        } else {
                            for (i = 0; i < tabs.length; i++) {
                                if (document.getElementById(i.toString()).checked) {
                                    chrome.bookmarks.create({
                                            'parentId': bookmarkId,
                                            'title': tabs[i].title,
                                            'url': tabs[i].url
                                        },
                                        function(obj) {
                                            if (chrome.runtime.lastError) {
                                                console.log("Error while accessing id. Message: " + chrome.runtime.lastError.message);
                                            }
                                        }); // end chrome.bookmarks.create
                                    newScrollView += "<li>" + tabs[i].title + "</li>";
                                }
                            }
                        }

                        if (document.getElementById("saveInNew").checked) {
                            document.getElementById("openLinks").innerHTML = "";
                            for (i = 0; i < tabs.length; i++) {
                                if (checkedTabsArr[i.toString()]) {
                                    document.getElementById("openLinks").innerHTML += "<li>" + tabs[i].title + "</li>";
                                }
                            }
                        } else {
                            document.getElementById("openLinks").innerHTML = newScrollView;
                        }
                    }); // end chrome.tabs.query
            } // end else
        }); // end chrome.bookmarks.getTree

    // Hide the Save Links button (will reappear when extension is reopened) and show status label
    document.getElementById('saveInNewP').hidden = true;
    document.getElementById("SaveLinks").hidden = true;
    document.getElementById("StatusLabel").textContent = "Links Saved in bookmarks!";
    document.getElementById("TopLabel").textContent = "Saved Tabs"
}

// Function displays all the open tabs in the currently active window in a 
// scroll box.  Checkboxs are added by each link to include it in the save
function viewTabs() {
    var queryInfo = {
        lastFocusedWindow: true
    };

    // Go through all the tabs open, and add them to the scrollview along with a number and checkbox
    chrome.tabs.query(queryInfo, function(tabs) {

        for (i = 0; i < tabs.length; i++) {
            var thisTab = tabs[i];

            // add checkboxes to each link for the user to include or disclude
            // start by creating a blank checkbox element
            var thisCheckbox = document.createElement('input');
            thisCheckbox.type = "checkbox";
            thisCheckbox.id = i;
            thisCheckbox.checked = true;

            //Add the event listener to the newly created checkbox
            attachChangeListener(thisCheckbox, i);
            //console.log(thisCheckbox);

            // create a blank <li>
            var thisListItem = document.createElement('li');

            // add the checkbox and tab title to <li>
            thisListItem.appendChild(thisCheckbox);
            thisListItem.appendChild(document.createTextNode(thisTab.title));

            // add <li> to the end of the openLinks element and add a new value to the array
            document.getElementById("openLinks").appendChild(thisListItem);
            checkedTabsArr[i] = true;

            //console.log(tabs[i].title + ": " + thisCheckbox.checked);

        }

        function toggle(checkbox, title) {
            //console.log("CLICK EVENT FOR: " + title);

            //toggle the state of the checkbox
            checkbox.checked = !checkbox.checked;
            //console.log(title + " updated: " + checkbox.checked);


        }

        function attachChangeListener(element, index) {
            $(element).change(function() {
                if ($(this).is(":checked")) {
                    //match the array's value to that of the new checkbox state
                    checkedTabsArr[index] = true;
                    //console.log(checkedTabsArr);
                } else {
                    //match the array's value to that of the new checkbox state
                    checkedTabsArr[index] = false;
                    // console.log(checkedTabsArr);
                }
            });
        }
    });
}

// Display all currently open tabs on active window when extension is open
viewTabs();

// chrome api does not allow for inline js for security reasons so we add it here
document.getElementById("SaveLinks").addEventListener("click", function() {
    var folderName;
    if (document.getElementById('saveInNew').checked) {
        folderName = document.getElementById('saveInNewName').value
        if (folderName === "") {
            var date = new Date();
            folderName = date.getHours() + ":" + date.getMinutes() + " " + (date.getMonth() + 1) + "/" + date.getDay() + "/" + date.getFullYear();
        }
    } else {
        folderName = "";
    }
    saveTabs(folderName);
});

document.getElementById("saveInNew").addEventListener("click", function() {
        var cond = !document.getElementById('saveInNew').checked;
        if (cond) {
            document.getElementById('saveInNewName').value = "";
            document.getElementById('saveInNewName').disabled = true;
            document.getElementById("saveInNewName").style.visibility = "hidden";


        } else {
            document.getElementById('saveInNewName').disabled = false;
            document.getElementById("saveInNewName").style.visibility = "visible";

        }
    }
);
