function onRightClick()
{
    alert("this function should:\n- show a popup saying Linked Saved\n- save the link");
}

chrome.contextMenus.create({"title": 'Save Link', "onclick": onRightClick});
