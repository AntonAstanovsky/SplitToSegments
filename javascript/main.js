function ExcelToJSON(file) {

  let fileDataJSON = {};
  let reader = new FileReader();
  this.generateJSON = parseExcel(file);

  this.getJsonObject = function() {
    return fileDataJSON;
  }

  async function parseExcel(file) {
    let fileType = checkFileType(file,'xlsx');
    if (fileType) {
      const parsing = await reading(file);
    }
    else {
      alertBox('Check Again',`file type error:\n'${file.name}' file type should be xlsx.`)
    }
  }

  function reading(file) {
    return new Promise(resolve => {
      reader.onload = function(e) {
        let data = e.target.result;
        let workbook = XLSX.read(data, {
          type: 'binary'
        });
        //console.log("no. of sheets: " + workbook.SheetNames.length);
        workbook.SheetNames.forEach(function(sheetName) {
          // Here is your object
          let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          fileDataJSON = JSON.stringify(XL_row_object);
        });
        //last sheet will get displayed
        setOutputElement(fileDataJSON);
      };

      reader.onerror = function(ex) {
        console.log(ex);
      };

      reader.readAsBinaryString(file);
      }
    );
  }

  function checkFileType(file,type) {
    if (file.name.endsWith('.' + type)) {
      return true;
    }
    return false;
  }

}

function handleFileSelect(event,file) {
  if (checkFiles(segmentedPlayersFile.files[0])) {
    xl2json = new ExcelToJSON(segmentedPlayersFile.files[0]);
    showElement(document.getElementById('download'));
    fileSelected(event.target,file);
  }
}

function handleFilterFileSelect(event,file) {
  if (checkFiles(filteredPlayersFile.files[0])) {
    filterPlayers = new ExcelToJSON(filteredPlayersFile.files[0]);
    fileSelected(event.target,file);
  }
}

function fileSelected(clickedElement,file) {
  let clickedContainer = findElement(document.getElementsByClassName('operationClick'),clickedElement);
  removeFileDescription(clickedContainer);
  addFileDescription(clickedContainer,clickedElement.files[0]);
}

function handleFileManipulation(event) {
  let index = 0, segments = [];
  let allPlayers = JSON.parse(xl2json.getJsonObject());
  let check = checkFileConstruction(allPlayers,'All Players');

  if(check != true) {
    alertBox('Check Again','All Players\n' + check);
    return;
  }

  /* only players which are in the filtered file */
  if ( filteredPlayersFile.files.length != 0 ) {
    let allFilteredPlayers = JSON.parse(filterPlayers.getJsonObject());
    let check = checkFilterFileConstruction(allFilteredPlayers,'Filtered Players');
    if(check != true) {
      alertBox('Check Again','Filtered Players\n' + check);
      return;
    }
    else {
      let allPlayersTemp = [...allPlayers];
      allPlayers = [];
      for (let tempPlayer of allPlayersTemp) {
        for (let playerInFiltred of allFilteredPlayers) {
          if (tempPlayer[fileHeader.player] == playerInFiltred[fileHeader.player]) {
            allPlayers.push(tempPlayer);
            break;
          }
        }
      }
    }
  }
  /* end */

  while (index < allPlayers.length) {
    if (!segments.includes(allPlayers[index][fileHeader.segment])) {
      segments.push(allPlayers[index][fileHeader.segment]);
    }
    index ++;
  }

  let fileType = 'segmentedPlayer';
  let players;
  let attributes = [];
  for (attribute in allPlayers[0]) {
    if (attribute == fileHeader.player || attribute == fileHeader.segment) { continue; }
    attributes.push(attribute);
    fileType = 'extendedPlayer';
  }

  switch(fileType) {
    case 'segmentedPlayer':
      players = new playerList(segmentedPlayer);
      for(let player of allPlayers) {
        players.addPlayer(new segmentedPlayer(player[fileHeader.player],player[fileHeader.segment] || 'all'));
      }
      players.downloadCSVbyAttribute();
      break;
    case 'extendedPlayer':
      players = new playerList(extendedPlayer);
      for(let player of allPlayers) {
        let other = [];
        for (i=0; i<attributes.length; i++) {
          other.push(player[attributes[i]]);
        }
        players.addPlayer(new extendedPlayer(player[fileHeader.player],player[fileHeader.segment],other || 'all',player["email"]));
      }
      players.downloadCSVbyAttribute();
      break;
    default:
  }

}

