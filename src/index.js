import './linglsystem.js';
import './spannung.js';

import DetectOS from 'detectos.js'
import {init_contextmenu} from './contextMenu.js';

export function tangens() {
    console.log("in tangens");
    const tab1 = document.getElementById("gleichungssystem");
    tab1.style.display = "none";
    const tab = document.getElementById("tangens");
    tab.style.display = "block";
    const tab2 = document.getElementById("rechteSeite");
    tab2.style.display = "none";
    const tab3 = document.getElementById("Loesungsvektor");
    tab3.style.display = "none";
    const tab4 = document.getElementById("gleichungssystem_top");
    tab4.style.display = "none";
    const tab5 = document.getElementById("gleichungssystem_daten");
    tab5.style.display = "none";

    document.getElementById("spannungen").style.display = "none";
}

window.tangens = tangens;   // jetzt auch in html sichtbar


function tan_2() {
    let x, y, alpha;

    y = testeZahl(window.document.tangens_2.y.value);
    x = testeZahl(window.document.tangens_2.x.value);

    if (y === 0.0 && x === 0.0) {
        alpha = 0.0;
    } else {
        alpha = Math.atan2(y, x);
        alpha = alpha * 180.0 / Math.PI;
    }

    window.document.tangens_2.alpha.value = alpha;

}

window.tan_2 = tan_2;

export function testeZahl(wert) {
    wert = wert.replace(/,/g, '.');
    //console.log('Komma entfernt',wert);
    if (isNaN(wert)) {
        //window.alert("Das ist keine Zahl ");

        return 0;
    }
    return wert;
}

//-------------------------------------------------------------------------------

export const app = {
    appName: 'statool',
    file: {
        handle: null,
        name: null,
        isModified: false,
    },
    options: {
        captureTabs: true,
        fontSize: 16,
        monoSpace: false,
        wordWrap: true,
    },
    hasFSAccess: 'chooseFileSystemEntries' in window ||
        'showOpenFilePicker' in window ||
        'showSaveFilePicker' in window,
    isMac: navigator.userAgent.includes('Mac OS X'),

};

export const Detect = new DetectOS();

init_contextmenu();
/*
window.addEventListener('resize', reportWindowSize);

function reportWindowSize() {
    console.log("resize", window.innerWidth, window.innerHeight);

    if ( window.innerWidth < 1000) {
        document.getElementById("rand").style.display = "none";
        document.getElementById("rand1").style.display = "none";
    }
    else {
        document.getElementById("rand").style.display = "block";
        document.getElementById("rand1").style.display = "block";
    }


}

     */