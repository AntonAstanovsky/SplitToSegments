function setOutputElement(JSON) {
  document.getElementById('segmentedPlayers').innerHTML = JSON;
}

function findElement(collection,child) {
  for (let item in collection) {
    if (collection[item].contains(child)) {
      return collection[item];
    }
  }
}

function checkFiles(file) {
  if (file != undefined) {
    return true;
  }
  console.log('No File');
  return false;
}

function removeFileDescription(element) {
  if(element.getElementsByClassName('description').length == 1) {
    element.removeChild(element.getElementsByClassName('description')[0]);
  }
}

function addFileDescription(element,file) {
  addDescription(element,file.name)
}

function addDescription(element,description) {
  let paragraph = document.createElement('p');
  paragraph.setAttribute('class','description');
  paragraph.innerHTML = "File Name: " + description;
  element.appendChild(paragraph);
}

function checkFileConstruction(players,name) {
  let result = checkFilterFileConstruction(players,name);
  return result;
}

function checkFilterFileConstruction(players,name) {
  let result = true;
  if (players[0][fileHeader.player] == undefined) {
    result = name + ': First Column = "' + fileHeader.player + '"';
  }
  return result;
}

function alertBox(title,text) {
  let boxElement = document.getElementsByClassName('modalBox')[0];
  let titleElement = boxElement.getElementsByClassName('title')[0];
  let textElement = boxElement.getElementsByClassName('content')[0];
  let imageElement = boxElement.getElementsByClassName('image')[0];

  titleElement.innerHTML = title;
  textElement.innerHTML = text;

  switch (title) {
    case 'Check Again':
      imageElement.setAttribute('src','assets/checkAgain.jpg');
      break;
    default:
      imageElement.setAttribute('src','');
  }
  showElement(boxElement);
}

function hideElement(event) {
  setHide(event.target);
}

function setHide(element) {
  if(!element.getAttribute('Class').includes('hidden')) {
    AddClass(element,'hidden');
  }
}

function AddClass(element,newClass) {
  element.setAttribute('class',(element.getAttribute('class') + ' ' + newClass).trim());
}

function hideContainer(event) {
  let containerElements = document.getElementsByClassName('container');
  for (let item of containerElements) {
    if (item.contains(event.target)) {
      setHide(item);
    }
  }
}

function showElement(element) {
  element.setAttribute('class',element.getAttribute('class').replace('hidden','').trim());
}

function hideByClass(className) {
  let list = document.getElementsByClassName(className);
  for (let item of list) {
    setHide(item);
  }
}

function addEventListenersToArray (array,event,listenerFunction) {
  for (let item of array) {
    item.addEventListener(event, listenerFunction, false);
  }
}

/* --------------  Element Controlers  -------------- */
function getChildElementsByAttribute(container,attribute,attributeValue) {
  let returnArray = [];
  let childElements = container.children;
  for(let item of childElements) {
    if (item.getAttribute(attribute) == attributeValue) {
      returnArray.push(item);
    }
  }
  if (returnArray.length > 0) { 
    return returnArray; 
  }
  return false;
}

class generalMenu {
  constructor(menu,type,action) {
    this.CTA = menu.querySelector("[data-navigator='dropdown']");
    this.navigator = new navBar(getChildElementsByAttribute(menu,"data-navigator","navigationBar")[0],type,action);
    this.CTA.addEventListener('click', () => { this.navigator.toggleState(); }, false);
  }
  getChoice() {
    return this.navigator.choice;
  }
}

class headerMenu extends generalMenu {
  constructor(menu) {
    super(menu,"Page","goTo");
  }
}

class MailerMenu extends generalMenu {
  constructor(menu) {
    super(menu,"Mailer","choose");
  }
}

class navBar {
  constructor(navigationBar,type,action) {
    this.navigationBar = navigationBar;
    this.state = false;
    this.type = type;
    this.action = action;
    this.choice = null;

    let children = this.navigationBar.children;
    for (let item of children) {
      item.addEventListener('click', () => { this.navigate(event); this.toggleState(); }, false);
    }

    /* ---- default 'this.choice' ---- */
    let defaultChoice = new MouseEvent("click",{
      bubbles: true,
      cancelable: true,
      view: window
    });
    Object.defineProperty(defaultChoice, 'target', {value: children[0], enumerable: true});
    this.navigate(defaultChoice);
  }
  toggleState() {
    if (!this.state) {
      showElement(this.navigationBar);
      this.state = true;
    } else {
      setHide(this.navigationBar);
      this.state = false;
    }
  }
  navigate(event) {
    let clickedCTA = event.target;
    while (clickedCTA.getAttribute("data-navigate") == null) { clickedCTA = clickedCTA.parentElement; }
    let destination = clickedCTA.getAttribute("data-navigate");
    this.choice = destination.slice(destination.indexOf(this.action) + this.action.length,destination.length);
    if (this.choice.includes(this.type)) {
      hideByClass(this.type);
      showElement(document.getElementById(this.choice));
    }
  }
  getChoice() {
    return getChildElementsByAttribute(this.navigationBar,"data-navigate", this.action + this.choice)[0].innerText;
  }
  getNavigationBar() {
    return this.navigationBar;
  }
}

class mailerEditor {
  constructor(options,displayElement) {
    this.content = {
      css: '',
      body: '',
    }
    this.display = displayElement;
    this.language = "en";
    this.type = "sportnewsletter";
    this.options = options;
    this.setReader();

    this.addOptionChangeEvent(this.options,"type");
    this.addOptionChangeEvent(this.options,"language");
  }

  addOptionChangeEvent(menuList,menuType) {
    let menuArray = toArray(menuList[menuType].menu.navigator.getNavigationBar().children);
    for (let item of menuArray) {
      item.addEventListener('click',() => { this.optionChange.apply(this,[menuType]); });
    }
  }

  optionChange(menuType) {
    this.options[menuType].description = this.options[menuType].menu.navigator.getChoice().replace("Mailer","");
    this.options[menuType].menu.CTA.innerHTML = '&#8681; ' + this.options[menuType].description;
    this.setReader();
  }

  setReader() {
    this.content.css = this.readContent('https://raw.githubusercontent.com/AntonAstanovsky/SplitToSegments/master/mailerTemplates/' + this.language + '.css');
    this.display.innerText = this.content.css;
    showElement(this.display);
  }

  readContent(url) {
    let content = '';
    let awaitFunction = async function() {
      let promise = new Promise(function(resolve, reject) {
        readTextSection(url, (response) => { console.log("res: " + response); } );
      });
      promise.then( 
        result => console.log(result),
        error =>  console.log(error)
      );
      let waitStatus = await awaitFunction();
      console.log("content after: " + content);
    }
    console.log("content: " + content);
  }

}
/* --------------  Element Controlers  -------------- */

function toArray(nodeList) {
  var array = [];
  // iterate backwards ensuring that length is an UInt32
  for (var i = nodeList.length >>> 0; i--;) { 
    array[i] = nodeList[i];
  }
  return array;
}

function readTextSection (url, callback) {
  // Feature detection
  if ( !window.XMLHttpRequest ) return;
  // Create new request
  let xhr = new XMLHttpRequest();
  // Setup callback
  xhr.onload = function() {
    if ( callback && typeof( callback ) === 'function' ) {
      callback( this.response );
    }
  }
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 3) {
      // loading
    }
    if (xhr.readyState == 4) {
      // done
    }
  }
  // Get the HTML
  xhr.open( 'GET', url, true );
  xhr.responseType = 'text';
  xhr.send();
}