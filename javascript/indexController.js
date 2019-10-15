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
    this.type = type;
    this.CTA = menu.querySelector("[data-navigator='dropdown']");
    this.navigator = new navBar(getChildElementsByAttribute(menu,"data-navigator","navigationBar")[0],this.type,action);
    this.CTA.addEventListener('click', () => { this.navigator.toggleState(); }, false);
  }
  getChoice() {
    return this.navigator.getChoice().replace(this.type,'').toLowerCase();
  }
  getChoiceCTA() {
    return this.navigator.getChoiceCTA();
  }
  setInnerHTML(text) {
    this.CTA.innerHTML = text;
  }
  getNavigator() {
    return this.navigator;
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
    this.lastClicked = null;
    this.addClickEventListenerToNavigation( () => { this.navigate(event); this.toggleState(); } );

    /* ---- default 'this.choice' ---- */
    let defaultChoice = new MouseEvent("click",{
      bubbles: true,
      cancelable: true,
      view: window
    });
    Object.defineProperty(defaultChoice, 'target', {value: this.navigationBar.children[0], enumerable: true});
    this.navigate(defaultChoice);
  }

  addClickEventListenerToNavigation(handler) {
    let children = this.navigationBar.children;
    for (let item of children) {
      item.addEventListener('click', handler, false);
    }
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
    this.lastClicked = event.target;
    while (this.lastClicked.getAttribute("data-navigate") == null) { this.lastClicked = this.lastClicked.parentElement; }
    let destination = this.lastClicked.getAttribute("data-navigate");
    this.choice = destination.slice(destination.indexOf(this.action) + this.action.length,destination.length);
    if (this.choice.includes(this.type)) {
      hideByClass(this.type);
      showElement(document.getElementById(this.choice));
    }
  }

  getChoice() {
    return this.choice;
  }

  getChoiceCTA() {
    return this.lastClicked;
  }

  getNavigationBar() {
    return this.navigationBar;
  }

}

class mailerEditor {
  constructor(typeMenu,languageMenu,displayElement) {
    this.content = {
      css: '',
      body: '',
      header: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head><meta http-equiv="Content-Type" content="text/html" charset="utf-8" />
      <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge" /><!--<![endif]-->
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      <title>Weekly Sports Newsletter</title>`,
      footer: `</html>`,
    }
    this.display = displayElement;
    this.userSelection = { ["type"]: new MailerMenu(typeMenu), ["language"]: new MailerMenu(languageMenu) };
    this.settings = {
      ["type"]: "sportnewsletter",
      ["language"]: "en",
    }
    for(let key in this.userSelection) {
      this.userSelection[key].getNavigator().addClickEventListenerToNavigation( () => { this.settingChange.apply(this,[key]); } )
      //this.settingChange(key);
    }
    this.readContent("language",".css","css");
    //this.readContent("type",".css","css");
    this.readContent("type",this.settings["language"].toUpperCase() + ".html","body");
    this.combineContent();
  }

  getSettingChoice(menuType) {
    return this.userSelection[menuType].getChoice();
  }

  getSettingChoiceCTA(menuType) {
    return this.userSelection[menuType].getChoiceCTA();
  }

  setSettings(menuType) {
    let description = this.getSettingChoice(menuType);
    this.settings[menuType] = this.getSettingChoiceCTA(menuType);
    this.userSelection[menuType].setInnerHTML('&#8681; ' + this.getSettingChoiceCTA(menuType).innerHTML);
  }

  settingChange(menuType) {
    this.setSettings(menuType);
    this.readContent(menuType);
  }

  readContent(menuType,fileType,output) {
    let content = '';
    let fileName = this.settings[menuType] + fileType;
    let promise = new Promise(function(resolve,reject) {
      readTextSection('https://raw.githubusercontent.com/AntonAstanovsky/SplitToSegments/master/mailerTemplates/' + fileName, 
        (response) => { 
          if(response) { 
            resolve(response); 
            //console.log(response); 
          } 
          else { reject(new Error('readContent function Error: ' + response)); }
        } 
      );
    });
    promise.then(
      result => {
        content = result;
        this.content[output] = result;
      }, 
      error => content = 'failed'
    );
  }

  combineContent() {
    let result = this.content.header + `<style>` + this.content.css + `</style>` + `<body>` + this.content.body + `</body>` + this.content.footer;
    this.display.innerHTML = result;
    showElement(this.display);
    return result;
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