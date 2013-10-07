var curDrag;

function foodItemDragStart(event)
{
    event.dataTransfer.setData('itemType','foodItem');
    curDrag = this;
}

function foodItemDragEnd(ev)
{
                    
}

function spacerDragEnter(ev, target)
{
    ev.target.style.backgroundColor = "green";
    ev.target.style.height = "20px";
    ev.preventDefault();
}

function spacerDrop(ev, target)
{
    if (ev.dataTransfer.getData('itemType') == 'foodItem' 
        && curDrag.parentNode.id == "rightStack")
    {
        ev.preventDefault();
        ev.target.style.backgroundColor = "";
        ev.target.style.height = "2px";

        ev.target.parentNode.insertBefore(curDrag.nextSibling, ev.target);
        ev.target.parentNode.insertBefore(curDrag, ev.target);
    }
    else if(curDrag.parentNode.id == "leftStack")
    {
        ev.preventDefault();
        ev.target.style.backgroundColor = "";
        ev.target.style.height = "2px";

        ev.target.parentNode.insertBefore(ev.target.cloneNode(), ev.target);
        ev.target.parentNode.insertBefore(curDrag.cloneNode(), ev.target);
        eventListeners();
    }
}

function spacerDragOver(ev, target)
{
    ev.preventDefault();
}

function spacerDragLeave(ev, target)
{
    ev.target.style.height = "2px";
    ev.preventDefault();
    ev.currentTarget.style.backgroundColor = "";
}



// TODO make a waistebin here instead
function waistebinDragEnter(ev, target)
{
    if (ev.dataTransfer.getData('itemType') == 'foodItem' 
        && curDrag.parentNode.id == "rightStack")
    {
        ev.preventDefault();
        this.style.border = "1px dotted red";
    }
}

function waistebinDragOver(ev, target)
{
    if (ev.dataTransfer.getData('itemType') == 'foodItem' 
        && curDrag.parentNode.id == "rightStack")
    {
        ev.preventDefault();
    }
}

function waistebinDrop(ev, target)
{
    if (ev.dataTransfer.getData('itemType') == 'foodItem' 
        && curDrag.parentNode.id == "rightStack")
    {
        ev.preventDefault();
        //curDrag.parentNode.remove(curDrag);
        curDrag.nextSibling.remove();
        curDrag.remove();
        this.style.border = "";
    }
}

function waistebinDragLeave(ev, target)
{
    if (ev.dataTransfer.getData('itemType') == 'foodItem' 
        && curDrag.parentNode.id == "rightStack"
        && (ev.target.parentNode.id != "leftStack")
        // 	|| ev.currentTarget.id != "leftStack")
        )
    {
        ev.preventDefault();
        this.style.border = "";
    }
}

function load()
{
    eventListeners()
}
		
function eventListeners()
{
    // finding foodItems
    var foodItems = document.querySelectorAll('#stackHolder .foodItem[draggable=true]');
    for (i = 0; i < foodItems.length; i++)
    {
        // clear existing event handler for dragstart
        foodItems[i].removeEventListener('dragstart', foodItemDragStart, true);
        // set event handler for dragstart
        foodItems[i].addEventListener('dragstart', foodItemDragStart, true);
        // set event handler for dragend
        foodItems[i].addEventListener('dragend', foodItemDragEnd, true);
    }

    // finding spacers
    var spacerItems = document.querySelectorAll('#rightStack .spacer[dropable=true]');
    for (i = 0; i < spacerItems.length; i++)
    {
        // set event handler for dragenter
        spacerItems[i].addEventListener('dragenter', spacerDragEnter, true);
        // set event handler for drop
        spacerItems[i].addEventListener('drop', spacerDrop, true);
        // set event handler for dragover
        spacerItems[i].addEventListener('dragover', spacerDragOver, true);
        // set event handler for dragleave
        spacerItems[i].addEventListener('dragleave', spacerDragLeave, true);
    }

    var wistebin = document.querySelector('div#waistebin[dropable=true]');
    wistebin.addEventListener('dragenter', waistebinDragEnter, false)
    wistebin.addEventListener('dragover', waistebinDragOver, false);
    wistebin.addEventListener('drop', waistebinDrop, true);
    wistebin.addEventListener('dragleave', waistebinDragLeave, false);


}

