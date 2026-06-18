# Sheet: Cálculo dos traços (4t)

| Cell | Value | Formula |
|---|---|---|
| **A2** | REFERÊNCIA 28dd - CÁLCULO DOS TRAÇOS E CUSTOS - por metro cúbico |  |
| **A3** | fc1 |  |
| **B3** | a/c |  |
| **C3** | m |  |
| **D3** | Cimento |  |
| **E3** | Areia Fina |  |
| **F3** | Areia Média |  |
| **G3** | Areia Grossa |  |
| **H3** | Brita 0 |  |
| **I3** | Brita 1 |  |
| **J3** | Brita 2 |  |
| **K3** | Aditivo |  |
| **L3** | Água |  |
| **D4** | (kg) |  |
| **E4** | (kg) |  |
| **F4** | (kg) |  |
| **G4** | (kg) |  |
| **H4** | (kg) |  |
| **I4** | (kg) |  |
| **J4** | (kg) |  |
| **K4** | (kg) |  |
| **L4** | (kg) |  |
| **A5** | 25 |  |
| **B5** | 0.6114425896669473 | `=((LOG(A5)-'Curvas dosagem (4t)'!$B$16)/'Curvas dosagem (4t)'!$B$15)` |
| **C5** | 5.89742329628093 | `='Curvas dosagem (4t)'!$B$36*B5+'Curvas dosagem (4t)'!$B$37` |
| **D5** | 323.27769334808613 | `='Curvas dosagem (4t)'!$B$58/(C5-'Curvas dosagem (4t)'!$B$59)` |
| **E5** | 129.86438289953884 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(E$3,Empacotamento!$U$2:$Z$2,0))*(('4 traços'!$M$4/100*(1+$C5))-1)*$D5,"")` |
| **F5** | 409.07280613354726 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(F$3,Empacotamento!$U$2:$Z$2,0))*(('4 traços'!$M$4/100*(1+$C5))-1)*$D5,"")` |
| **G5** | 341.86798798303596 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(G$3,Empacotamento!$U$2:$Z$2,0))*(('4 traços'!$M$4/100*(1+$C5))-1)*$D5,"")` |
| **H5** | 820.5601783222751 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(H$3,Empacotamento!$U$2:$Z$2,0))*(($C5*$D5)-SUM($E5:$G5)),"")` |
| **I5** | 61.54201337417062 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(I$3,Empacotamento!$U$2:$Z$2,0))*(($C5*$D5)-SUM($E5:$G5)),"")` |
| **J5** | 143.59803120639828 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(J$3,Empacotamento!$U$2:$Z$2,0))*(($C5*$D5)-SUM($E5:$G5)),"")` |
| **K5** | 1.2931107733923446 | `=D5*$E$13/100` |
| **L5** | 197.66575000231106 | `=B5*D5` |
| **A6** | 30 |  |
| **B6** | 0.579283026925772 | `=((LOG(A6)-'Curvas dosagem (4t)'!$B$16)/'Curvas dosagem (4t)'!$B$15)` |
| **C6** | 5.326090405091554 | `='Curvas dosagem (4t)'!$B$36*B6+'Curvas dosagem (4t)'!$B$37` |
| **D6** | 351.5320304556589 | `='Curvas dosagem (4t)'!$B$58/(C6-'Curvas dosagem (4t)'!$B$59)` |
| **E6** | 125.22412211075634 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(E$3,Empacotamento!$U$2:$Z$2,0))*(('4 traços'!$M$4/100*(1+$C6))-1)*$D6,"")` |
| **F6** | 394.4559846488824 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(F$3,Empacotamento!$U$2:$Z$2,0))*(('4 traços'!$M$4/100*(1+$C6))-1)*$D6,"")` |
| **G6** | 329.65250145656603 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(G$3,Empacotamento!$U$2:$Z$2,0))*(('4 traços'!$M$4/100*(1+$C6))-1)*$D6,"")` |
| **H6** | 818.3670130208255 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(H$3,Empacotamento!$U$2:$Z$2,0))*(($C6*$D6)-SUM($E6:$G6)),"")` |
| **I6** | 61.377525976561905 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(I$3,Empacotamento!$U$2:$Z$2,0))*(($C6*$D6)-SUM($E6:$G6)),"")` |
| **J6** | 143.21422727864461 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(J$3,Empacotamento!$U$2:$Z$2,0))*(($C6*$D6)-SUM($E6:$G6)),"")` |
| **K6** | 1.4061281218226358 | `=D6*$E$13/100` |
| **L6** | 203.63653866371678 | `=B6*D6` |
| **A7** | 35 |  |
| **B7** | 0.5520925040568716 | `=((LOG(A7)-'Curvas dosagem (4t)'!$B$16)/'Curvas dosagem (4t)'!$B$15)` |
| **C7** | 4.843035328482882 | `='Curvas dosagem (4t)'!$B$36*B7+'Curvas dosagem (4t)'!$B$37` |
| **D7** | 379.58130422955844 | `='Curvas dosagem (4t)'!$B$58/(C7-'Curvas dosagem (4t)'!$B$59)` |
| **E7** | 120.61753924344976 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(E$3,Empacotamento!$U$2:$Z$2,0))*(('4 traços'!$M$4/100*(1+$C7))-1)*$D7,"")` |
| **F7** | 379.94524861686676 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(F$3,Empacotamento!$U$2:$Z$2,0))*(('4 traços'!$M$4/100*(1+$C7))-1)*$D7,"")` |
| **G7** | 317.5256720583815 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(G$3,Empacotamento!$U$2:$Z$2,0))*(('4 traços'!$M$4/100*(1+$C7))-1)*$D7,"")` |
| **H7** | 816.18976519733 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(H$3,Empacotamento!$U$2:$Z$2,0))*(($C7*$D7)-SUM($E7:$G7)),"")` |
| **I7** | 61.21423238979974 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(I$3,Empacotamento!$U$2:$Z$2,0))*(($C7*$D7)-SUM($E7:$G7)),"")` |
| **J7** | 142.83320890953289 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(J$3,Empacotamento!$U$2:$Z$2,0))*(($C7*$D7)-SUM($E7:$G7)),"")` |
| **K7** | 1.518325216918234 | `=D7*$E$13/100` |
| **L7** | 209.5639927452701 | `=B7*D7` |
| **A8** | 40 |  |
| **B8** | 0.5285390018021825 | `=((LOG(A8)-'Curvas dosagem (4t)'!$B$16)/'Curvas dosagem (4t)'!$B$15)` |
| **C8** | 4.424593988060749 | `='Curvas dosagem (4t)'!$B$36*B8+'Curvas dosagem (4t)'!$B$37` |
| **D8** | 407.76546404981764 | `='Curvas dosagem (4t)'!$B$58/(C8-'Curvas dosagem (4t)'!$B$59)` |
| **E8** | 115.98880379724902 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(E$3,Empacotamento!$U$2:$Z$2,0))*(('4 traços'!$M$4/100*(1+$C8))-1)*$D8,"")` |
| **F8** | 365.36473196133437 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(F$3,Empacotamento!$U$2:$Z$2,0))*(('4 traços'!$M$4/100*(1+$C8))-1)*$D8,"")` |
| **G8** | 305.340525996258 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(G$3,Empacotamento!$U$2:$Z$2,0))*(('4 traços'!$M$4/100*(1+$C8))-1)*$D8,"")` |
| **H8** | 814.0020472150267 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(H$3,Empacotamento!$U$2:$Z$2,0))*(($C8*$D8)-SUM($E8:$G8)),"")` |
| **I8** | 61.05015354112699 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(I$3,Empacotamento!$U$2:$Z$2,0))*(($C8*$D8)-SUM($E8:$G8)),"")` |
| **J8** | 142.4503582626298 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(J$3,Empacotamento!$U$2:$Z$2,0))*(($C8*$D8)-SUM($E8:$G8)),"")` |
| **K8** | 1.6310618561992707 | `=D8*$E$13/100` |
| **L8** | 215.51995133829433 | `=B8*D8` |
| **A9** | 45 |  |
| **B9** | 0.5077633404286988 | `=((LOG(A9)-'Curvas dosagem (4t)'!$B$16)/'Curvas dosagem (4t)'!$B$15)` |
| **C9** | 4.055502568055635 | `='Curvas dosagem (4t)'!$B$36*B9+'Curvas dosagem (4t)'!$B$37` |
| **D9** | 436.3432026244397 | `='Curvas dosagem (4t)'!$B$58/(C9-'Curvas dosagem (4t)'!$B$59)` |
| **E9** | 111.2954302017187 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(E$3,Empacotamento!$U$2:$Z$2,0))*(('4 traços'!$M$4/100*(1+$C9))-1)*$D9,"")` |
| **F9** | 350.58060513541386 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(F$3,Empacotamento!$U$2:$Z$2,0))*(('4 traços'!$M$4/100*(1+$C9))-1)*$D9,"")` |
| **G9** | 292.9852200060244 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(G$3,Empacotamento!$U$2:$Z$2,0))*(('4 traços'!$M$4/100*(1+$C9))-1)*$D9,"")` |
| **H9** | 811.7837787631029 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(H$3,Empacotamento!$U$2:$Z$2,0))*(($C9*$D9)-SUM($E9:$G9)),"")` |
| **I9** | 60.883783407232706 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(I$3,Empacotamento!$U$2:$Z$2,0))*(($C9*$D9)-SUM($E9:$G9)),"")` |
| **J9** | 142.06216128354313 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(J$3,Empacotamento!$U$2:$Z$2,0))*(($C9*$D9)-SUM($E9:$G9)),"")` |
| **K9** | 1.7453728104977588 | `=D9*$E$13/100` |
| **L9** | 221.55908213794206 | `=B9*D9` |
| **A10** | 50 |  |
| **B10** | 0.48917887804628457 | `=((LOG(A10)-'Curvas dosagem (4t)'!$B$16)/'Curvas dosagem (4t)'!$B$15)` |
| **C10** | 3.7253390422142107 | `='Curvas dosagem (4t)'!$B$36*B10+'Curvas dosagem (4t)'!$B$37` |
| **D10** | 465.52812103096153 | `='Curvas dosagem (4t)'!$B$58/(C10-'Curvas dosagem (4t)'!$B$59)` |
| **E10** | 106.50233836629563 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(E$3,Empacotamento!$U$2:$Z$2,0))*(('4 traços'!$M$4/100*(1+$C$10))-1)*$D$10,"")` |
| **F10** | 335.4823658538312 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(F$3,Empacotamento!$U$2:$Z$2,0))*(('4 traços'!$M$4/100*(1+$C$10))-1)*$D$10,"")` |
| **G10** | 280.36740574927325 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(G$3,Empacotamento!$U$2:$Z$2,0))*(('4 traços'!$M$4/100*(1+$C$10))-1)*$D$10,"")` |
| **H10** | 809.5183796446906 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(H$3,Empacotamento!$U$2:$Z$2,0))*(($C10*$D10)-SUM($E10:$G10)),"")` |
| **I10** | 60.713878473351784 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(I$3,Empacotamento!$U$2:$Z$2,0))*(($C10*$D10)-SUM($E10:$G10)),"")` |
| **J10** | 141.665716437821 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(J$3,Empacotamento!$U$2:$Z$2,0))*(($C10*$D10)-SUM($E10:$G10)),"")` |
| **K10** | 1.8621124841238463 | `=D10*$E$13/100` |
| **L10** | 227.72652394492073 | `=B10*D10` |
| **A12** | Item |  |
| **D12** | Unidade |  |
| **E12** | Valor |  |
| **H12** | Item |  |
| **K12** | Unidade |  |
| **L12** | Valor |  |
| **A13** | Teor de aditivo |  |
| **D13** | % |  |
| **E13** | 0.4 |  |
| **H13** | Custo da brita 0 |  |
| **K13** | R$/kg |  |
| **L13** | 0.033 |  |
| **A14** | Custo do cimento  |  |
| **D14** | R$/kg |  |
| **E14** | 0.5 |  |
| **H14** | Custo da brita 1 |  |
| **K14** | R$/kg |  |
| **L14** | 0.035 |  |
| **A15** | Custo da areia fina |  |
| **D15** | R$/kg |  |
| **E15** | 0.023 |  |
| **H15** | Custo da brita 2 |  |
| **K15** | R$/kg |  |
| **L15** | 0.038 |  |
| **A16** | Custo da areia média |  |
| **D16** | R$/kg |  |
| **E16** | 0.025 |  |
| **H16** | Custo da água |  |
| **K16** | R$/kg |  |
| **L16** | 0 |  |
| **A17** | Custo da areia grossa |  |
| **D17** | R$/kg |  |
| **E17** | 0.027 |  |
| **H17** | Custo do aditivo |  |
| **K17** | R$/kg |  |
| **L17** | 10 |  |
| **A19** | fc1 |  |
| **B19** | $R$/MPa |  |
| **C19** | $TOTAL
(R$) |  |
| **D19** | $cim
(R$) |  |
| **E19** | $areia fina
(R$) |  |
| **F19** | $areia média
(R$) |  |
| **G19** | $areia grossa
(R$) |  |
| **H19** | $brita 0
(kg) |  |
| **I19** | $brita 1
(kg) |  |
| **J19** | $brita 2
(kg) |  |
| **K19** | $ Aditivo
(kg) |  |
| **L19** | $ Água
(kg) |  |
| **A20** | 25 | `=A5` |
| **B20** | 9.26813090328443 | `=C20/A5` |
| **C20** | 231.70327258211074 | `=SUM(D20:L20)` |
| **D20** | 161.63884667404307 | `=D5*$E$14` |
| **E20** | 2.9868808066893933 | `=IFERROR(E5*$E$15,"")` |
| **F20** | 10.226820153338682 | `=IFERROR(F5*$E$16,"")` |
| **G20** | 9.23043567554197 | `=IFERROR(G5*$E$17,"")` |
| **H20** | 27.07848588463508 | `=IFERROR(H5*$L$13,"")` |
| **I20** | 2.153970468095972 | `=IFERROR(I5*$L$14,"")` |
| **J20** | 5.456725185843134 | `=IFERROR(J5*$L$15,"")` |
| **K20** | 12.931107733923445 | `=K5*$L$17` |
| **L20** | 0 | `=L5*$L$16` |
| **A21** | 30 | `=A6` |
| **B21** | 8.202197796186931 | `=C21/A6` |
| **C21** | 246.06593388560796 | `=SUM(D21:L21)` |
| **D21** | 175.76601522782946 | `=D6*$E$14` |
| **E21** | 2.880154808547396 | `=IFERROR(E6*$E$15,"")` |
| **F21** | 9.86139961622206 | `=IFERROR(F6*$E$16,"")` |
| **G21** | 8.900617539327282 | `=IFERROR(G6*$E$17,"")` |
| **H21** | 27.006111429687245 | `=IFERROR(H6*$L$13,"")` |
| **I21** | 2.1482134091796667 | `=IFERROR(I6*$L$14,"")` |
| **J21** | 5.442140636588495 | `=IFERROR(J6*$L$15,"")` |
| **K21** | 14.061281218226359 | `=K6*$L$17` |
| **L21** | 0 | `=L6*$L$16` |
| **A22** | 35 | `=A7` |
| **B22** | 7.437838696322172 | `=C22/A7` |
| **C22** | 260.324354371276 | `=SUM(D22:L22)` |
| **D22** | 189.79065211477922 | `=D7*$E$14` |
| **E22** | 2.7742034025993445 | `=IFERROR(E7*$E$15,"")` |
| **F22** | 9.49863121542167 | `=IFERROR(F7*$E$16,"")` |
| **G22** | 8.5731931455763 | `=IFERROR(G7*$E$17,"")` |
| **H22** | 26.93426225151189 | `=IFERROR(H7*$L$13,"")` |
| **I22** | 2.142498133642991 | `=IFERROR(I7*$L$14,"")` |
| **J22** | 5.42766193856225 | `=IFERROR(J7*$L$15,"")` |
| **K22** | 15.183252169182339 | `=K7*$L$17` |
| **L22** | 0 | `=L7*$L$16` |
| **A23** | 40 | `=A8` |
| **B23** | 6.866283553029648 | `=C23/A8` |
| **C23** | 274.6513421211859 | `=SUM(D23:L23)` |
| **D23** | 203.88273202490882 | `=D8*$E$14` |
| **E23** | 2.6677424873367275 | `=IFERROR(E8*$E$15,"")` |
| **F23** | 9.134118299033359 | `=IFERROR(F8*$E$16,"")` |
| **G23** | 8.244194201898965 | `=IFERROR(G8*$E$17,"")` |
| **H23** | 26.86206755809588 | `=IFERROR(H8*$L$13,"")` |
| **I23** | 2.1367553739394447 | `=IFERROR(I8*$L$14,"")` |
| **J23** | 5.413113613979933 | `=IFERROR(J8*$L$15,"")` |
| **K23** | 16.310618561992708 | `=K8*$L$17` |
| **L23** | 0 | `=L8*$L$16` |
| **A24** | 45 | `=A9` |
| **B24** | 6.426186658391003 | `=C24/A9` |
| **C24** | 289.1783996275951 | `=SUM(D24:L24)` |
| **D24** | 218.17160131221985 | `=D9*$E$14` |
| **E24** | 2.55979489463953 | `=IFERROR(E9*$E$15,"")` |
| **F24** | 8.764515128385346 | `=IFERROR(F9*$E$16,"")` |
| **G24** | 7.9106009401626585 | `=IFERROR(G9*$E$17,"")` |
| **H24** | 26.788864699182398 | `=IFERROR(H9*$L$13,"")` |
| **I24** | 2.1309324192531447 | `=IFERROR(I9*$L$14,"")` |
| **J24** | 5.398362128774639 | `=IFERROR(J9*$L$15,"")` |
| **K24** | 17.45372810497759 | `=K9*$L$17` |
| **L24** | 0 | `=L9*$L$16` |
| **A25** | 50 | `=A10` |
| **B25** | 6.080282154803989 | `=C25/A10` |
| **C25** | 304.01410774019945 | `=SUM(D25:L25)` |
| **D25** | 232.76406051548076 | `=D10*$E$14` |
| **E25** | 2.4495537824247995 | `=IFERROR(E10*$E$15,"")` |
| **F25** | 8.38705914634578 | `=IFERROR(F10*$E$16,"")` |
| **G25** | 7.569919955230378 | `=IFERROR(G10*$E$17,"")` |
| **H25** | 26.714106528274794 | `=IFERROR(H10*$L$13,"")` |
| **I25** | 2.1249857465673125 | `=IFERROR(I10*$L$14,"")` |
| **J25** | 5.383297224637198 | `=IFERROR(J10*$L$15,"")` |
| **K25** | 18.621124841238462 | `=K10*$L$17` |
| **L25** | 0 | `=L10*$L$16` |
