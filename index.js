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
  const yearDisplayArray = ['financialResults','otherExpense','FTEs','programTimeline','programCosts','financings']
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
  document.getElementById('phase1CostYear').innerHTML = numberWithCommas(phaseCosts['Phase 1']);
  document.getElementById('phase2CostYear').innerHTML = numberWithCommas(phaseCosts['Phase 2']);
  document.getElementById('phase3CostYear').innerHTML = numberWithCommas(phaseCosts['Phase 3']);
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
        createCell(row.insertCell(i), i, 'rowName', x, 'programTimeline');
        let programLabel = programList[x][0];
        document.getElementById("programTimelineProgram"+x).innerHTML = programLabel;
      } else {
        createDevPhaseCell(row.insertCell(i), 'output');
      }
    }
  }
}

function createCell(cell, text, style, programNumber, tableName) {
  let div = document.createElement('p');   // create DIV element
  let txt = document.createTextNode(text); // create text node
  div.appendChild(txt);                    // append text node to the DIV
  div.setAttribute('class', style);        // set DIV class attribute
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
  return getTotalProgramCosts(programList);
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
        createCell(row.insertCell(i), i, 'rowName', x, 'programCosts');
        document.getElementById("programCostsProgram"+x).innerHTML = programList[x][0];
      } else {
        createProgramCostCell(row.insertCell(i), 'output', programList, x, i);
      }
    }
  }
}

function createProgramCostCell(cell, style, programList, programNumber, yearNumber) {
  let programCostAmount = programList[programNumber][2][yearNumber - 1];
  const div = document.createElement('p');
  div.value = programCostAmount;
  div.type = "p";
  div.innerText = numberWithCommas(programCostAmount);
  div.setAttribute('class', style);
  cell.appendChild(div);
}

function getTotalProgramCosts(programList) {
  let totalProgramCosts = [];
  for (let x = 0; x < programList.length; x++) {
    for (let y = 0; y < numYears; y++) {
      let amount = programList[x][2][y] 
      if (x === 0) {
        totalProgramCosts.push(amount);
      } else {
        totalProgramCosts[y] += amount;
      }
    }
  }
  return totalProgramCosts;
  console.log(totalProgramCosts);
}

//"FTE functions"

function FTECost() {
  const FTECost = {
    "rd": [],
    "ga": [],
  };
  let FTEExpense = [];
  const FTEClass = ["rd", "ga"];
  for (let x=0; x<FTEClass.length; x++) {
    for (let y=0; y<5; y++) {
      const rate = document.getElementById(FTEClass[x]+"FTECost").value;
      const FTECount = document.getElementById(FTEClass[x]+"Year"+y+"FTECount").value;
      FTECost[FTEClass[x]][y] = rate * FTECount
    }
  }
  for (let z=0; z<5; z++) {
    FTEExpense[z] = FTECost["rd"][z] + FTECost["ga"][z];
  }
  return FTEExpense;
}

//"Other Expenses Functions"

function addRow(tableName) {
  const table = document.getElementById(tableName);
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


function getOtherExpense() {
  table = document.getElementById("otherExpense");
  let otherExpense = [];
  otherExpenseRow = table.querySelectorAll("tr:not(.header)");
  for (x = 0; x < otherExpenseRow.length; x++) {
    cell = otherExpenseRow[x].cells;
    for (y = 1; y < cell.length; y++) {
      otherExpenseItem = cell[y]
      otherExpenseInput = otherExpenseItem.querySelectorAll("input")
      otherExpenseValue = otherExpenseInput[0].valueAsNumber;
      otherExpenseValue = +otherExpenseValue || 0;
      if (x === 0) {
        otherExpense.push(otherExpenseValue);
      } else {
        otherExpense[y-1] += otherExpenseValue;
      }
    }
  return otherExpense;
  console.log(otherExpense);
  }
}

//"Financing functions

function getFinancings() {
  table = document.getElementById("financings");
  let financings = [];
  financingsRow = table.querySelectorAll("tr:not(.header)");
  for (x = 0; x < financingsRow.length; x++) {
    cell = financingsRow[x].cells;
    for (y = 1; y < cell.length; y++) {
      financingsItem = cell[y]
      financingsInput = financingsItem.querySelectorAll("input")
      financingsValue = financingsInput[0].valueAsNumber;
      financingsValue = +financingsValue || 0;
      if (x === 0) {
        financings.push(financingsValue);
      } else {
        financings[y-1] += financingsValue;
      }
    }
  return financings;
  console.log(financings);
  }
}

function allCalculations() {
  // 1. Grab all information from the DOM
  const modelYears = [];
  const startYear = getStartYear();
  for (let y=0; y<numYears; y++) {
    modelYears[y] = startYear + y;
  }
}

function getEndCash() {
  let programExpense = devPhaseCount();
  let FTEExpense = FTECost();
  let otherExpense = getOtherExpense();
  let financings = getFinancings();
  let begCash = [yearOneCash.valueAsNumber];
  let endCash = [];

  for (let x = 0; x < numYears; x++) {
    if (x === 0) {
      endCash[x] = begCash[0] + financings[x] - programExpense[x] - FTEExpense[x] - otherExpense[x];
    } else {
      begCash[x] = endCash[x - 1];
      endCash[x] = begCash[x] + financings[x] - programExpense[x] - FTEExpense[x] - otherExpense[x];
    }
  }
  
  let financialResults = [[],[],[],[],[],[]];

  for (let y = 0; y < numYears; y++) {
    financialResults[0].push(begCash[y]);
    financialResults[1].push(financings[y]);
    financialResults[2].push(programExpense[y]);
    financialResults[3].push(FTEExpense[y]);
    financialResults[4].push(otherExpense[y]);
    financialResults[5].push(endCash[y]);
  }
  
  let table = document.getElementById("financialResults");
  let row = Array.from(table.querySelectorAll("tr:not(.header)"));
  for (let z = 0; z < row.length; z++) {
    for (let a = 0; a < numYears; a++) {
      let cell = row[z].querySelectorAll("p");
      let content = numberWithCommas(financialResults[z][a])
      cell[a].textContent = content;
      cell[a].class = "output";
    };
  };
 
  console.log(financialResults);
}


/// Functions that access data from the DOM

function getPhaseCosts() {
  let phaseCosts = {};

  phaseCosts['Discovery'] = document.getElementById('discoveryCost').valueAsNumber;
  phaseCosts['Preclinical'] = document.getElementById('preclinicalCost').valueAsNumber;

  const phase1Patients = document.getElementById('phase1Patients').valueAsNumber;
  const phase1PatientCost = document.getElementById('phase1PatientCost').valueAsNumber;
  const phase1Years = document.getElementById('phase1Years').valueAsNumber;
  phaseCosts['Phase 1'] = (phase1Patients * phase1PatientCost) / phase1Years;

  const phase2Patients = document.getElementById('phase2Patients').valueAsNumber;
  const phase2PatientCost = document.getElementById('phase2PatientCost').valueAsNumber;
  const phase2Years = document.getElementById('phase2Years').valueAsNumber;
  phaseCosts['Phase 2'] = (phase2Patients * phase2PatientCost) / phase2Years;

  const phase3Patients = document.getElementById('phase3Patients').valueAsNumber;
  const phase3PatientCost = document.getElementById('phase3PatientCost').valueAsNumber;
  const phase3Years = document.getElementById('phase3Years').valueAsNumber;
  phaseCosts['Phase 3'] = (phase3Patients * phase3PatientCost) / phase3Years;

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

