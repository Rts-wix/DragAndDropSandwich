
// We use a global variable to store the currently dragged item
var curDrag;

///////////////////////////////////////////////////////////////////////////////
// EVENT HANDLERS
///////////////////////////////////////////////////////////////////////////////

//******* Eventhandlers for dragging food items **********//

// when dragging a food item begins
function foodItemDragStart(event)
{
    // event has a propperty called dataTransfer.
    // dataTransfer  is avilable for other eventhandlers as well, an ca be used 
    // to communicate between events 
    event.dataTransfer.setData('itemType','foodItem');
    // set the current dragged item to this object. 
    // This the object that the eventhandler is called upon.
    curDrag = this;
}

// when dragging a food item ends
function foodItemDragEnd(ev)
{
    // noop, short for "no operation".
}

//******* Eventhandlers for dragging items into spacers in the left stack **********//

// when something is being dragged into a spacer.
function spacerDragEnter(ev, target)
{
    // change color
    ev.target.style.backgroundColor = "green";
    // change size
    ev.target.style.height = "20px";
    // don't do default things'
    ev.preventDefault();
}

// when some thing drops on a spacer.
// if it's a fooditem, we either insert a copy, or move the item to a new position
function spacerDrop(ev, target)
{
    // only if the item is a foodItem, 
    //          and it originates from the right stack (the sandwich).
    if (ev.dataTransfer.getData('itemType') == 'foodItem' 
        && curDrag.parentNode.id == "rightStack")
    {
        // don't do defaults
        ev.preventDefault();
        // remove color
        ev.target.style.backgroundColor = "";
        // get litle
        ev.target.style.height = "2px";

        // move the spacer next to the one being draged 
        ev.target.parentNode.insertBefore(curDrag.nextSibling, ev.target);
        // move the dragged item here
        ev.target.parentNode.insertBefore(curDrag, ev.target);
    }
    // otherwice if the item comes from the left side stack
    else if(curDrag.parentNode.id == "leftStack")
    {
        // these three line do the same as above  
        ev.preventDefault();
        ev.target.style.backgroundColor = "";
        ev.target.style.height = "2px";

        // copy a spacer here
        ev.target.parentNode.insertBefore(ev.target.cloneNode(), ev.target);
        // copy a food item here
        ev.target.parentNode.insertBefore(curDrag.cloneNode(), ev.target);
        // initialize event handlers on the new items (or actually all...)
        eventListeners();
    }
}

// when something is dragged over ...
function spacerDragOver(ev, target)
{
    ev.preventDefault();
}

// when something leaves the spacer, it should turn bac to normal
function spacerDragLeave(ev, target)
{
    ev.preventDefault();
    // get litle
    ev.target.style.height = "2px";
    // no color
    ev.currentTarget.style.backgroundColor = "";
}

//******* Eventhandlers for dragging items into the waistebin in the left stack **********//

// when an food item from right stack is dragged into the waiste bin, we ned some visual response
function waistebinDragEnter(ev, target)
{
    // is the thing being dragged in, a food item, and is it from the right stack?
    if (ev.dataTransfer.getData('itemType') == 'foodItem' 
        && curDrag.parentNode.id == "rightStack")
    {
        ev.preventDefault();
        // turn on some visual response: a red border
        this.style.border = "1px dotted red";
    }
}

// nothing
function waistebinDragOver(ev, target)
{
    // is the thing being dragged in, a food item, and is it from the right stack?
    if (ev.dataTransfer.getData('itemType') == 'foodItem' 
        && curDrag.parentNode.id == "rightStack")
    {
        ev.preventDefault();
    }
}


// when an item is dropped to the waistebin
function waistebinDrop(ev, target)
{
    // is the thing being dragged in, a food item, and is it from the right stack?
    if (ev.dataTransfer.getData('itemType') == 'foodItem' 
        && curDrag.parentNode.id == "rightStack")
    {
        ev.preventDefault();
        // remove the spacer (in rightStack) after the item
        curDrag.nextSibling.remove();
        // remove the item (from rightstack).
        curDrag.remove();
        this.style.border = "";
    }
}

// when an item is dragged away out of the waistebin, we should turn of the visual reponse
function waistebinDragLeave(ev, target)
{
    // is the thing being dragged in, a food item, and is it from the right stack?    
    if (ev.dataTransfer.getData('itemType') == 'foodItem' 
        && curDrag.parentNode.id == "rightStack")
    {
        ev.preventDefault();
        // remove border
        this.style.border = "";
    }
}

// here we asign the event handlers to the elements (tags) on the page.
// this approach is a lot like jQuery's 
//      $('table#tictactoe td').droppable(
//	{
//		over: function() {
//      ...
//
function eventListeners()
{
    // finding foodItems
    var foodItems = document.querySelectorAll('#stackHolder .foodItem[draggable=true]');
    //                       ^^^^^^^^^^^^^^^^ this returns an array of all 
    //                                        the elements that fits the pattern
    // we then iterate the array with a for loop, 
    // to handle each element one by one.
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

    // find the waitebin (the should only be one), and set handlers
    var wistebin = document.querySelector('div#waistebin[dropable=true]');
    //                      ^ note that querySelector is the singular version of querySelctorAll
    wistebin.addEventListener('dragenter', waistebinDragEnter, false)
    wistebin.addEventListener('dragover', waistebinDragOver, false);
    wistebin.addEventListener('drop', waistebinDrop, true);
    wistebin.addEventListener('dragleave', waistebinDragLeave, false);
}

// the main startup function that is called from <body>'s onLoad
function load()
{
    eventListeners()
}
