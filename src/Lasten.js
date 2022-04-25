import {testeZahl, sichtbar} from './utility.js';


export function lasten() {
    console.log("in lasten");

    sichtbar('lasten')

}

window.lasten = lasten;   // jetzt auch in html sichtbar
window.calc_wind = calc_wind;

function calc_wind() {

    let qp, i, dalpha
    let cpe = Array(10);
    let cpeA = Array(5);
    let cpeSog = Array(10);
    let cpeDruck = Array(10);

    const bereich = ["A", "B", "C", "D", "E"]
    const bereich_dach = ["F", "G", "H", "I", "J"]

    const q_p = [   // vereinfachte Böengeschwindigkeitsdrücke für Gebäude bis 25m
        [0.50, 0.65, 0.75],  // Zone 1
        [0.65, 0.80, 0.90],  // Zone 2
        [0.85, 1.00, 1.10],  // Zone 2
        [0.80, 0.95, 1.10],  // Zone 3
        [1.05, 1.20, 1.30],  // Zone 3
        [0.95, 1.15, 1.30],  // Zone 4
        [1.25, 1.40, 1.55],  // Zone 4
        [1.40, 0.00, 0.00]   // Zone 4
    ]

    const c_p = [       // Außendruckbeiwerte für vertikale Wände
        [-1.4, -1.7, -0.8, -1.1, -0.5, -0.7, 0.8, 1.0, -0.5, -0.7],  // h/d >= 5
        [-1.2, -1.4, -0.8, -1.1, -0.5, -0.5, 0.8, 1.0, -0.5, -0.5],  // h/d = 1
        [-1.2, -1.4, -0.8, -1.1, -0.5, -0.5, 0.7, 1.0, -0.3, -0.5]   // h/d <= 0,25
    ]

    const c_pSog = [    // Außendruckbeiwerte für Sattel- und Trogdach, und Flachdach mit scharfkantigem Traufbereich
        [-0.6, -0.6, -0.6, -0.6, -0.8, -0.8, -0.7, -0.7, -1.0, -1.5],  // -45°
        [-1.1, -2.0, -0.8, -1.5, -0.8, -0.8, -0.6, -0.6, -0.8, -1.4],  // -30°
        [-2.5, -2.8, -1.3, -2.0, -0.9, -1.2, -0.5, -0.5, -0.7, -1.2],  // -15°
        [-2.3, -2.5, -1.2, -2.0, -0.8, -1.2, -0.6, -0.6, -0.6, -0.6],  // -5°
        [-1.8, -2.5, -1.2, -2.0, -0.7, -1.2, -0.6, -0.6, -0.6, -0.6],  // 0°
        [-1.7, -2.5, -1.2, -2.0, -0.6, -1.2, -0.6, -0.6, -0.6, -0.6],  // 5°
        [-0.9, -2.0, -0.8, -1.5, -0.3, -0.3, -0.4, -0.4, -1.0, -1.5],  // 15°
        [-0.5, -1.5, -0.5, -1.5, -0.2, -0.2, -0.4, -0.4, -0.5, -0.5],  // 30°
        [-0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.2, -0.2, -0.3, -0.3]   // 45°
    ]
    const alpha_sog = [-45.0, -30.0, -15.0, -5.0, 0.0, 5.0, 15.0, 30.0, 45.0]

    const c_pDruck = [
        [-2.3, -2.5, -1.2, -2.0, -0.8, -1.2, +0.2, +0.2, +0.2, +0.2],  // -5°
        [-1.8, -2.5, -1.2, -2.0, -0.7, -1.2, +0.2, +0.2, +0.2, +0.2],  // 0°
        [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, -0.6, -0.6, +0.2, +0.2],  // 5°
        [+0.2, +0.2, +0.2, +0.2, +0.2, +0.2, +0.0, +0.0, +0.0, +0.0],  // 15°
        [+0.7, +0.7, +0.7, +0.7, +0.4, +0.4, +0.0, +0.0, +0.0, +0.0],  // 30°
        [+0.7, +0.7, +0.7, +0.7, +0.6, +0.6, +0.0, +0.0, +0.0, +0.0],  // 45°
        [+0.7, +0.7, +0.7, +0.7, +0.7, +0.7, -0.2, -0.2, -0.3, -0.3],  // 60°
        [+0.8, +0.8, +0.8, +0.8, +0.8, +0.8, -0.2, -0.2, -0.3, -0.3]   // 75°
    ]
    const alpha_druck = [-5.0, 0.0, 5.0, 15.0, 30.0, 45.0, 60.0, 75.0]

    console.log("qp", q_p[1][2])

    const h = Number(testeZahl(window.document.form_windlasten.wind_h.value));
    const b = Number(testeZahl(window.document.form_windlasten.wind_b.value));
    const d = Number(testeZahl(window.document.form_windlasten.wind_d.value));
    const A = Number(testeZahl(window.document.form_windlasten.wind_A.value));
    const alpha = Number(testeZahl(window.document.form_windlasten.wind_alpha.value));
    const windzone = Number(testeZahl(window.document.form_windlasten.windzone.value));

    const hd = h / d;
    const e = Math.min(2 * h, b)
    if (h <= 10.0) {
        qp = q_p[windzone - 1][0]
    } else if (h <= 18.0 && windzone < 8) {
        qp = q_p[windzone - 1][1]
    } else if (h <= 25.0 && windzone < 8) {
        qp = q_p[windzone - 1][2]
    } else {
        window.alert('Gebäude zu hoch für das vereinfachte Verfahren')
        return
    }


    document.getElementById("hd_value").innerHTML = hd.toFixed(2);
    document.getElementById("e_value").innerHTML = e.toFixed(2) + '&nbsp;m';
    document.getElementById("qp_value").innerHTML = qp.toFixed(2) + '&nbsp;kN/m²';

    for (i = 0; i < 10; i++) {

        if (hd > 5.0) {
            //window.alert("Das Gebäude ist zu schlank, h/d > 5")
            cpe[i] = c_p[0][i]
        } else if (hd >= 1.0) {
            cpe[i] = (c_p[0][i] - c_p[1][i]) / 4.0 * (hd - 1.0) + c_p[1][i]
        } else if (hd >= 0.25) {
            cpe[i] = (c_p[1][i] - c_p[2][i]) / 0.75 * (hd - 0.25) + c_p[2][i]
        } else {
            cpe[i] = c_p[2][i]
        }
    }


    console.log("A-10", cpe[0], " A-1", cpe[1])
    console.log("B-10", cpe[2], " B-1", cpe[3])
    console.log("C-10", cpe[4], " C-1", cpe[5])
    console.log("D-10", cpe[6], " D-1", cpe[7])
    console.log("E-10", cpe[8], " E-1", cpe[9])


    let elem = document.getElementById('id_wind_vertikal');
    if (elem !== null) elem.parentNode.removeChild(elem);
    elem = document.getElementById('id_wind_satteldach_sog');
    if (elem !== null) elem.parentNode.removeChild(elem);
    elem = document.getElementById('id_wind_satteldach_druck');
    if (elem !== null) elem.parentNode.removeChild(elem);
    elem = document.getElementById('id_wind_sog');
    if (elem !== null) elem.parentNode.removeChild(elem);
    elem = document.getElementById('id_wind_druck');
    if (elem !== null) elem.parentNode.removeChild(elem);


    let myTableDiv = document.getElementById("wind_vertikal");  //in div
    let table = document.createElement("TABLE");   //TABLE??
    table.setAttribute("id", "id_wind_vertikal");
    table.border = '0';
    myTableDiv.appendChild(table);  //appendChild() insert it in the document (table --> myTableDiv)


    let header = table.createTHead();

    let th0 = table.tHead.appendChild(document.createElement("th"));
    th0.innerHTML = "Bereich";
    let th1 = table.tHead.appendChild(document.createElement("th"));
    th1.innerHTML = "c<sub>pe,10</sub>";
    let th2 = table.tHead.appendChild(document.createElement("th"));
    th2.innerHTML = "c<sub>pe,1</sub>";
    let th3 = table.tHead.appendChild(document.createElement("th"));
    th3.innerHTML = "c<sub>pe</sub>";

    let newCell, newText

    let j = 0;
    for (i = 0; i < 5; i++) {

        if (A <= 1.0) {
            cpeA[i] = cpe[j + 1]
        } else if (A < 10.0) {
            cpeA[i] = cpe[j + 1] - (cpe[j + 1] - cpe[j]) * Math.log10(A)
        } else {
            cpeA[i] = cpe[j]
        }

        let newRow = table.insertRow(-1);

        newCell = newRow.insertCell(0);  // Insert a cell in the row at index 0

        newText = document.createTextNode(bereich[i]);  // Append a text node to the cell
        newCell.appendChild(newText);

        newCell = newRow.insertCell(1);  // Insert a cell in the row at index 1
        newText = document.createTextNode(cpe[j].toFixed(2));  // Append a text node to the cell
        newCell.appendChild(newText);

        newCell = newRow.insertCell(2);  // Insert a cell in the row at index 1
        newText = document.createTextNode(cpe[j + 1].toFixed(2));  // Append a text node to the cell
        newCell.appendChild(newText);

        newCell = newRow.insertCell(3);  // Insert a cell in the row at index 1
        newText = document.createTextNode(cpeA[i].toFixed(2));  // Append a text node to the cell
        newCell.appendChild(newText);

        j += 2
    }



    // Fall Sog

    let index = -1
    for (i = 0; i < alpha_sog.length; i++) {
        if (alpha_sog[i] > alpha) {
            index = i
            break
        }
    }
    if (alpha === alpha_sog[alpha_sog.length - 1]) index = alpha_sog.length - 1;

    console.log("index", index)

    if (index > 0) {

        myTableDiv = document.getElementById("wind_satteldach");  //in div


        let tag = document.createElement("p"); // <p></p>
        tag.setAttribute("id", "id_wind_sog");
        let text = document.createTextNode("Sogwerte");
        tag.appendChild(text); // <p>TEST TEXT</p>
        myTableDiv.appendChild(tag);

        table = document.createElement("TABLE");   //TABLE??
        table.setAttribute("id", "id_wind_satteldach_sog");
        table.border = '0';
        myTableDiv.appendChild(table);  //appendChild() insert it in the document (table --> myTableDiv)


        header = table.createTHead();

        th0 = table.tHead.appendChild(document.createElement("th"));
        th0.innerHTML = "Bereich";
        th1 = table.tHead.appendChild(document.createElement("th"));
        th1.innerHTML = "c<sub>pe,10</sub>";
        th2 = table.tHead.appendChild(document.createElement("th"));
        th2.innerHTML = "c<sub>pe,1</sub>";
        th3 = table.tHead.appendChild(document.createElement("th"));
        th3.innerHTML = "c<sub>pe</sub>";

        dalpha = alpha_sog[index] - alpha_sog[index - 1]
        for (i = 0; i < 10; i++) {
            cpeSog[i] = (c_pSog[index][i] - c_pSog[index - 1][i]) / dalpha * (alpha - alpha_sog[index - 1]) + c_pSog[index - 1][i]
            console.log("cpeSog", i, dalpha, cpeSog[i])
        }


        j = 0;
        for (i = 0; i < 5; i++) {

            if (A <= 1.0) {
                cpeA[i] = cpeSog[j + 1]
            } else if (A < 10.0) {
                cpeA[i] = cpeSog[j + 1] - (cpeSog[j + 1] - cpeSog[j]) * Math.log10(A)
            } else {
                cpeA[i] = cpeSog[j]
            }

            let newRow = table.insertRow(-1);

            newCell = newRow.insertCell(0);  // Insert a cell in the row at index 0

            newText = document.createTextNode(bereich_dach[i]);  // Append a text node to the cell
            newCell.appendChild(newText);

            newCell = newRow.insertCell(1);  // Insert a cell in the row at index 1
            newText = document.createTextNode(cpeSog[j].toFixed(2));  // Append a text node to the cell
            newCell.appendChild(newText);

            newCell = newRow.insertCell(2);  // Insert a cell in the row at index 1
            newText = document.createTextNode(cpeSog[j + 1].toFixed(2));  // Append a text node to the cell
            newCell.appendChild(newText);

            newCell = newRow.insertCell(3);  // Insert a cell in the row at index 1
            newText = document.createTextNode(cpeA[i].toFixed(2));  // Append a text node to the cell
            newCell.appendChild(newText);

            j += 2
        }

    }


    // Fall Druck

     index = -1
    for (i = 0; i < alpha_druck.length; i++) {
        if (alpha_druck[i] > alpha) {
            index = i
            break
        }
    }
    if (alpha === alpha_druck[alpha_druck.length - 1]) index = alpha_druck.length - 1;

    console.log("index Druck", index)


    if (index > 0) {

        myTableDiv = document.getElementById("wind_satteldach");  //in div


        let tag = document.createElement("p"); // <p></p>
        tag.setAttribute("id", "id_wind_druck");
        let text = document.createTextNode("Druckwerte");
        tag.appendChild(text);
        myTableDiv.appendChild(tag);

        table = document.createElement("TABLE");   //TABLE??
        table.setAttribute("id", "id_wind_satteldach_druck");
        table.border = '0';
        myTableDiv.appendChild(table);  //appendChild() insert it in the document (table --> myTableDiv)


        header = table.createTHead();

        th0 = table.tHead.appendChild(document.createElement("th"));
        th0.innerHTML = "Bereich";
        th1 = table.tHead.appendChild(document.createElement("th"));
        th1.innerHTML = "c<sub>pe,10</sub>";
        th2 = table.tHead.appendChild(document.createElement("th"));
        th2.innerHTML = "c<sub>pe,1</sub>";
        th3 = table.tHead.appendChild(document.createElement("th"));
        th3.innerHTML = "c<sub>pe</sub>";

        dalpha = alpha_druck[index] - alpha_druck[index - 1]
        for (i = 0; i < 10; i++) {
            cpeDruck[i] = (c_pDruck[index][i] - c_pDruck[index - 1][i]) / dalpha * (alpha - alpha_druck[index - 1]) + c_pDruck[index - 1][i]
            console.log("cpeDruck", i, dalpha, cpeDruck[i])
        }


        j = 0;
        for (i = 0; i < 5; i++) {

            if (A <= 1.0) {
                cpeA[i] = cpeDruck[j + 1]
            } else if (A < 10.0) {
                cpeA[i] = cpeDruck[j + 1] - (cpeDruck[j + 1] - cpeDruck[j]) * Math.log10(A)
            } else {
                cpeA[i] = cpeDruck[j]
            }

            let newRow = table.insertRow(-1);

            newCell = newRow.insertCell(0);  // Insert a cell in the row at index 0

            newText = document.createTextNode(bereich_dach[i]);  // Append a text node to the cell
            newCell.appendChild(newText);

            newCell = newRow.insertCell(1);  // Insert a cell in the row at index 1
            newText = document.createTextNode(cpeDruck[j].toFixed(2));  // Append a text node to the cell
            newCell.appendChild(newText);

            newCell = newRow.insertCell(2);  // Insert a cell in the row at index 1
            newText = document.createTextNode(cpeDruck[j + 1].toFixed(2));  // Append a text node to the cell
            newCell.appendChild(newText);

            newCell = newRow.insertCell(3);  // Insert a cell in the row at index 1
            newText = document.createTextNode(cpeA[i].toFixed(2));  // Append a text node to the cell
            newCell.appendChild(newText);

            j += 2
        }

    }
}

