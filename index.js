
const calculateSimulationButton = document.getElementById('calculate-simulation-button');
const yearOneCash = document.getElementById('startCash');

//"need to determine global vs local variables. I need model years in other places (checking financings year, etc)"
var modelYears = [] 

//"Function needs to be updated if years out is greater than 5"
function yearDisplay() {
  //array yearDisplayArray holds all HTML tables where years needs to be displayed
  yearDisplayArray = ['financialResults','otherExpense','FTEs','programTimeline']
  startYear = parseInt(document.getElementById('startYear').value);
  for (x=0; x<yearDisplayArray.length; x++) {
    for (y=0; y<5; y++) {
      modelYears[y] = startYear + y;
      document.getElementById(yearDisplayArray[x]+'Year'+y+'Label').innerHTML = startYear + y;
    }
  }
}

function cashStartDisplay() {
  number = +document.getElementById("startCash").value;
  document.getElementById("begCash").innerHTML = numberWithCommas(number);
  document.getElementById("startCash").innerHTML = numberWithCommas(number);
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//"Think through how I can make this into a function"
function developmentPhases() {
  discoveryCost = document.getElementById('discoveryCost').value;
  preclinicalCost = document.getElementById('preclinicalCost').value;
  //"Phase 1 costs //
  phase1Patients = document.getElementById('phase1Patients').value;
  phase1PatientCost = document.getElementById('phase1PatientCost').value;
  phase1Total = phase1Patients * phase1PatientCost
  document.getElementById('phase1Total').innerHTML = numberWithCommas(phase1Total);
  //"Phase 2 costs //
  phase2Patients = document.getElementById('phase2Patients').value;
  phase2PatientCost = document.getElementById('phase2PatientCost').value;
  phase2Total = phase2Patients * phase2PatientCost
  document.getElementById('phase2Total').innerHTML = numberWithCommas(phase2Total);
  //"Phase 3 costs //
  phase3Patients = document.getElementById('phase3Patients').value;
  phase3PatientCost = document.getElementById('phase3PatientCost').value;
  phase3Total = phase3Patients * phase3PatientCost
  document.getElementById('phase3Total').innerHTML = numberWithCommas(phase3Total);
}

programList = []



programName = document.getElementById("newProgram");
displayProgramList = document.getElementById("displayProgram");

function addProgram() {
  if (programName.value === "") {
    newProgramError = "*Please enter a program name"
    document.getElementById("newProgramError").innerHTML = newProgramError
  } else {
    programList.push(programName.value);
    displayProgram();
    programDevPhases();
    document.getElementById("newProgramError").innerHTML = "";
  }
}

function displayProgram() {
  // Clear our fields
  programName.value = "";

  // Show our output
  programTable = document.getElementById("programs");
  var row = programTable.insertRow(-1);
  var cell = row.insertCell(-1);
  cell.appendChild(document.createTextNode(programList[programList.length - 1]));
}

function programDevPhases() {
  for (x=programList.length-1; x<programList.length; x++) {
    var table = document.getElementById('programTimeline');
    var row = table.insertRow(table.rows.length);
    for (i=0; i<table.rows[0].cells.length; i++) {
      if (i===0) {
        createCell(row.insertCell(i), i, 'row');
        document.getElementById("program"+x).innerHTML = programList[x];
      } else {
        createDevPhaseCell(row.insertCell(i), 'row');
      }
    }
  }
}

function createCell(cell, text, style) {
  var div = document.createElement("program"+x); // create DIV element
  var txt = document.createTextNode(text); // create text node
  div.appendChild(txt);                    // append text node to the DIV
  div.setAttribute('class', style);        // set DIV class attribute
  div.setAttribute('className', style);    // set DIV class attribute for IE (?!)
  div.setAttribute('id', "program"+x);
  cell.appendChild(div);                   // append DIV to the table cell
}

function createDevPhaseCell(cell, style) {
  var div = document.createElement('select');
  const devPhases = [
    {
      id: "discovery",
      name: "Discovery"
    },
    {
      id: "preclinical",
      name: "Prelinical"
    },
    {
      id: "phase1",
      name: "Phase 1"
    },
    {
      id: "phase2",
      name: "Phase 2"
    },
    {
      id: "phase3",
      name: "Phase 3"
    },
    {
      id: "na",
      name: "N/A"
    }
  ]

  for (x=0; x<Object.keys(devPhases).length; x++) {
    devPhaseOption = document.createElement('option');
    attribute = document.createAttribute('id');
    devPhaseOption.innerHTML = devPhases[x]['name'];
    attribute.value = devPhases[x]['id'];
    div.appendChild(devPhaseOption);
    devPhaseOption.setAttributeNode(attribute);
  }
  div.type = "select";
  cell.appendChild(div);
}

function devPhaseCount() {
  var table = document.getElementById("programTimeline");
  var discoveryCount = 0;
  var programPhase = table.querySelectorAll("tr:not(.header)");
  for (a=0; a<programPhase.length; a++) {
    var phaseSelected = Array.from(programPhase[a].querySelectorAll("select"));
    var phaseStrings = phaseSelected.map(selectValue);
    console.log(phaseStrings);
  };
};

function selectValue(selectNode) {
  if (selectNode.multiple) {
    throw new Error("Multi-select nodes not supported");
  }
  if (selectNode.selectedOptions.length === 0) {
    throw new Error("Must have an option selected");
  }
  return selectNode.selectedOptions[0].value;
}

//"FTE functions"

function FTECost() {
  var FTECost = {
    "rd": [],
    "ga": [],
    "total": []
    }
  var FTEClass = ["rd", "ga"];
  for (x=0; x<FTEClass.length; x++) {
    for (y=0; y<5; y++) {
      rate = document.getElementById(FTEClass[x]+"FTECost").value;
      FTECount = document.getElementById(FTEClass[x]+"Year"+y+"FTECount").value;
      FTECost[FTEClass[x]][y] = rate * FTECount
    }
  }
  for (z=0; z<5; z++) {
    FTECost["total"][z] = FTECost["rd"][z] + FTECost["ga"][z];
    document.getElementById("year"+z+"FTECost").innerHTML = numberWithCommas(FTECost["total"][z]);
  } 
  console.log(FTECost);
}

//"Other Expenses Functions"

function addRow(table) {
  var table = document.getElementById(table);
  var row = table.insertRow(table.rows.length);
  for (i=0; i<table.rows[0].cells.length; i++) {
    if (i === 0) {
      var div = document.createElement("input"),
        txt = document.createTextNode(i);
      div.appendChild(txt);
      div.type = "text";
      row.insertCell(i).appendChild(div);
    } else {
      var div = document.createElement("input"),
        txt = document.createTextNode(i);
      div.appendChild(txt);
      div.type = "number";
      div.className = "right";
      row.insertCell(i).appendChild(div);
    }
  }
}

function calculateOtherExpense() {
  table = document.getElementById("otherExpense");
  var otherExpense = [];
  otherExpenseRow = table.rows;
  for (x = table.rows.length -1 ; x < table.rows.length; x++) {
    cell = otherExpenseRow[x].cells;
    for (y = 0; y < cell.length; y++) {
      otherExpenseItem = document.querySelectorAll("td").value
      otherExpense.push(otherExpenseItem);
      console.log(otherExpense);
    }
  }
}

//"Financing functions

function yearCheck() {

}
