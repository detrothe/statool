



export function testeZahl(wert) {
    wert = wert.replace(/,/g, '.');
    //console.log('Komma entfernt',wert);
    if (isNaN(wert)) {
        //window.alert("Das ist keine Zahl ");

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