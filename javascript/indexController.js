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
  let fileName = file.name;
  let description = document.createElement('p');
  description.setAttribute('class','description');
  description.innerHTML = "File Name: " + fileName;
  element.appendChild(description);
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
      imageElement.setAttribute('src','assets/error/checkAgain.jpg');
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

function toggleMenu(event) {
  showElement(navBar);
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
class menu {
  constructor() {
    this.navigator = new navBar("navigationBar");
    this.element = document.getElementById("menu");
    this.element.addEventListener('click', () => { this.navigator.toggleState(); }, false);
  }
}

class navBar {
  constructor(id) {
    this.element = document.getElementById(id);
    this.state = false;
    this.type = "Page";

    let children = this.element.children;
    for (let item of children) {
      item.addEventListener('click', () => { this.navigate(event); }, false);
    }
  }
  toggleState() {
    if (!this.state) {
      showElement(this.element);
      this.state = true;
    } else {
      setHide(this.element);
      this.state = false;
    }
  }
  navigate(event) {
    let destination = event.target.getAttribute("data-navigate");
    if (destination.includes(this.type)) {
      hideByClass(this.type);
      showElement(document.getElementById(destination.slice(destination.indexOf('goTo') + 'goTo'.length,destination.length)));
    }
  }
}

class mailerEditor {
  constructor(target) {
    this.type = target.getAttribute("id");
  }

  displayEditor() {

  }
}
/* --------------  Element Controlers  -------------- */