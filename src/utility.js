



export function testeZahl(wert) {
    wert = wert.replace(/,/g, '.');
    //console.log('Komma entfernt',wert);
    if (isNaN(wert)) {
        //window.alert("Das ist keine Zahl ");

        return 0;
    }
    return wert;
}

//------------------------------------------------------------------------------------------------


export function testNumber(wert, zeile, spalte, id) {
    wert = wert.replace(/,/g, '.');
    //console.log('Komma entfernt',wert);
    if (isNaN(wert)) {
        //window.alert("Das ist keine Zahl ");

        //const objCells = document.getElementById(id).rows.item(zeile).cells;
        //objCells.item(spalte).style.backgroundColor = "darkred";
        //objCells.item(spalte).style.color = "white";

        document.getElementById(id).rows.item(zeile).cells.item(spalte).classList.add("selected");
        return 0;
    }
    return wert;
}


export function SDuennTruss () {
    this.emodul = null
    this.Iy = null
}
/*
let stab = new mystruct();

stab.Iy = 10.0
*/