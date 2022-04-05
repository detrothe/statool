import {testeZahl} from './index.js';

export function spannungen() {
    console.log("in spannungen");
    const tab1 = document.getElementById("tangens");
    tab1.style.display = "none";
    const tab = document.getElementById("gleichungssystem");
    tab.style.display = "none";
    const tab2 = document.getElementById("rechteSeite");
    tab2.style.display = "none";
    const tab3 = document.getElementById("Loesungsvektor");
    tab3.style.display = "none";
    const tab4 = document.getElementById("gleichungssystem_top");
    tab4.style.display = "none";
    const tab5 = document.getElementById("gleichungssystem_daten");
    tab5.style.display = "none";

    document.getElementById("spannungen").style.display = "block";
    document.getElementById("img_stress").style.display = "block";
    document.getElementById("kdTabelle").style.display = "none";

}


function calc_sigma() {
    let sig_x, sig_z, tau_xz, phi_h, phi_tau, alpha, x, y;
    let sig_1, sig_2, sig_M, tau_max;

    sig_x = Number(testeZahl(window.document.form_sigma.sigx.value));
    sig_z = Number(testeZahl(window.document.form_sigma.sigz.value));
    tau_xz = Number(testeZahl(window.document.form_sigma.tauxz.value));

    console.log("sig", sig_x, sig_z, tau_xz);

    y = 2 * tau_xz;
    x = sig_x - sig_z;

    if (y === 0.0 && x === 0.0) {
        alpha = 0.0;
    } else {
        alpha = Math.atan2(y, x);
        alpha = alpha * 180.0 / Math.PI;
    }

    phi_h = alpha / 2.0;

    tau_max = 0.5 * Math.sqrt((sig_x - sig_z) ** 2 + 4.0 * tau_xz ** 2);
    sig_M = 0.5 * (sig_x + sig_z);
    sig_1 = sig_M + tau_max;
    sig_2 = sig_M - tau_max;
    console.log(tau_max, sig_M, sig_1, sig_2);

    y = sig_z - sig_x;
    x = 2 * tau_xz;

    if (y === 0.0 && x === 0.0) {
        alpha = 0.0;
    } else {
        alpha = Math.atan2(y, x);
        alpha = alpha * 180.0 / Math.PI;
    }

    phi_tau = alpha / 2.0;

    document.getElementById("phi_h").innerText = phi_h.toFixed(2) + '°';
    document.getElementById("sigma_1").innerText = sig_1.toFixed(2);
    document.getElementById("sigma_2").innerText = sig_2.toFixed(2);
    document.getElementById("tau_max").innerText = tau_max.toFixed(2);
    document.getElementById("phi_tau").innerText = phi_tau.toFixed(2) + '°';
}


window.spannungen = spannungen;   // jetzt auch in html sichtbar
window.calc_sigma = calc_sigma;
