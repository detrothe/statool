import {testeZahl} from './utility.js';
import * as d3 from "d3";

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
    document.getElementById("my_dataviz").style.display = "block";

}


function calc_sigma() {

    let sig_x, sig_z, tau_xz, phi, phi_h, phi_tau, alpha, x, y;
    let sig_1, sig_2, sig_M, tau_max;
    let co2, si2, si_2, dalpha, alphab;

    sig_x = Number(testeZahl(window.document.form_sigma.sigx.value));
    sig_z = Number(testeZahl(window.document.form_sigma.sigz.value));
    tau_xz = Number(testeZahl(window.document.form_sigma.tauxz.value));
    phi = Number(testeZahl(window.document.form_sigma.phi.value));

    console.log ("phi",phi);
    phi = phi * Math.PI / 180.0;
    co2 = Math.cos(phi) ** 2
    si2 = Math.sin(phi) ** 2
    si_2 = Math.sin(2 * phi)
    let sigma_xi = sig_x * co2 + sig_z * si2 + tau_xz * si_2;
    let sigma_eta = sig_z * co2 + sig_x * si2 - tau_xz * si_2;
    let tau_xiEta = 0.5 * (sig_z - sig_x) * si_2 + tau_xz * (co2 - si2);

    document.getElementById("sig_xi").innerText = sigma_xi.toFixed(2);
    document.getElementById("sig_eta").innerText = sigma_eta.toFixed(2);
    document.getElementById("tau_xiEta").innerText = tau_xiEta.toFixed(2);


    //console.log("sig", sig_x, sig_z, tau_xz);

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

    const sig_xi = Array(73);
    const sig_eta = Array(73);
    const tau_xi_eta = Array(73);
    let points = [];
    let min_sig = 1.e30, max_sig = -1e30;

    dalpha = 2.5;
    alpha = -90.0;
    for (let i = 0; i < 73; i++) {
        alphab = alpha * Math.PI / 180.0;
        co2 = Math.cos(alphab) ** 2
        si2 = Math.sin(alphab) ** 2
        si_2 = Math.sin(2 * alphab)
        sig_xi[i] = sig_x * co2 + sig_z * si2 + tau_xz * si_2;
        sig_eta[i] = sig_z * co2 + sig_x * si2 - tau_xz * si_2;
        tau_xi_eta[i] = 0.5 * (sig_z - sig_x) * si_2 + tau_xz * (co2 - si2);
        points.push([alpha, sig_xi[i], sig_eta[i], tau_xi_eta[i]]);
        if (sig_xi[i] < min_sig) min_sig = sig_xi[i];
        if (sig_xi[i] > max_sig) max_sig = sig_xi[i];
        if (sig_eta[i] < min_sig) min_sig = sig_eta[i];
        if (sig_eta[i] > max_sig) max_sig = sig_eta[i];
        if (tau_xi_eta[i] < min_sig) min_sig = tau_xi_eta[i];
        if (tau_xi_eta[i] > max_sig) max_sig = tau_xi_eta[i];
        //console.log("alpha", i, alpha * 180.0 / Math.PI, sig_xi[i])
        alpha += dalpha
    }

    //console.log("points", points);


    // set the dimensions and margins of the graph
    const margin = {top: 50, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const svg0 = d3.select("#my_dataviz")
    svg0.selectAll("text").remove();
    svg0.selectAll("path").remove();
    svg0.selectAll("g").remove();
    svg0.selectAll("svg").remove();

// append the svg object to the body of the page
    const svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    // Add X axis
    const xx = d3.scaleLinear()
        .domain([-90.0, 90.0])
        .range([0, width]);

    // Add Y axis
    const yy = d3.scaleLinear()
        .domain([1.1 * min_sig, 1.1 * max_sig])
        .range([height, 0]);

    let xAxisGenerator = d3.axisBottom(xx);
    xAxisGenerator.tickValues([-90, -75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75, 90]);

    svg.append("g")
        .attr("transform", `translate(0, ${yy(0)})`)  // ${height}
        .call(xAxisGenerator);

    svg.append("g")
        .call(d3.axisLeft(yy));


    // Add the line
    svg.append("path")
        .datum(points)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
            .x(function (d) {
                //console.log("d", d);
                return xx(d[0])
            })
            .y(function (d) {
                return yy(d[1])
            })
        );

    // Add the line
    svg.append("path")
        .datum(points)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
            .x(function (d) {
                //console.log("d", d);
                return xx(d[0])
            })
            .y(function (d) {
                return yy(d[2])
            })
        );

    // Add the line
    svg.append("path")
        .datum(points)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
            .x(function (d) {
                //console.log("d", d);
                return xx(d[0])
            })
            .y(function (d) {
                return yy(d[3])
            })
        );

    svg.append("line")                  // Hauptspannungswinkel
        .attr("x1", xx(phi_h))
        .attr("x2", xx(phi_h))
        .attr("y1", yy(max_sig))
        .attr("y2", yy(min_sig))
        .attr("stroke", "darkorange")
        .attr("stroke-width", 2)
        .style("stroke-dasharray", ("4, 4"));

    svg.append("line")                  // Hauptschubspannungswinkel
        .attr("x1", xx(phi_tau))
        .attr("x2", xx(phi_tau))
        .attr("y1", yy(max_sig))
        .attr("y2", yy(min_sig))
        .attr("stroke", "darkorange")
        .attr("stroke-width", 2)
        .style("stroke-dasharray", ("3, 3"));

    svg.append("text").attr("x", width / 2).attr("y", -10).text("Spannungen im gedrehten Element").style("font-size", 15).style("fill", 'blue').style("text-anchor", "middle");
    svg.append("text").attr("x", width / 2).attr("y", height + 15).html("Winkel φ in °").style("font-size", 15).style("fill", 'blue').style("text-anchor", "middle");
    svg.append("text").attr("x", -height / 2).attr("y", -35).html("Spannungen").style("font-size", 15).style("fill", 'blue').style("text-anchor", "middle")
        .attr("transform", function (d) {
            return "rotate(-90)"
        });

    svg.append("text").attr("x", xx(90)).attr("y", yy(sig_xi[72])).html("σ").style("font-size", 15).style("fill", 'green').style("text-anchor", "left")
        .append('tspan').text('ξ').style('font-size', 15).attr('dy', '.5em');
    svg.append("text").attr("x", xx(90)).attr("y", yy(sig_eta[72])).html("σ").style("font-size", 15).style("fill", 'steelblue').style("text-anchor", "left")
        .append('tspan').text('η').style('font-size', 15).attr('dy', '.5em');
    svg.append("text").attr("x", xx(90)).attr("y", yy(tau_xi_eta[72])).html("τ").style("font-size", 15).style("fill", 'red').style("text-anchor", "left")
        .append('tspan').text('ξη').style('font-size', 15).attr('dy', '.5em');
    svg.append("text").attr("x", xx(phi_h) + 5).attr("y", yy(min_sig)).html("φ").style("font-size", 15).style("fill", 'darkorange').style("text-anchor", "left")
        .append('tspan').text('h').style('font-size', 15).attr('dy', '.5em');

    svg.append("text").attr("x", xx(phi_tau) + 5).attr("y", yy(min_sig)).html("φ**").style("font-size", 15).style("fill", 'darkorange').style("text-anchor", "left");

    svg.append("text").attr("x", xx(phi_tau) + 3).attr("y", yy(tau_max) - 10).html("τ").style("font-size", 15).style("fill", 'red').style("text-anchor", "left")
        .append('tspan')
        .text('max')
        .style('font-size', 15)
        .attr('dy', '.5em');

    svg.append("text").attr("x", xx(phi_h) + 5).attr("y", yy(sig_1) - 5).html("σ").style("font-size", 15).style("fill", 'green').style("text-anchor", "left")
        .append('tspan')
        .text('1')
        .style('font-size', 15)
        //.style("alignment-baseline", "hanging")
        .attr('dy', '.5em');
    svg.append("text").attr("x", xx(phi_h) + 5).attr("y", yy(sig_2)).html("σ").style("font-size", 15).style("fill", 'steelblue').style("alignment-baseline", "hanging")
        .append('tspan')
        .text('2')
        .style('font-size', 15)
        .style("alignment-baseline", "hanging")
        .attr('dy', '.5em');

}


window.spannungen = spannungen;   // jetzt auch in html sichtbar
window.calc_sigma = calc_sigma;
