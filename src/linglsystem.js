//import * as d3 from "https://cdn.skypack.dev/d3-selection@3";
import * as d3 from "d3";
import './gauss.js';
import {gauss} from "./gauss";
import './dateien.js';
import {testeZahl} from "./index";

export function gleichungssystem() {
    console.log("in gleichungssystem");
    const tab1 = document.getElementById("tangens");
    tab1.style.display = "none";
    const tab = document.getElementById("gleichungssystem");
    tab.style.display = "block";
    const tab2 = document.getElementById("rechteSeite");
    tab2.style.display = "block";
    const tab3 = document.getElementById("Loesungsvektor");
    tab3.style.display = "block";
    const tab4 = document.getElementById("gleichungssystem_top");
    tab4.style.display = "block";
    const tab5 = document.getElementById("gleichungssystem_daten");
    tab5.style.display = "block";

    document.getElementById("spannungen").style.display = "none";

    const rsTabelle = document.getElementById("rechteSeite");
    const matrix = document.getElementById("polygonTable");
    console.log("top", matrix.getBoundingClientRect().top, window.scrollY);
    rsTabelle.style.top = matrix.getBoundingClientRect().top + matrix.getBoundingClientRect().height - rsTabelle.getBoundingClientRect().height + window.scrollY + "px";
    rsTabelle.style.left = 10 + matrix.getBoundingClientRect().left + matrix.getBoundingClientRect().width + window.scrollX + "px";

    //test_main();
}

window.gleichungssystem = gleichungssystem;   // jetzt auch in html sichtbar

export const selectedCellPoly = {
    isSelected: false,
    selectedCellRow: -1,
    selectedCellCol: -1,
    col: -1,
    row: -1,
    wert: 0,
    activatedMember: null,
    selColY: [],
    selColZ: [],
    startRowIndex: null,
    startCellIndex: null,
    pointerIsDown: false,
    startx: 0,
    starty: 0,
    zelle: null,
    tableId: null,
    nZeilen: 0,
    nSpalten: 0
};

//------------------------------------------------------------------------------------------------

const btn1 = document.getElementById("rechnen");
btn1.addEventListener('click', rechnen);

const btn2 = document.getElementById("resize");
btn2.addEventListener('click', resizeTable);

const btn3 = document.getElementById("clearTable");
btn3.addEventListener('click', clear_polyTabelle);

const btn4 = document.getElementById("input_sym");
btn4.addEventListener('change', checkbox_symmetry);

//------------------------------------------------------------------------------------------------

let neq = document.getElementById("input_neq").value;
let nlf = document.getElementById("input_nLF").value;

const polygon = {};
const punkte = [];
const spalten = [];
const lastfall = [];

polygon.punkte = punkte;
spalten.push('-');
lastfall.push('-');

for (let i = 1; i <= nlf; i++) {
    lastfall.push(i);
}

for (let i = 1; i <= neq; i++) {
    selectedCellPoly.selColY.push(false);
    selectedCellPoly.selColZ.push(false);

    spalten.push(i);
    let pkt = i;
    let y = 10 + i;
    let z = 20 + i;
    let sigma = "";
    let punkt = {
        "-": pkt,
        "1": y,
        "2": z,
        "3": sigma
    }

    polygon.punkte.push(punkt);
}