/* ------ player structure ------ */
class basicPlayer {

  constructor(id) {
    this.id = id;
  }

  toStringLine() {
    return this.id;
  }

}

class segmentedPlayer extends basicPlayer {

  constructor(id,segment) {
    super(id);
    this.segment = segment;
  }

  toStringLine() {
    return this.id + "," + this.segment;
  }

}

class extendedPlayer extends segmentedPlayer {

  constructor(id,segment,...other) {
    super(id,segment);
    this.other = other;
  }

  toStringLine() {
    let otherString = '';
    this.other.forEach((item)=>{ otherString = otherString + "," + item; })
    return this.id + "," + this.segment + otherString;
  }

}

class playerList {

  constructor(playerType) {
    this.players = [];
    switch(playerType) {
      case segmentedPlayer:
        this.playerType = segmentedPlayer;
        break;
      case extendedPlayer:
        this.playerType = extendedPlayer;
        break;
      default:
        this.playerType = basicPlayer;
    }
  }

  addPlayer(player) {
    this.players.push(player);
  }

  toStringLine() {
    let result = '';
    for (let player of this.players) {
      result += player.toStringLine() + '\n';
    }
    return result;
  }

  getPlayerByID(id) {
    let index = 0;
    while (this.players[index].id != id) { index++; }
    return this.players[index];
  }

  downloadCSVbyAttribute(attribute = 'segment') {
    let splitByAttribute = new Map();
    for (let player of this.players) {
      let playerAttribute = player[attribute];
      splitByAttribute.set(playerAttribute,this.getPlayersByAttribute(attribute,playerAttribute));
    }
    alertBox('attributes found:', attribute + `'s' count: ` + splitByAttribute.size);
    for (let attr of splitByAttribute.keys()) {
      let output = '';
      for (let item of splitByAttribute.get(attr)) {
        output += item.toStringLine() + '\n';
      }
      writeToCSV(attr,output);
    }
  }

  getPlayersByAttribute(attribute,attributeName) {
    let output = [];
    for (let player of this.players) {
      if (player[attribute] == attributeName) {
        output.push(player);
      }
    }
    return output;
  }

}

function runTest() {
  
}
/* ------ player structure - end ------ */


function writeToCSV(fileName, data, type="data:text/csv;charset=utf-8,") {
  // Create an invisible A element
  const a = document.createElement("a");
  a.style.display = "none";
  document.body.appendChild(a);

  // Set the HREF to a Blob representation of the data to be downloaded
  a.href = window.URL.createObjectURL( new Blob([data], {type}) );

  // Use download attribute to set set desired file name
  a.setAttribute("download", `${fileName}.csv`);

  // Trigger the download by simulating click
  a.click();

  // Cleanup
  window.URL.revokeObjectURL(a.href);
  document.body.removeChild(a);
}

function writeToHTML(filename, data) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

//-------------------------------------------------//
//-------------------------------------------------//

function showPreviewMailer() {
  mailerTemplate.readMailerContent();
}

const fileHeader = {
  player: "player",
  segment: "segment",
  other: 'temp',
}

const segmentedPlayersFile = document.getElementById('file');
const filteredPlayersFile = document.getElementById('filterFile');
let xl2json = "", filterPlayers = "";

document.getElementById('file').addEventListener('change', handleFileSelect, false);
document.getElementById('filterFile').addEventListener('change', handleFilterFileSelect, false);
document.getElementById('runFunction').addEventListener('click', handleFileManipulation, false);
addEventListenersToArray(document.getElementsByClassName('operationClose'),'click',hideContainer);

let pageMenu = new headerMenu(document.getElementById("headerMenu")); 

/* ----------- Mailer Template ----------- */
let mailerOptions = {};
let mailerTemplate = new mailerEditor(document.querySelector("[data-navigator='menu'][data-mailer='type']"),
  document.querySelector("[data-navigator='menu'][data-mailer='language']"),document.getElementById('mailerDisplay'));

document.getElementById('previewMailerCTA').addEventListener('click', showPreviewMailer, false);

let fileType;
window.onload = function() {
  fileType = new dropdownMenu(document.getElementById('outputType').querySelector("[data-navigator='menu']"),'Type','choose');
}
/* ----------- Mailer Template ----------- */