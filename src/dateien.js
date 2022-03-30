//import './listener.js';
import {resizeTable} from "./linglsystem";
import {app} from "./index";


function handleFileSelect_read() {

    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _ => {
        // you can use this method to get file and perform respective operations
        //let files =   Array.from(input.files);
        //console.log(files);

        //function handleFileSelect_read() {     // evt

        let files = Array.from(input.files);
        //    const files = evt.target.files; // FileList object
        console.log("in select read");
        let filename;

        // Loop through the FileList and render image files as thumbnails.
        for (let i = 0, f; f = files[i]; i++) {
            /*
                    // Only process image files.
                    if (!f.type.match('txt.*')) {
            console.log("kein match");
                        continue;
                    }
            */
            filename = files[0].name;
            console.log("filename: ", files[0].name);

            const reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail.
                    /*
                    let span = document.createElement('span');
                    span.innerHTML = e.target.result.split('\n'); //.join(';');
                    document.getElementById('list').insertBefore(span, null);
                    */

                    console.log("in result", e.target.result);
                    let jobj = JSON.parse(e.target.result);
                    console.log("und zurück", jobj);

                    // in Tabelle schreiben
                    document.getElementById("input_neq").value = jobj.neq;
                    document.getElementById("input_nLF").value = jobj.nlf;

                    resizeTable();

                    const tabelle = document.getElementById("polygonTable");
                    let nSpalten = tabelle.rows[0].cells.length;
                    let i, j;
                    for (i = 1; i < tabelle.rows.length; i++) {
                        for (j = 1; j < nSpalten; j++) {

                            tabelle.rows[i].cells[j].innerText = jobj.a[i - 1][j - 1];
                        }
                    }

                    const rstabelle = document.getElementById("rsTable");
                    nSpalten = rstabelle.rows[0].cells.length;

                    for (i = 1; i < tabelle.rows.length; i++) {
                        for (j = 1; j < nSpalten; j++) {

                            rstabelle.rows[i].cells[j].innerText = jobj.c[i - 1][j - 1];
                        }
                    }

                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f);
            //console.log("f", reader);


        }
    }

    input.click();
}


async function handleFileSelect_save() {

    //const filename = window.prompt("Name der Datei mit Extension, z.B. test.txt\nDie Datei wird im Default Download Ordner gespeichert");
    console.log("in select save");
    //console.log("filename", filename);

    const elem = document.getElementById("input_neq");

    if (elem) {

        let i, j;

        let tabelle = document.getElementById('rsTable');
        let nZeilen = tabelle.rows.length - 1;
        let nSpalten = tabelle.rows[0].cells.length - 1;
        const neq = nZeilen;
        const nlf = nSpalten;

        const a = Array.from(Array(nZeilen), () => new Array(nZeilen));

        const c = Array.from(Array(nZeilen), () => new Array(nSpalten));

        for (i = 0; i < nZeilen; i++) {
            for (j = 0; j < nSpalten; j++) {
                c[i][j] = tabelle.rows[i + 1].cells[j + 1].innerText;
                //console.log(i,j,c[i][j]);
            }
        }

        tabelle = document.getElementById('polygonTable');
        nZeilen = tabelle.rows.length - 1;
        nSpalten = tabelle.rows[0].cells.length - 1;

        for (i = 0; i < nZeilen; i++) {
            for (j = 0; j < nSpalten; j++) {
                a[i][j] = tabelle.rows[i + 1].cells[j + 1].innerText;
                //console.log(i,j,a[i][j]);
            }
        }

        let polyData = {
            'neq': neq,
            'nlf': nlf,
            'a': a,
            'c': c
        };

        let jsonse = JSON.stringify(polyData);

        console.log("stringify", jsonse);


        if (app.hasFSAccess) {

            //window.alert("showSaveFilePicker bekannt")

            try {
                // (A) CREATE BLOB OBJECT
                const myBlob = new Blob([jsonse], {type: "text/plain"});

                // (B) FILE HANDLER & FILE STREAM
                const fileHandle = await window.showSaveFilePicker({
                    types: [{
                        description: "Text file",
                        accept: {"text/plain": [".txt"]}
                    }]
                });

                const fileStream = await fileHandle.createWritable();
                //infoBox.innerHTML += "fileStream=" + fileStream + "<br>";

                // (C) WRITE FILE
                await fileStream.write(myBlob);
                await fileStream.close();

            } catch (error) {
                //alert(error.name);
                alert(error.message);
            }

        } else if (app.isMac) {
            const filename = window.prompt("Name der Datei mit Extension, z.B. test.txt\nDie Datei wird im Default Download Ordner gespeichert");
            download(filename, jsonse);
        } else {

            //window.alert("showSaveFilePicker UNBEKANNT");
            const filename = window.prompt("Name der Datei mit Extension, z.B. test.txt\nDie Datei wird im Default Download Ordner gespeichert");
            const myFile = new File([jsonse], filename, {type: "text/plain;charset=utf-8"});
            try {
                saveAs(myFile);
            } catch (error) {
                //alert(error.name);
                alert(error.message);
            }

        }

    }

    //  }
}

//document.getElementById('readFile').addEventListener('click', initFileSelect_read, false);
document.getElementById('readFile').addEventListener('click', handleFileSelect_read, false);
document.getElementById('saveFile').addEventListener('click', handleFileSelect_save, false);


function download(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}