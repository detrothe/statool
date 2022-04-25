import {TFArray2D, TFVector} from "./TFArray.js";


export function kdtab(moment, normalkraft, d_o, d_u, breite, hoehe, bn, ksi_option) {

    const MAXZ0 = 25, MAXS0 = 9, MAXZ1 = 15, MAXR = 10, MAXR_025 = 8, MAXKSGR = 4;    // 19

    let as1, as2, error;
    let i, j;
    let d1, d2, xx, zz;
    let dx, dy, ks, msds, h, d, zs1, sigma, as;
    let rho1, rho2, kd, ks1, ks2, d2_d, kx, kz;

    // tab0(MAXZ0, MAXS0), ks0(MAXZ0, 3)
    // tab1(MAXZ1, MAXS0), ks1tab(MAXZ1), ks2tab(MAXZ1)
    // rho1tab(MAXR, 4), rho2tab(MAXR), ks1grenze(MAXKSGR)

    //     standardtabelle kd-werte, beginnt mit kd* = unterste zeile
    //     spalten = betongueten von c12 bis c50
    const tab0_ =
        [1.99, 2.03, 2.06, 2.10, 2.14, 2.18, 2.23, 2.28, 2.35, 2.41, 2.47, 2.54
            , 2.62, 2.72, 2.85, 2.97, 3.14, 3.35, 3.63, 4.00, 4.38, 4.94, 5.87, 7.90, 14.37
            , 1.72, 1.75, 1.79, 1.82, 1.85, 1.89, 1.93, 1.98, 2.03, 2.08, 2.14, 2.20
            , 2.27, 2.36, 2.47, 2.57, 2.72, 2.90, 3.14, 3.47, 3.80, 4.27, 5.08, 6.84, 12.44
            , 1.54, 1.57, 1.60, 1.62, 1.65, 1.69, 1.73, 1.77, 1.82, 1.86, 1.91, 1.97
            , 2.03, 2.11, 2.21, 2.30, 2.43, 2.60, 2.81, 3.10, 3.40, 3.82, 4.55, 6.12, 11.13
            , 1.38, 1.40, 1.43, 1.45, 1.48, 1.51, 1.54, 1.58, 1.63, 1.67, 1.71, 1.76
            , 1.82, 1.89, 1.97, 2.06, 2.18, 2.32, 2.51, 2.78, 3.04, 3.42, 4.07, 5.47, 9.95
            , 1.26, 1.28, 1.30, 1.33, 1.35, 1.38, 1.41, 1.44, 1.49, 1.52, 1.56, 1.61
            , 1.66, 1.72, 1.80, 1.88, 1.99, 2.12, 2.29, 2.53, 2.77, 3.12, 3.71, 5.00, 9.09
            , 1.17, 1.19, 1.21, 1.23, 1.25, 1.28, 1.30, 1.34, 1.38, 1.41, 1.44, 1.49
            , 1.54, 1.59, 1.67, 1.74, 1.84, 1.96, 2.12, 2.35, 2.57, 2.89, 3.44, 4.63, 8.41
            , 1.09, 1.11, 1.13, 1.15, 1.17, 1.19, 1.22, 1.25, 1.29, 1.32, 1.35, 1.39
            , 1.44, 1.49, 1.56, 1.63, 1.72, 1.84, 1.99, 2.20, 2.40, 2.70, 3.22, 4.33, 7.87
            , 1.03, 1.05, 1.07, 1.08, 1.10, 1.13, 1.15, 1.18, 1.21, 1.24, 1.27, 1.31
            , 1.36, 1.41, 1.47, 1.53, 1.62, 1.73, 1.87, 2.07, 2.26, 2.55, 3.03, 4.08, 7.42
            , 0.98, 0.99, 1.01, 1.03, 1.05, 1.07, 1.09, 1.12, 1.15, 1.18, 1.21, 1.24
            , 1.29, 1.33, 1.40, 1.46, 1.54, 1.64, 1.78, 1.96, 2.15, 2.42, 2.88, 3.87, 7.04];

    //     ks-werte von unten, x/d, z/d
    const ks0_ =
        [3.09, 3.04, 2.99, 2.95, 2.91, 2.87, 2.83, 2.79, 2.75, 2.72, 2.69, 2.66
            , 2.63, 2.60, 2.57, 2.54, 2.51, 2.48, 2.45, 2.42, 2.40, 2.38, 2.36, 2.34, 2.32
            , 0.617, 0.585, 0.555, 0.530, 0.504, 0.477, 0.450, 0.422, 0.393, 0.371
            , 0.350, 0.325, 0.302, 0.277, 0.250, 0.227, 0.201, 0.174, 0.147, 0.120
            , 0.104, 0.087, 0.069, 0.048, 0.025
            , 0.743, 0.757, 0.769, 0.780, 0.790, 0.801, 0.813, 0.824, 0.836, 0.846
            , 0.854, 0.865, 0.875, 0.885, 0.896, 0.906, 0.916, 0.927, 0.939, 0.950
            , 0.958, 0.966, 0.975, 0.983, 0.991];

    // ksi = 0,45
    const tab1_ =
        [1.47, 1.53, 1.60, 1.66, 1.72, 1.78, 1.83, 1.89, 1.94, 1.99, 2.04, 2.09, 2.14, 2.18, 2.23                    // C12
            , 1.27, 1.33, 1.38, 1.44, 1.49, 1.54, 1.59, 1.63, 1.68, 1.72, 1.77, 1.81, 1.85, 1.89, 1.93               // C16
            , 1.14, 1.19, 1.24, 1.29, 1.33, 1.38, 1.42, 1.46, 1.50, 1.54, 1.58, 1.62, 1.65, 1.69, 1.73               // C20
            , 1.02, 1.06, 1.11, 1.15, 1.19, 1.23, 1.27, 1.31, 1.34, 1.38, 1.41, 1.45, 1.48, 1.51, 1.54               // C25
            , 0.93, 0.97, 1.01, 1.05, 1.09, 1.12, 1.16, 1.19, 1.23, 1.26, 1.29, 1.32, 1.35, 1.38, 1.41               // C30
            , 0.86, 0.90, 0.94, 0.97, 1.01, 1.04, 1.07, 1.10, 1.14, 1.17, 1.19, 1.22, 1.25, 1.28, 1.30               // C35
            , 0.80, 0.84, 0.88, 0.91, 0.95, 0.97, 1.00, 1.03, 1.07, 1.09, 1.11, 1.14, 1.17, 1.19, 1.22               // C40
            , 0.76, 0.79, 0.83, 0.86, 0.89, 0.92, 0.94, 0.97, 1.01, 1.03, 1.05, 1.07, 1.10, 1.13, 1.15               // C45
            , 0.72, 0.75, 0.79, 0.81, 0.85, 0.87, 0.89, 0.92, 0.96, 0.98, 1.00, 1.02, 1.05, 1.07, 1.09];             // C50

    const tab1_ksi_0617_ =
        [1.31, 1.37, 1.43, 1.48, 1.54, 1.59, 1.64, 1.69, 1.73, 1.78, 1.82, 1.87, 1.91, 1.95, 1.99                    // C12
            , 1.14, 1.19, 1.24, 1.28, 1.33, 1.37, 1.42, 1.46, 1.50, 1.54, 1.58, 1.62, 1.65, 1.69, 1.72               // C16
            , 1.02, 1.06, 1.11, 1.15, 1.19, 1.23, 1.27, 1.31, 1.34, 1.38, 1.41, 1.45, 1.48, 1.51, 1.54               // C20
            , 0.91, 0.95, 0.99, 1.03, 1.06, 1.10, 1.13, 1.17, 1.20, 1.23, 1.26, 1.29, 1.32, 1.35, 1.38               // C25
            , 0.83, 0.87, 0.90, 0.94, 0.97, 1.00, 1.04, 1.07, 1.10, 1.12, 1.15, 1.18, 1.21, 1.23, 1.26               // C30
            , 0.77, 0.80, 0.84, 0.87, 0.90, 0.93, 0.96, 0.99, 1.01, 1.04, 1.07, 1.09, 1.12, 1.14, 1.17               // C35
            , 0.72, 0.75, 0.78, 0.81, 0.84, 0.87, 0.90, 0.92, 0.95, 0.97, 1.00, 1.02, 1.05, 1.07, 1.09               // C40
            , 0.68, 0.71, 0.74, 0.77, 0.79, 0.82, 0.85, 0.87, 0.89, 0.92, 0.94, 0.96, 0.99, 1.01, 1.03               // C45
            , 0.64, 0.67, 0.70, 0.73, 0.75, 0.78, 0.80, 0.83, 0.85, 0.87, 0.89, 0.91, 0.93, 0.96, 0.98];             // C50

    const tab1_ksi_025_ =
        [1.86, 1.95, 2.03, 2.11, 2.19, 2.26, 2.34, 2.41, 2.47, 2.54, 2.60, 2.67, 2.73, 2.79, 2.85                    // C12
            , 1.61, 1.69, 1.76, 1.83, 1.90, 1.96, 2.02, 2.08, 2.14, 2.20, 2.26, 2.31, 2.36, 2.42, 2.47               // C16
            , 1.44, 1.51, 1.57, 1.64, 1.70, 1.75, 1.81, 1.86, 1.92, 1.97, 2.02, 2.07, 2.11, 2.16, 2.21               // C20
            , 1.29, 1.35, 1.41, 1.46, 1.52, 1.57, 1.62, 1.67, 1.71, 1.76, 1.80, 1.85, 1.89, 1.93, 1.97               // C25
            , 1.18, 1.23, 1.29, 1.34, 1.38, 1.43, 1.48, 1.52, 1.56, 1.61, 1.65, 1.69, 1.73, 1.76, 1.80               // C30
            , 1.09, 1.14, 1.19, 1.24, 1.28, 1.33, 1.37, 1.41, 1.45, 1.49, 1.53, 1.56, 1.60, 1.63, 1.67               // C35
            , 1.02, 1.07, 1.11, 1.16, 1.20, 1.24, 1.28, 1.32, 1.36, 1.39, 1.43, 1.46, 1.49, 1.53, 1.56               // C40
            , 0.96, 1.01, 1.05, 1.09, 1.13, 1.17, 1.21, 1.24, 1.28, 1.31, 1.35, 1.38, 1.41, 1.44, 1.47               // C45
            , 0.91, 0.96, 1.00, 1.04, 1.07, 1.11, 1.14, 1.18, 1.21, 1.24, 1.28, 1.31, 1.34, 1.37, 1.40];             // C50


    const ks1tab_ = [2.63, 2.64, 2.66, 2.67, 2.69, 2.70, 2.71, 2.73, 2.74, 2.76, 2.77, 2.79, 2.80, 2.82, 2.83];
    const ks1tab_ksi_0617_ = [2.74, 2.77, 2.79, 2.82, 2.84, 2.87, 2.89, 2.92, 2.94, 2.97, 2.99, 3.02, 3.04, 3.07, 3.09];
    const ks1tab_ksi_025_ = [2.50, 2.50, 2.51, 2.51, 2.52, 2.52, 2.53, 2.53, 2.54, 2.54, 2.55, 2.55, 2.56, 2.56, 2.57];

    const ks2tab_ = [1.40, 1.30, 1.20, 1.10, 1.00, 0.90, 0.80, 0.70, 0.60, 0.50, 0.40, 0.30, 0.20, 0.10, 0.00];

    //     von oben !
    const rho1tab_ =
        [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00
            , 1.00, 1.00, 1.01, 1.01, 1.02, 1.02, 1.03, 1.04, 1.04, 1.05
            , 1.00, 1.00, 1.01, 1.02, 1.03, 1.04, 1.05, 1.06, 1.07, 1.09
            , 1.00, 1.01, 1.02, 1.03, 1.04, 1.06, 1.07, 1.09, 1.10, 1.12];

    const rho1tab_ksi_0617_ =
        [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00
            , 1.00, 1.00, 1.01, 1.01, 1.01, 1.02, 1.02, 1.03, 1.03, 1.04
            , 1.00, 1.00, 1.01, 1.02, 1.03, 1.04, 1.05, 1.06, 1.07, 1.08
            , 1.00, 1.01, 1.02, 1.03, 1.04, 1.06, 1.07, 1.08, 1.10, 1.12];

    const rho1tab_ksi_025_ =
        [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00
            , 1.00, 1.00, 1.01, 1.01, 1.02, 1.02, 1.03, 1.03
            , 1.00, 1.01, 1.02, 1.03, 1.04, 1.05, 1.06, 1.07
            , 1.00, 1.01, 1.02, 1.04, 1.05, 1.07, 1.08, 1.10];

    //     von oben !
    const rho2tab_ = [1.00, 1.01, 1.03, 1.06, 1.08, 1.11, 1.17, 1.30, 1.45, 1.63];
    const rho2tab_ksi_0617_ = [1.00, 1.01, 1.03, 1.06, 1.08, 1.11, 1.13, 1.16, 1.19, 1.24];
    const rho2tab_ksi_025_ = [1.00, 1.02, 1.08, 1.28, 1.54, 1.93, 2.54, 3.65];


    const ks1grenze_ = [2.83, 2.74, 2.68, 2.63];
    const ks1grenze_ksi_0617_ = [3.09, 2.97, 2.85, 2.74];
    const ks1grenze_ksi_025_ = [2.57, 2.54, 2.52, 2.50];

    //     von oben !
    const d2d_ = [0.07, 0.08, 0.10, 0.12, 0.14, 0.16, 0.18, 0.20, 0.22, 0.24];
    const d2d_025_ = [0.06, 0.08, 0.10, 0.12, 0.14, 0.16, 0.18, 0.20];

    const d2d = new TFVector(1, MAXR);
    const ks1tab = new TFVector(1, MAXZ1);
    const ks2tab = new TFVector(1, MAXZ1);
    const rho2tab = new TFVector(1, MAXR);
    const ks1grenze = new TFVector(1, MAXKSGR);

    const tab0 = new TFArray2D(1, MAXZ0, 1, MAXS0);
    const tab1 = new TFArray2D(1, MAXZ1, 1, MAXS0);
    const ks0 = new TFArray2D(1, MAXZ0, 1, 3);
    const rho1tab = new TFArray2D(1, MAXR, 1, 4);

    const tab1_0617 = new TFArray2D(1, MAXZ1, 1, MAXS0);
    const ks1tab_0617 = new TFVector(1, MAXZ1);
    const rho1tab_0617 = new TFArray2D(1, MAXR, 1, 4);
    const rho2tab_0617 = new TFVector(1, MAXR);
    const ks1grenze_0617 = new TFVector(1, MAXKSGR);

    const d2d_025 = new TFVector(1, MAXR_025);
    const tab1_025 = new TFArray2D(1, MAXZ1, 1, MAXS0);
    const ks1tab_025 = new TFVector(1, MAXZ1);
    const rho1tab_025 = new TFArray2D(1, MAXR_025, 1, 4);
    const rho2tab_025 = new TFVector(1, MAXR_025);
    const ks1grenze_025 = new TFVector(1, MAXKSGR);


    ks = 0.0;
    ks1 = 0.0;
    ks2 = 0.0;

    d2d.initV(d2d_);
    ks1tab.initV(ks1tab_);
    ks2tab.initV(ks2tab_);
    rho2tab.initV(rho2tab_);
    ks1grenze.initV(ks1grenze_);

    tab0.initV(tab0_);
    tab1.initV(tab1_);
    ks0.initV(ks0_);
    rho1tab.initV(rho1tab_);

    tab1_0617.initV(tab1_ksi_0617_);
    ks1tab_0617.initV(ks1tab_ksi_0617_);
    rho1tab_0617.initV(rho1tab_ksi_0617_);
    rho2tab_0617.initV(rho2tab_ksi_0617_);
    ks1grenze_0617.initV(ks1grenze_ksi_0617_);

    d2d_025.initV(d2d_025_);
    tab1_025.initV(tab1_ksi_025_);
    ks1tab_025.initV(ks1tab_ksi_025_);
    rho1tab_025.initV(rho1tab_ksi_025_);
    rho2tab_025.initV(rho2tab_ksi_025_);
    ks1grenze_025.initV(ks1grenze_ksi_025_);

    error = 0
    if (moment > 0.0) {
        d1 = d_u
        d2 = d_o
    } else {
        d1 = d_o
        d2 = d_u
    }

    h = hoehe * 100.0
    d = h - d1
    zs1 = h / 2.0 - d1
    msds = Math.abs(moment) - normalkraft * zs1 / 100.
    console.log("msds", msds);

    if (msds > 0.000001) {
        kd = d / (Math.sqrt(msds / breite))
    } else {
        kd = 0.0
        as1 = 0.0
        as2 = 0.0
        return [as1, as2, error, kd, 0.0, 0.0, 0.0];
    }
    console.log("kd=", kd)

    sigma = 43.5          // kN/cm²

    console.log("a", bn, kd, tab0._(MAXZ0, bn), tab0._(1, bn));

    let iMin = 1
    if (ksi_option === 0) {            // ksi =  0,25
        iMin = 15
    } else if (ksi_option === 1) {     // ksi = 0,617
        iMin = 7
    }

    if (kd >= tab0._(MAXZ0, bn)) {
        ks = ks0._(MAXZ0, 1)
        //       write (errorfile,*) 'Mindestbewehrung für Element ',ielem,': ks=',ks,'LF=',ilstep
        xx = ks0._(MAXZ0, 2) * d
        zz = ks0._(MAXZ0, 3) * d
        as2 = 0.0
        as1 = msds / d * ks + normalkraft / sigma
    } else if (kd >= tab0._(iMin, bn)) {
        i = iMin + 1
        while (kd > tab0._(i, bn)) {
            i = i + 1
        }
        console.log("Fall 2", i);

        dy = ks0._(i, 1) - ks0._(i - 1, 1)
        dx = tab0._(i, bn) - tab0._(i - 1, bn)

        ks = dy / dx * (kd - tab0._(i - 1, bn)) + ks0._(i - 1, 1)
        //       write (errorfile,*) 'El´:',ielem,' ohne Druckbewehrungks=',ks,'LF=',ilstep
        as2 = 0.0
        as1 = msds / d * ks + normalkraft / sigma

        dy = ks0._(i, 2) - ks0._(i - 1, 2)
        dx = tab0._(i, bn) - tab0._(i - 1, bn)
        kx = dy / dx * (kd - tab0._(i - 1, bn)) + ks0._(i - 1, 2)
        xx = kx * d

        dy = ks0._(i, 3) - ks0._(i - 1, 3)
        dx = tab0._(i, bn) - tab0._(i - 1, bn)
        kz = dy / dx * (kd - tab0._(i - 1, bn)) + ks0._(i - 1, 3)
        zz = kz * d

    } else if (kd >= tab1._(1, bn) && ksi_option === 1) {    // 0,45

        //       write (iout,*) 'mit Druckbewehrung'
        i = 2
        while (kd > tab1._(i, bn)) {
            i = i + 1
        }
        console.log("Fall 3", i);

        dy = ks1tab._(i) - ks1tab._(i - 1)
        dx = tab1._(i, bn) - tab1._(i - 1, bn)

        ks1 = dy / dx * (kd - tab1._(i - 1, bn)) + ks1tab._(i - 1)    //bis hier ok
        dy = ks2tab._(i) - ks2tab._(i - 1)
        ks2 = dy / dx * (kd - tab1._(i - 1, bn)) + ks2tab._(i - 1)
        //       write (iout,*) 'ks1=',ks1,', ks2=',ks2
        d2_d = d2 / d
        //       write (iout,*) 'd2/d= ',d2_d

        i = 1
        while (d2_d > d2d._(i)) {
            i = i + 1

            if (i > MAXR) {
                console.log('kd-Bemessung für gewählten Querschnitt nicht möglich, Element');

                console.log('Verhältnis d2/d nicht zulässig :', d2_d);
                as1 = -9999.
                as2 = -9999.
                error = 2
                return [as1, as2, error, kd];
            }
        }
        console.log("Fall 4", i);

        dy = rho2tab._(i) - rho2tab._(i - 1)
        dx = d2d._(i) - d2d._(i - 1)

        rho2 = dy / dx * (d2_d - d2d._(i - 1)) + rho2tab._(i - 1)

        //rho2 = rho2tab._(i)
        rho1 = rho1tab._(i, MAXKSGR)
        for (j = 1; j <= MAXKSGR; j++) {
            if (ks1 >= ks1grenze._(j)) {
                rho1 = rho1tab._(i, j)
                break;
            }

        }

        as2 = msds / d * ks2 * rho2                           // oben
        as1 = msds / d * ks1 * rho1 + normalkraft / sigma     // unten
        console.log("d2/d,rho1,rh2", d2_d, rho1, rho2);

    } else if (kd >= tab1_0617._(1, bn) && ksi_option === 2) {           // 0,617

        //       write (iout,*) 'mit Druckbewehrung'
        i = 2
        while (kd > tab1_0617._(i, bn)) {
            i = i + 1
        }
        console.log("Fall 5", i);

        dy = ks1tab_0617._(i) - ks1tab_0617._(i - 1)
        dx = tab1_0617._(i, bn) - tab1_0617._(i - 1, bn)

        ks1 = dy / dx * (kd - tab1_0617._(i - 1, bn)) + ks1tab_0617._(i - 1)    //bis hier ok
        dy = ks2tab._(i) - ks2tab._(i - 1)
        ks2 = dy / dx * (kd - tab1_0617._(i - 1, bn)) + ks2tab._(i - 1)
        //       write (iout,*) 'ks1=',ks1,', ks2=',ks2
        d2_d = d2 / d
        //       write (iout,*) 'd2/d= ',d2_d

        i = 1
        while (d2_d > d2d._(i)) {
            i = i + 1

            if (i > MAXR) {
                console.log('kd-Bemessung für gewählten Querschnitt nicht möglich, Element');

                console.log('Verhältnis d2/d nicht zulässig :', d2_d);
                as1 = -9999.
                as2 = -9999.
                error = 1
                return [as1, as2, error, kd];
            }
        }
        console.log("Fall 6", i);

        dy = rho2tab_0617._(i) - rho2tab_0617._(i - 1)
        dx = d2d._(i) - d2d._(i - 1)

        rho2 = dy / dx * (d2_d - d2d._(i - 1)) + rho2tab_0617._(i - 1)

        //rho2 = rho2tab_0617._(i)
        rho1 = rho1tab_0617._(i, MAXKSGR)
        for (j = 1; j <= MAXKSGR; j++) {
            if (ks1 >= ks1grenze_0617._(j)) {
                rho1 = rho1tab_0617._(i, j)
                break;
            }

        }

        as2 = msds / d * ks2 * rho2                           // oben
        as1 = msds / d * ks1 * rho1 + normalkraft / sigma     // unten
        console.log("d2/d,rho1,rh2", d2_d, rho1, rho2);

    } else if (kd >= tab1_025._(1, bn) && ksi_option === 0) {           // 0,25

        //       write (iout,*) 'mit Druckbewehrung'
        i = 2
        while (kd > tab1_025._(i, bn)) {
            i = i + 1
        }
        console.log("Fall 7", i);

        dy = ks1tab_025._(i) - ks1tab_025._(i - 1)
        dx = tab1_025._(i, bn) - tab1_025._(i - 1, bn)

        ks1 = dy / dx * (kd - tab1_025._(i - 1, bn)) + ks1tab_025._(i - 1)    //bis hier ok
        dy = ks2tab._(i) - ks2tab._(i - 1)
        ks2 = dy / dx * (kd - tab1_025._(i - 1, bn)) + ks2tab._(i - 1)
        //       write (iout,*) 'ks1=',ks1,', ks2=',ks2
        d2_d = d2 / d
        //       write (iout,*) 'd2/d= ',d2_d

        i = 1
        while (d2_d > d2d_025._(i)) {
            i = i + 1

            if (i > MAXR_025) {
                console.log('kd-Bemessung für gewählten Querschnitt nicht möglich, Element');

                console.log('Verhältnis d2/d nicht zulässig :', d2_d);
                as1 = -9999.
                as2 = -9999.
                error = 2
                return [as1, as2, error, kd];
            }
        }
        console.log("Fall 8", i);

        dy = rho2tab_025._(i) - rho2tab_025._(i - 1)
        dx = d2d_025._(i) - d2d_025._(i - 1)

        rho2 = dy / dx * (d2_d - d2d_025._(i - 1)) + rho2tab_025._(i - 1)

        //rho2 = rho2tab_025._(i)
        rho1 = rho1tab_025._(i, MAXKSGR)
        for (j = 1; j <= MAXKSGR; j++) {
            if (ks1 >= ks1grenze_025._(j)) {
                rho1 = rho1tab_025._(i, j)
                break;
            }

        }

        as2 = msds / d * ks2 * rho2                           // oben
        as1 = msds / d * ks1 * rho1 + normalkraft / sigma     // unten
        console.log("d2/d,rho1,rh2", d2_d, rho1, rho2);

    } else {
        error = 3
        as1 = -9999.
        as2 = -9999.
        return [as1, as2, error, kd];
    }

    if (moment < 0.0) {              // Vertausche oben und unten
        as = as1                     // wenn Moment negativ ist
        as1 = as2
        as2 = as
    }

    console.log("as", as1, as2);
    return [as1, as2, error, kd, ks, ks1, ks2];
}