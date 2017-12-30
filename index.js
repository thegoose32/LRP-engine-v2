const yearOneCash = document.getElementById('startCash');
const numYears = 5;
const devPhases = [
  {
    id: "discovery",
    name: "Discovery"
  },
  {
    id: "preclinical",
    name: "Preclinical"
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
];


function yearDisplay() {
  //array yearDisplayArray holds all HTML tables where years needs to be displayed
  const yearDisplayArray = ['financialResults','otherExpense','FTEs','programTimeline','programCosts']
  const startYear = getStartYear();
  for (let x=0; x<yearDisplayArray.length; x++) {
    for (let y=0; y<numYears; y++) {
      document.getElementById(yearDisplayArray[x]+'Year'+y+'Label').innerHTML = startYear + y;
    }
  }
}

function cashStartDisplay() {
  const number = document.getElementById("startCash").value;
  document.getElementById("begCash").innerHTML = numberWithCommas(number);
  document.getElementById("startCash").innerHTML = numberWithCommas(number);
}

function printClinicalCosts() {
  const phaseCosts = getPhaseCosts();
  document.getElementById('phase1Total').innerHTML = numberWithCommas(phaseCosts['Phase 1']);
  document.getElementById('phase2Total').innerHTML = numberWithCommas(phaseCosts['Phase 2']);
  document.getElementById('phase3Total').innerHTML = numberWithCommas(phaseCosts['Phase 3']);
}
  
const programName = document.getElementById("newProgram");
const displayProgramNode = document.getElementById("displayProgram");
const programTableNode = document.getElementById("programs");

function addProgram() {
  if (programName.value === "") {
    const newProgramError = "*Please enter a program name"
    document.getElementById("newProgramError").innerHTML = newProgramError
  } else {
    displayProgram();
    programDevPhases();
    document.getElementById("newProgramError").innerHTML = "";
  }
}

function displayProgram() {
  // Show our output
  let row = programTableNode.insertRow(-1);
  let cell = row.insertCell(-1);
  cell.appendChild(document.createTextNode(programName.value));

  // Clear our fields
  programName.value = "";
}

function programDevPhases() {
  const programList = getProgramList();
  for (let x = programList.length - 1; x<programList.length; x++) {
    let table = document.getElementById('programTimeline');
    let row = table.insertRow(table.rows.length);
    for (let i=0; i<table.rows[0].cells.length; i++) {
      if (i === 0) {
        createCell(row.insertCell(i), i, 'row', x, 'programTimeline');
        let programLabel = programList[x][0];
        document.getElementById("programTimelineProgram"+x).innerHTML = programLabel;
      } else {
        createDevPhaseCell(row.insertCell(i), 'row');
      }
    }
  }
}

function createCell(cell, text, style, programNumber, tableName) {
  let div = document.createElement('div');   // create DIV element
  let txt = document.createTextNode(text); // create text node
  div.appendChild(txt);                    // append text node to the DIV
  div.setAttribute('class', style);        // set DIV class attribute
  div.setAttribute('className', style);    // set DIV class attribute for IE (?!)
  div.setAttribute('id', tableName + "Program" + programNumber);
  cell.appendChild(div);                   // append DIV to the table cell
}

function createDevPhaseCell(cell, style) {
  const div = document.createElement('select');
  for (let x=0; x<Object.keys(devPhases).length; x++) {
    const devPhaseOption = document.createElement('option');
    const attribute = document.createAttribute('id');
    devPhaseOption.innerHTML = devPhases[x]['name'];
    attribute.value = devPhases[x]['id'];
    div.appendChild(devPhaseOption);
    devPhaseOption.setAttributeNode(attribute);
  }
  div.type = "select";
  cell.appendChild(div);
}

function devPhaseCount() {
  const programList = getProgramList();
  const table = document.getElementById("programTimeline");
  const programPhase = table.querySelectorAll("tr:not(.header)");
  for (a=0; a<programPhase.length; a++) {
    const phaseSelected = Array.from(programPhase[a].querySelectorAll("select"));
    const phaseStrings = phaseSelected.map(selectValue);
    programList[a].push(phaseStrings);
  };
  devPhaseCost(programList);
  programCosts(programList);
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

//Match development phase string to development phase costs

function devPhaseCost(programList) {
  for (let x=0; x<programList.length; x++) {
    programList[x][2] = programList[x][1].map(devPhaseMatch);
  }
}

function devPhaseMatch(phase) {
  const phaseCosts = getPhaseCosts();
  if (phaseCosts[phase] !== undefined) {
    return phaseCosts[phase];
  } else {
    throw new Error("Invalid development phase");
  }
}

function programCosts(programList) {
  let table = document.getElementById('programCosts');
  for (let x = table.rows.length - 1; x < programList.length; x++) {
    let row = table.insertRow(table.rows.length);
    row.class = "output";
    for (let i = 0; i < table.rows[0].cells.length; i++) {
      if (i === 0) {
        createCell(row.insertCell(i), i, 'row', x, 'programCosts');
        document.getElementById("programCostsProgram"+x).innerHTML = programList[x][0];
      } else {
        createProgramCostCell(row.insertCell(i), 'row', programList, x, i);
      }
    }
  }
}

function createProgramCostCell(cell, style, programList, programNumber, yearNumber) {
  let programCostAmount = programList[programNumber][2][yearNumber - 1];
  const div = document.createElement('p');
  div.value = programCostAmount;
  div.type = "p";
  div.innerText = programCostAmount;
  div.class = "output"; 
  cell.appendChild(div);
}


//"FTE functions"

function FTECost() {
  const FTECost = {
    "rd": [],
    "ga": [],
    "total": []
  };
  const FTEClass = ["rd", "ga"];
  for (let x=0; x<FTEClass.length; x++) {
    for (let y=0; y<5; y++) {
      const rate = document.getElementById(FTEClass[x]+"FTECost").value;
      const FTECount = document.getElementById(FTEClass[x]+"Year"+y+"FTECount").value;
      FTECost[FTEClass[x]][y] = rate * FTECount
    }
  }
  for (let z=0; z<5; z++) {
    FTECost["total"][z] = FTECost["rd"][z] + FTECost["ga"][z];
    document.getElementById("year"+z+"FTECost").innerHTML = numberWithCommas(FTECost["total"][z]);
  } 
}

//"Other Expenses Functions"

function addRow(table) {
  const table = document.getElementById(table);
  const row = table.insertRow(table.rows.length);
  for (let i=0; i<table.rows[0].cells.length; i++) {
    const div = document.createElement("input");
    const txt = document.createTextNode(i);
    div.appendChild(txt);
    div.type = i === 0 ? 'text' : 'number';
    row.insertCell(i).appendChild(div);
  }
}

function tableData(tableNode, columnDescriptors) {
  const rowNodes = tableNode.querySelectorAll('tr');
  const tableData = [];
  for (let i = 2; i < rowNodes.length; i++) {
    const rowNode = rowNodes[i];
    const columnNodes = rowNode.querySelectorAll('td');
    const rowData = Array.from(columnNodes).map(getCellValue);
    tableData.push(rowData);
  }
  return tableData;
}

/**
 * Parse a table cell's value.
 *
 * Handles:
 *
 * 1. Plain text nodes
 * 2. <input> tags
 * 3. <select> tags
 */
function getCellValue(cellNode) {
  if (cellNode.childNodes.length != 1) {
    throw new Error("We assume there is only one child!");
  }
  let child = cellNode.childNodes[0];
  return child.textContent;
}


function calculateOtherExpense() {
  table = document.getElementById("otherExpense");
  let otherExpense = [];
  otherExpenseRow = table.rows;
  for (x = table.rows.length -1 ; x < table.rows.length; x++) {
    cell = otherExpenseRow[x].cells;
    for (y = 0; y < cell.length; y++) {
      otherExpenseItem = document.querySelectorAll("td").value
      otherExpense.push(otherExpenseItem);
    }
  }
}

//"Financing functions

function yearCheck() {

}

function allCalculations() {
  // 1. Grab all information from the DOM
  const modelYears = [];
  const startYear = getStartYear();
  for (let y=0; y<numYears; y++) {
    modelYears[y] = startYear + y;
  }
}


/// Functions that access data from the DOM

function getPhaseCosts() {
  let phaseCosts = {};

  phaseCosts['Discovery'] = document.getElementById('discoveryCost').valueAsNumber;
  phaseCosts['Preclinical'] = document.getElementById('preclinicalCost').valueAsNumber;

  const phase1Patients = document.getElementById('phase1Patients').valueAsNumber;
  const phase1PatientCost = document.getElementById('phase1PatientCost').valueAsNumber;
  phaseCosts['Phase 1'] = phase1Patients * phase1PatientCost;

  const phase2Patients = document.getElementById('phase2Patients').valueAsNumber;
  const phase2PatientCost = document.getElementById('phase2PatientCost').valueAsNumber;
  phaseCosts['Phase 2'] = phase2Patients * phase2PatientCost;

  const phase3Patients = document.getElementById('phase3Patients').valueAsNumber;
  const phase3PatientCost = document.getElementById('phase3PatientCost').valueAsNumber;
  phaseCosts['Phase 3'] = phase3Patients * phase3PatientCost;

  phaseCosts['N/A'] = 0;

  return phaseCosts;
}

function getProgramList() {
  const programList = tableData(programTableNode);
  // TODO: convert to flat list and remove last row
  return programList;
}

function getStartYear() {
  const yearStartNode = document.getElementById('startYear');
  return parseInt(yearStartNode.value);
}

/// Utility functions

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