function tabulate(theDiv, id, data, columns) {
    console.log('columns', columns);
    console.log("data", data);

    const table = d3.select(theDiv).append('table').style('border', 'solid').style('border-spacing', '0px').style('padding', "10px").attr("id", id).attr("class", "tabelle")
    const thead = table.append('thead')
    const tbody = table.append('tbody');

    // append the header row
    thead.append('tr')
        .selectAll('th')
        .data(columns).enter()
        .append('th')
        .style('padding', '5px')
        .text(function (column) {
            return column;
        });

    // create a row for each object in the data
    const rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr')
        .style('margin', '10px');

    // create a cell in each row for each column
    const cells = rows.selectAll('td')
        .data(function (row) {
            return columns.map(function (column) {
                //console.log("function (column)",row,column,row[column]);
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append('td')
        .attr('contenteditable', true)
        .style('border', 'solid 1px')
        .style('padding', '5px')
        .text(function (d) {
            //console.log("d.value", d.value);
            return d.value;
        })
        .on('keydown', function (ev) {
                const tableId = ev.target.offsetParent.id;
                selectedCellPoly.tableId = tableId;
                console.log("in KEYDOWN", ev.keyCode, tableId);
                // trap the return and space keys being pressed
                if (ev.keyCode === 32) {    // Leertaste
                    ev.preventDefault();
                } else if (ev.keyCode === 13) {    // return
                    ev.preventDefault();

                    const el = document.getElementById("input_neq");
                    if (el) {
                        const npkte = el.value;

                        const tabelle = document.getElementById(tableId);
                        nSpalten = tabelle.rows[0].cells.length - 1;
                        //console.log("Taste Tab gedrückt",tabelle.rows[selectedCellPoly.row].cells[selectedCellPoly.col]);
                        //console.log("Taste Tab gedrückt",tabelle.rows[selectedCellPoly.row].cells.item(selectedCellPoly.col));
                        //console.log("tabelle", tabelle.classList);
                        //tabelle.rows[selectedCellPoly.row].cells[selectedCellPoly.col].removeClass("highlight");
                        const row = selectedCellPoly.row;
                        const col = selectedCellPoly.col;
                        let str = tableId + '-' + row + '-' + col;
                        const elem = document.getElementById(str);
                        console.log("<RETURN> ID", str, elem.id, elem.classList);
                        elem.classList.remove('highlight');  // alle selektierte Zellen löschen
                        for (let i = 0; i < npkte; i++) {
                            selectedCellPoly.selColY[i] = false;
                            selectedCellPoly.selColZ[i] = false;
                        }
                        //$("#polygonTable td").removeClass("highlight");
                        if (col < nSpalten) {
                            str = tableId + '-' + row + '-' + (col + 1);
                        } else if (col === nSpalten) {
                            if (row < npkte) {
                                str = tableId + '-' + Number(row + 1) + '-1';
                            } else {
                                str = tableId + '-1-1';
                            }
                        }
                        console.log("col,nSpalten", col, nSpalten, str)

                        console.log("idTable", str);
                        const elemNeu = document.getElementById(str);
                        elemNeu.classList.add('highlight');
                        elemNeu.innerText = "";
                        elemNeu.focus();
                        const evt = new Event("mousedown", {"bubbles": true, "cancelable": false});
                        evt.button = 0;     // linke Maustaste
                        elemNeu.dispatchEvent(evt);

                    }

                }
            }
        )
        .on('mousedown', function (ev) {
                const tableId = ev.target.offsetParent.id;
                selectedCellPoly.tableId = tableId;

                console.log("mousedown", ev.pageX, ev.pageY, ev.which, ev.button);
                //document.getElementById("polyCanvas").style.display = "block";

                if (ev.which === 3) {               // rechte Maustaste
                    console.log("rechte Maustaste");
                    //ev.preventDefault();
                } else if (ev.button === 0) {      // linke Maustaste
                    //ev.preventDefault();
                    const row = Number($(this).parent().index()) + 1;
                    const col = $(this).index();
                    const tabelle = document.getElementById(tableId);
                    if (tabelle.rows[row].cells[col].contentEditable === 'false') {
                        const str = tableId + '-' + row + '-' + (col + 1);
                        console.log("contentEditable === false", row, col, str);
                        selectedCellPoly.row = row;
                        selectedCellPoly.col = col;

                        const elemNeu = document.getElementById(str);
                        //elemNeu.classList.add('highlight');
                        //elemNeu.innerText = "";
                        //elemNeu.focus();
                        const evt = new Event("keydown", {"bubbles": true, "cancelable": false});
                        evt.keyCode = 13;     // Return-Taste
                        elemNeu.dispatchEvent(evt);

                    } else {

                        if (selectedCellPoly.isSelected) {
                            //selectedCellPoly.activatedMember.removeClass("highlight");
                            console.log("is selected", $(this).parent());
                            const el = document.getElementById("input_neq");
                            if (el) {
                                const npkte = el.value;
                                $("#" + tableId + " td").removeClass("highlight");
                                for (let i = 0; i < npkte; i++) {
                                    selectedCellPoly.selColY[i] = false;
                                    selectedCellPoly.selColZ[i] = false;
                                }
                            }

                        }
                        console.log("cell", $(this), $(this).parent().index());
                        if (col >= 1) {
                            const activatedMember = $(ev.target).closest("td");
                            activatedMember.addClass("highlight");
                            let wert = activatedMember.text();

                            //console.log("event", row, col, wert);
                            selectedCellPoly.row = row;
                            selectedCellPoly.col = col;
                            selectedCellPoly.wert = wert;
                            selectedCellPoly.activatedMember = activatedMember;
                            selectedCellPoly.isSelected = true;
                            if (col === 1) selectedCellPoly.selColY[row - 1] = true;
                            else if (col === 2) selectedCellPoly.selColZ[row - 1] = true;
                            selectedCellPoly.startRowIndex = row;
                            selectedCellPoly.startCellIndex = col;
                        }
                    }
                }
            }
        )
        .on('mousemove', MMOVE)

        .on("touchstart", function (ev) {
            const tableId = ev.target.offsetParent.id;
            selectedCellPoly.tableId = tableId;

            let touchobj = ev.changedTouches[0]; // erster Finger
            selectedCellPoly.startx = parseInt(touchobj.clientX); // X/Y-Koordinaten relativ zum Viewport
            selectedCellPoly.starty = parseInt(touchobj.clientY);
            console.log("touchstart bei ClientX: " + selectedCellPoly.startx + "px ClientY: " + selectedCellPoly.starty + "px");


            //ev.preventDefault();

            //ev.preventDefault();
            if (selectedCellPoly.isSelected) {
                //selectedCellPoly.activatedMember.removeClass("highlight");
                console.log("is selected", $(this).parent());
                const el = document.getElementById("input_neq");
                if (el) {
                    const npkte = el.value;
                    $("#" + tableId + " td").removeClass("highlight");
                    for (let i = 0; i < npkte; i++) {
                        selectedCellPoly.selColY[i] = false;
                        selectedCellPoly.selColZ[i] = false;
                    }
                }
            }
            console.log("cell", $(this), $(this).parent().index());
            const row = Number($(this).parent().index()) + 1;
            const col = $(this).index();
            if (col === 1 || col === 2) {
                const activatedMember = $(ev.target).closest("td");
                activatedMember.addClass("highlight");
                let wert = activatedMember.text();

                //console.log("event", row, col, wert);
                selectedCellPoly.row = row;
                selectedCellPoly.col = col;
                selectedCellPoly.wert = wert;
                selectedCellPoly.activatedMember = activatedMember;
                selectedCellPoly.isSelected = true;
                if (col === 1) selectedCellPoly.selColY[row - 1] = true;
                else if (col === 2) selectedCellPoly.selColZ[row - 1] = true;
                selectedCellPoly.startRowIndex = row;
                selectedCellPoly.startCellIndex = col;

                const str = tableId + "-" + row + "-" + col;
                selectedCellPoly.zelle = document.getElementById(str);

                console.log("str", str, cellLeft, cellTop);
                /*
                                const elemNeu = document.getElementById(str);
                                elemNeu.focus();
                                const evt = new Event("mousedown", {"bubbles": true, "cancelable": false});
                                evt.button = 0;     // linke Maustaste
                                elemNeu.dispatchEvent(evt);
                */
                /*
                cellLeft = (col - 1) * cellWidth;
                cellTop = (row - 1) * cellHeight;
                document.getElementById("polyCanvas").style.display = "block";
                rechteck.attr("x", cellLeft + 'px');
                rechteck.attr("y", cellTop + 'px');
                rechteck.attr("width", cellWidth + 'px');
                rechteck.attr("height", cellHeight + 'px');

                 */
            }


        })


    return table;
}

export function MMOVE(ev) { // mousemove
    const tableId = ev.target.offsetParent.id;
    //console.log("MMOVE mouseover", tableId, ev.buttons);  // ev.path[3].id
    selectedCellPoly.tableId = tableId;

    if (ev.buttons === 1) {
        ev.preventDefault();
        const row = Number($(this).parent().index()) + 1;
        const col = $(this).index();
        if (col >= 1) {
            const activatedMember = $(ev.target).closest("td");
            activatedMember.addClass("highlight");
            selectedCellPoly.isSelected = true;
            //console.log("column", col, row);
            if (col === 1) selectedCellPoly.selColY[row - 1] = true;
            else if (col === 2) selectedCellPoly.selColZ[row - 1] = true;

            const cellIndex = col;
            const rowIndex = row;

            let rowStart, rowEnd, cellStart, cellEnd;

            if (rowIndex < selectedCellPoly.startRowIndex) {
                rowStart = rowIndex;
                rowEnd = selectedCellPoly.startRowIndex;
            } else {
                rowStart = selectedCellPoly.startRowIndex;
                rowEnd = rowIndex;
            }

            if (cellIndex < selectedCellPoly.startCellIndex) {
                cellStart = cellIndex;
                cellEnd = selectedCellPoly.startCellIndex;
            } else {
                cellStart = selectedCellPoly.startCellIndex;
                cellEnd = cellIndex;
            }
            // console.log("startend", rowStart, rowEnd, col, row, rowStart, rowEnd, cellStart, cellEnd);

            $("#" + tableId + " td").removeClass("highlight");
            for (let i = 0; i < neq; i++) {
                selectedCellPoly.selColY[i] = false;
                selectedCellPoly.selColZ[i] = false;
            }
            const tabelle = document.getElementById(tableId);
            const nSpalten = tabelle.rows[0].cells.length - 1;

            for (let i = 1; i <= neq; i++) {
                for (let j = 1; j <= nSpalten; j++) {
                    tabelle.rows.item(i).cells.item(j).selekt = false;
                }
            }

            for (let i = rowStart; i <= rowEnd; i++) {
                //const rowCells = table.find("tr").eq(i).find("td");
                for (let j = cellStart; j <= cellEnd; j++) {
                    //rowCells.eq(j).addClass("selected");
                    tabelle.rows.item(i).cells.item(j).classList.add("highlight");
                    if (j === 1) selectedCellPoly.selColY[i - 1] = true;
                    if (j === 2) selectedCellPoly.selColZ[i - 1] = true;
                    tabelle.rows.item(i).cells.item(j).selekt = true;

                }
            }
        }
    }
}


// render the tables
//tabulate(polygon.punkte, ['-', '1', '2', '3']); // 4 column table
tabulate('#gleichungssystem', 'polygonTable', polygon.punkte, spalten);
tabulate('#rechteSeite', 'rsTable', polygon.punkte, lastfall);
tabulate('#Loesungsvektor', 'uTable', polygon.punkte, lastfall);


export function nZeilenTabelle(id) {
    if (id === 'polygonTable') {
        return neq;
    } else if (id === 'rsTable') {
        return neq;
    }
}

export function nSpaltenTabelle(id) {
    if (id === 'polygonTable') {
        return neq;
    } else if (id === 'rsTable') {
        return nlf;
    }
}

const tabelle = document.getElementById("polygonTable");
let objCells = tabelle.rows.item(0).cells;  // Überschrift Punkt zentrieren
objCells.item(0).style.textAlign = "center";

let nSpalten = tabelle.rows[0].cells.length - 1;

for (let i = 1; i < tabelle.rows.length; i++) {
    const objCells = tabelle.rows.item(i).cells;
    objCells.item(0).contentEditable = 'false';
    objCells.item(0).style.textAlign = "center";
    objCells.item(0).style.backgroundColor = 'rgb(150,180, 180)';
    objCells.item(0).style.border = 'none';

    for (let j = 1; j <= nSpalten; j++) {
        objCells.item(j).id = "polygonTable-" + i + "-" + j;
        objCells.item(j).innerText = "";  // "polygonTable-" + i + "-" + j;
        objCells.item(j).wrap = false;
        objCells.item(j).selekt = false;
    }
    //console.log(objCells.item(0));
}

const rstabelle = document.getElementById("rsTable");
objCells = rstabelle.rows.item(0).cells;  // Überschrift Punkt zentrieren
objCells.item(0).style.textAlign = "center";
nSpalten = rstabelle.rows[0].cells.length - 1;

for (let i = 1; i < rstabelle.rows.length; i++) {
    const objCells = rstabelle.rows.item(i).cells;
    objCells.item(0).contentEditable = 'false';
    objCells.item(0).style.textAlign = "center";
    objCells.item(0).style.backgroundColor = 'rgb(150,180, 180)';
    objCells.item(0).style.border = 'none';

    for (let j = 1; j <= nSpalten; j++) {
        objCells.item(j).id = "rsTable-" + i + "-" + j;
        objCells.item(j).innerText = "";    //  "rsTable-" + i + "-" + j;
        objCells.item(j).wrap = false;
        objCells.item(j).selekt = false;
    }
}


const utabelle = document.getElementById("uTable");
objCells = utabelle.rows.item(0).cells;  // Überschrift Punkt zentrieren
objCells.item(0).style.textAlign = "center";
nSpalten = utabelle.rows[0].cells.length - 1;

for (let i = 1; i < utabelle.rows.length; i++) {
    const objCells = utabelle.rows.item(i).cells;
    objCells.item(0).contentEditable = 'false';
    objCells.item(0).style.textAlign = "center";
    objCells.item(0).style.backgroundColor = 'rgb(150,180, 180)';
    objCells.item(0).style.border = 'none';

    for (let j = 1; j <= nSpalten; j++) {
        objCells.item(j).id = "uTable-" + i + "-" + j;
        objCells.item(j).innerText = "";   //  "uTable-" + i + "-" + j;
        objCells.item(j).contentEditable = 'false';
        objCells.item(j).wrap = false;
    }
}
//const rsTabelle = document.getElementById("rsTable");
//console.log("top",tabelle.getBoundingClientRect().top,window.scrollY);
//rsTabelle.style.top = tabelle.getBoundingClientRect().top + window.scrollY + "px";


//------------------------------------------------------------------------------------------------

function clear_polyTabelle() {

    const tabelle = document.getElementById("polygonTable");
    let nSpalten = tabelle.rows[0].cells.length;
    for (let i = 1; i < tabelle.rows.length; i++) {
        for (let j = 1; j < nSpalten; j++) {
            tabelle.rows[i].cells[j].innerText = "";
        }
    }

    const rsTabelle = document.getElementById("rsTable");
    nSpalten = rsTabelle.rows[0].cells.length;
    for (let i = 1; i < rsTabelle.rows.length; i++) {
        for (let j = 1; j < nSpalten; j++) {
            rsTabelle.rows[i].cells[j].innerText = "";
        }
    }

    const uTabelle = document.getElementById("uTable");
    nSpalten = uTabelle.rows[0].cells.length;
    for (let i = 1; i < uTabelle.rows.length; i++) {
        for (let j = 1; j < nSpalten; j++) {
            uTabelle.rows[i].cells[j].innerText = "0";
        }
    }
}

//------------------------------------------------------------------------------------------------

function checkbox_symmetry(ev) {
    //const checkbox = document.getElementById("input_sym");
    //console.log("checkbox", ev.target.checked);

    const tabelle = document.getElementById("polygonTable");
    //let nSpalten = tabelle.rows[0].cells.length;

    if (ev.target.checked) {
        for (let i = 2; i < tabelle.rows.length; i++) {
            for (let j = 1; j < i; j++) {
                //tabelle.rows[i].cells[j].innerText = 'sym';
                tabelle.rows[i].cells[j].contentEditable = 'false';
                tabelle.rows[i].cells[j].classList.add('symmetry');
            }
        }
    } else {
        for (let i = 2; i < tabelle.rows.length; i++) {
            for (let j = 1; j < i; j++) {
                //tabelle.rows[i].cells[j].innerText = 'sym';
                tabelle.rows[i].cells[j].contentEditable = 'true';
                tabelle.rows[i].cells[j].classList.remove('symmetry');
            }
        }
    }
}

//------------------------------------------------------------------------------------------------

export function resizeTable() {

    neq = document.getElementById("input_neq").value;
    nlf = document.getElementById("input_nLF").value;

    resize_Tabelle("polygonTable", neq, neq);
    resize_Tabelle("rsTable", neq, nlf);
    resize_Tabelle("uTable", neq, nlf);
    /*
        const rsTabelle = document.getElementById("rechteSeite");
        const matrix = document.getElementById("polygonTable");
        console.log("top", matrix.getBoundingClientRect().top, window.scrollY);
        rsTabelle.style.top = matrix.getBoundingClientRect().top + matrix.getBoundingClientRect().height - rsTabelle.getBoundingClientRect().height + window.scrollY + "px";
        rsTabelle.style.left = 10 + matrix.getBoundingClientRect().left + matrix.getBoundingClientRect().width + window.scrollX + "px";
    */
}

export function resize_Tabelle(idTable, nRowNew, nColNew) {

    console.info("in resize", idTable);

    const table = document.getElementById(idTable);
    //console.log("spalten",table);
    let nZeilen = table.rows.length - 1;  // header abziehen
    let nSpalten = table.rows[0].cells.length - 1;

    //console.log("nRowNew", nRowNew, nZeilen, nSpalten);

    if (nSpalten > nColNew) {

        for (let i = 1; i <= nSpalten - nColNew; i++) {   // Spalten löschen  nZeilen - nRowNew
            for (let j = 0; j <= nZeilen; j++) {
                let row = table.rows.item(j);
                row.deleteCell(-1);
            }
        }
    }
    if (nZeilen > nRowNew) {

        for (let i = 1; i <= nZeilen - nRowNew; i++) {
            table.deleteRow(-1);
            //console.log("selRow",selectedCellPoly.selRow);
            selectedCellPoly.selColY.length -= 1;
            selectedCellPoly.selColZ.length -= 1;
        }

    }

    if (nColNew > nSpalten) {

        for (let i = 0; i <= nZeilen; i++) {  // Spalten addieren
            let row = table.rows.item(i);
            //console.log("row",row);
            for (let j = nSpalten + 1; j <= nColNew; j++) {   // nZeilen + 1; j <= nRowNew
                const newCell = row.insertCell(-1);
                if (i === 0) {
                    const newText = document.createTextNode(String(j));
                    newCell.appendChild(newText);
                    newCell.style.textAlign = "center";
                    newCell.style.border = 'none';
                    newCell.style.backgroundColor = 'rgb(150,180, 180)';
                } else {
                    const str = idTable + "-" + i + "-" + j;
                    const newText = document.createTextNode("");
                    newCell.appendChild(newText);
                    newCell.style.border = 'solid 1px';
                    newCell.style.padding = '5px';
                    newCell.contentEditable = 'true';
                    newCell.addEventListener("mousemove", MMOVE);
                    newCell.id = str;
                    newCell.wrap = false;

                }
            }
        }
    }

    if (nRowNew > nZeilen) {

        for (let i = nZeilen + 1; i <= nRowNew; i++) {
            selectedCellPoly.selColY.push(false);
            selectedCellPoly.selColZ.push(false);
            //console.log("selRow",selectedCellPoly.selRow);

            // Insert a row at the end of the table
            let newRow = table.insertRow(-1);

            for (let j = 0; j <= nColNew; j++) {     // nRowNew
                // Insert a cell in the row at index 0
                let newCell = newRow.insertCell(j);

                // Append a text node to the cell
                let newText;
                if (j === 0) {
                    newText = document.createTextNode(String(i));
                } else {
                    const str = idTable + "-" + i + "-" + j;
                    newCell.id = str;
                    newText = document.createTextNode("");
                }
                newCell.appendChild(newText);
                newCell.style.border = 'solid 1px';
                newCell.style.padding = '5px';
                if (j === 0) {
                    newCell.style.textAlign = "center";
                    newCell.style.border = 'none';
                    newCell.style.backgroundColor = 'rgb(150,180, 180)';

                } else if (j <= nRowNew) {
                    //newCell.style.backgroundColor = "#FFFFFF";
                    newCell.contentEditable = 'true';
                    newCell.addEventListener("mousemove", MMOVE);
                    newCell.wrap = false;
                }
            }
        }

        //const inputContainer = document.getElementById("input-container");
        //const polyCanvas = document.getElementById("polyCanvas");
        //const zelle = document.getElementById("pt-1-1");
        //console.log("scroll",inputContainer.scrollTop,inputContainer.scrollHeight,polyCanvas.style.top,polyCanvas.clientTop);

        //inputContainer.scrollTop = inputContainer.scrollHeight; // - inputContainer.clientHeight;
        //polyCanvas.style.top = zelle.getBoundingClientRect().top + window.scrollY + "px";   // scrollY
    }

}


function rechnen() {

    let i, j, result, wert;

    const checkbox = document.getElementById("input_sym");


    let tabelle = document.getElementById('rsTable');
    let nZeilen = tabelle.rows.length - 1;
    let nSpalten = tabelle.rows[0].cells.length - 1;

    const a = Array.from(Array(nZeilen), () => new Array(nZeilen).fill(0.0));
    const b = Array(nZeilen);

    const c = Array.from(Array(nZeilen), () => new Array(nSpalten).fill(0.0));

    for (i = 0; i < nZeilen; i++) {
        for (j = 0; j < nSpalten; j++) {
            wert = tabelle.rows[i + 1].cells[j + 1].innerText
            //console.log("c",i,j,Number(testeZahl(wert)));
            c[i][j] = Number(testeZahl(wert));
        }
    }

    tabelle = document.getElementById('polygonTable');
    nZeilen = tabelle.rows.length - 1;
    nSpalten = tabelle.rows[0].cells.length - 1;

    let uTabelle = document.getElementById('uTable');
    let nZeil = uTabelle.rows.length - 1;
    // let nSpalt = uTabelle.rows[0].cells.length - 1;

    for (let lf = 0; lf < nlf; lf++) {

        for (i = 0; i < nZeilen; i++) {
            for (j = 0; j < nSpalten; j++) {
                wert = tabelle.rows[i + 1].cells[j + 1].innerText;
                //console.log("a",i,j,Number(testeZahl(wert)));
                a[i][j] = Number(testeZahl(wert));
                //console.log(i,j,a[i][j]);
            }
        }

        if (checkbox.checked) {
            for (i = 0; i < nZeilen; i++) {
                for (j = i + 1; j < nSpalten; j++) {
                    a[j][i] = a[i][j];
                    tabelle.rows[j + 1].cells[i + 1].innerText = a[j][i];
                }
            }
        }

        for (i = 0; i < nZeilen; i++) {
            b[i] = c[i][lf];
        }

        result = gauss(nZeilen, a, b);

        console.log("result = ", result);

        if (result === 0) {
            for (i = 0; i < nZeil; i++) {
                //console.log("b" + i + " = " + b[i]);
                uTabelle.rows[i + 1].cells[lf + 1].innerText = b[i];
            }
        } else {
            for (i = 0; i < nZeil; i++) {
                uTabelle.rows[i + 1].cells[lf + 1].innerText = "";
            }

            window.alert("S I N G U L A E R E   M A T R I X");
        }
    }
}
