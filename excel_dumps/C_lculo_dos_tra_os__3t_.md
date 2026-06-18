# Sheet: Cálculo dos traços (3t)

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
| **B5** | 0.6058038134339251 | `=((LOG(A5)-'Curvas dosagem (3t)'!$B$15)/'Curvas dosagem (3t)'!$B$14)` |
| **C5** | 5.680217412327664 | `='Curvas dosagem (3t)'!$B$34*B5+'Curvas dosagem (3t)'!$B$35` |
| **D5** | 332.68788826269986 | `='Curvas dosagem (3t)'!$B$53/(C5-'Curvas dosagem (3t)'!$B$54)` |
| **E5** | 127.89132631338366 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(E$3,Empacotamento!$U2:$Z$2,0))*(('3 traços'!$M$3/100*(1+$C5))-1)*$D5,"")` |
| **F5** | 402.85767788715845 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(F$3,Empacotamento!$U2:$Z$2,0))*(('3 traços'!$M$3/100*(1+$C5))-1)*$D5,"")` |
| **G5** | 336.6739165199824 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(G$3,Empacotamento!$U2:$Z$2,0))*(('3 traços'!$M$3/100*(1+$C5))-1)*$D5,"")` |
| **H5** | 817.8532920478268 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(H$3,Empacotamento!$U2:$Z$2,0))*(($C5*$D5)-SUM($E5:$G5)),"")` |
| **I5** | 61.338996903587 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(I$3,Empacotamento!$U2:$Z$2,0))*(($C5*$D5)-SUM($E5:$G5)),"")` |
| **J5** | 143.12432610836984 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(J$3,Empacotamento!$U2:$Z$2,0))*(($C5*$D5)-SUM($E5:$G5)),"")` |
| **K5** | 1.3307515530507996 | `=D5*$E$13/100` |
| **L5** | 201.54359139282315 | `=B5*D5` |
| **A6** | 30 |  |
| **B6** | 0.5742302740266565 | `=((LOG(A6)-'Curvas dosagem (3t)'!$B$15)/'Curvas dosagem (3t)'!$B$14)` |
| **C6** | 5.1314581631837015 | `='Curvas dosagem (3t)'!$B$34*B6+'Curvas dosagem (3t)'!$B$35` |
| **D6** | 361.543467363875 | `='Curvas dosagem (3t)'!$B$53/(C6-'Curvas dosagem (3t)'!$B$54)` |
| **E6** | 123.18796912136673 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(E$3,Empacotamento!$U2:$Z$2,0))*(('3 traços'!$M$3/100*(1+$C6))-1)*$D6,"")` |
| **F6** | 388.0421027323051 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(F$3,Empacotamento!$U2:$Z$2,0))*(('3 traços'!$M$3/100*(1+$C6))-1)*$D6,"")` |
| **G6** | 324.29232871199787 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(G$3,Empacotamento!$U2:$Z$2,0))*(('3 traços'!$M$3/100*(1+$C6))-1)*$D6,"")` |
| **H6** | 815.7782211075413 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(H$3,Empacotamento!$U$2:$Z$2,0))*(($C6*$D6)-SUM($E6:$G6)),"")` |
| **I6** | 61.18336658306559 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(I$3,Empacotamento!$U$2:$Z$2,0))*(($C6*$D6)-SUM($E6:$G6)),"")` |
| **J6** | 142.76118869381986 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(J$3,Empacotamento!$U$2:$Z$2,0))*(($C6*$D6)-SUM($E6:$G6)),"")` |
| **K6** | 1.4461738694555002 | `=D6*$E$13/100` |
| **L6** | 207.60920433690546 | `=B6*D6` |
| **A7** | 35 |  |
| **B7** | 0.5475352268267053 | `=((LOG(A7)-'Curvas dosagem (3t)'!$B$15)/'Curvas dosagem (3t)'!$B$14)` |
| **C7** | 4.667488828978 | `='Curvas dosagem (3t)'!$B$34*B7+'Curvas dosagem (3t)'!$B$35` |
| **D7** | 390.154735723685 | `='Curvas dosagem (3t)'!$B$53/(C7-'Curvas dosagem (3t)'!$B$54)` |
| **E7** | 118.52443371488586 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(E$3,Empacotamento!$U2:$Z$2,0))*(('3 traços'!$M$3/100*(1+$C7))-1)*$D7,"")` |
| **F7** | 373.35196620189043 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(F$3,Empacotamento!$U2:$Z$2,0))*(('3 traços'!$M$3/100*(1+$C7))-1)*$D7,"")` |
| **G7** | 312.015571754437 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(G$3,Empacotamento!$U2:$Z$2,0))*(('3 traços'!$M$3/100*(1+$C7))-1)*$D7,"")` |
| **H7** | 813.7207191135601 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(H$3,Empacotamento!$U$2:$Z$2,0))*(($C7*$D7)-SUM($E7:$G7)),"")` |
| **I7** | 61.029053933517 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(I$3,Empacotamento!$U$2:$Z$2,0))*(($C7*$D7)-SUM($E7:$G7)),"")` |
| **J7** | 142.40112584487315 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(J$3,Empacotamento!$U$2:$Z$2,0))*(($C7*$D7)-SUM($E7:$G7)),"")` |
| **K7** | 1.5606189428947403 | `=D7*$E$13/100` |
| **L7** | 213.62346172198113 | `=B7*D7` |
| **A8** | 40 |  |
| **B8** | 0.5244109251189129 | `=((LOG(A8)-'Curvas dosagem (3t)'!$B$15)/'Curvas dosagem (3t)'!$B$14)` |
| **C8** | 4.265580310630977 | `='Curvas dosagem (3t)'!$B$34*B8+'Curvas dosagem (3t)'!$B$35` |
| **D8** | 418.86864883641897 | `='Curvas dosagem (3t)'!$B$53/(C8-'Curvas dosagem (3t)'!$B$54)` |
| **E8** | 113.84416757722836 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(E$3,Empacotamento!$U2:$Z$2,0))*(('3 traços'!$M$3/100*(1+$C8))-1)*$D8,"")` |
| **F8** | 358.60912786826935 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(F$3,Empacotamento!$U2:$Z$2,0))*(('3 traços'!$M$3/100*(1+$C8))-1)*$D8,"")` |
| **G8** | 299.69477114705364 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(G$3,Empacotamento!$U2:$Z$2,0))*(('3 traços'!$M$3/100*(1+$C8))-1)*$D8,"")` |
| **H8** | 811.6558356997426 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(H$3,Empacotamento!$U$2:$Z$2,0))*(($C8*$D8)-SUM($E8:$G8)),"")` |
| **I8** | 60.874187677480684 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(I$3,Empacotamento!$U$2:$Z$2,0))*(($C8*$D8)-SUM($E8:$G8)),"")` |
| **J8** | 142.0397712474551 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(J$3,Empacotamento!$U$2:$Z$2,0))*(($C8*$D8)-SUM($E8:$G8)),"")` |
| **K8** | 1.675474595345676 | `=D8*$E$13/100` |
| **L8** | 219.65929563961552 | `=B8*D8` |
| **A9** | 45 |  |
| **B9** | 0.5040138454581281 | `=((LOG(A9)-'Curvas dosagem (3t)'!$B$15)/'Curvas dosagem (3t)'!$B$14)` |
| **C9** | 3.9110718732017205 | `='Curvas dosagem (3t)'!$B$34*B9+'Curvas dosagem (3t)'!$B$35` |
| **D9** | 447.9478391668876 | `='Curvas dosagem (3t)'!$B$53/(C9-'Curvas dosagem (3t)'!$B$54)` |
| **E9** | 109.10436254682888 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(E$3,Empacotamento!$U2:$Z$2,0))*(('3 traços'!$M$3/100*(1+$C9))-1)*$D9,"")` |
| **F9** | 343.67874202251096 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(F$3,Empacotamento!$U2:$Z$2,0))*(('3 traços'!$M$3/100*(1+$C9))-1)*$D9,"")` |
| **G9** | 287.217234404527 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(G$3,Empacotamento!$U2:$Z$2,0))*(('3 traços'!$M$3/100*(1+$C9))-1)*$D9,"")` |
| **H9** | 809.5646843625881 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(H$3,Empacotamento!$U$2:$Z$2,0))*(($C9*$D9)-SUM($E9:$G9)),"")` |
| **I9** | 60.717351327194095 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(I$3,Empacotamento!$U$2:$Z$2,0))*(($C9*$D9)-SUM($E9:$G9)),"")` |
| **J9** | 141.67381976345305 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(J$3,Empacotamento!$U$2:$Z$2,0))*(($C9*$D9)-SUM($E9:$G9)),"")` |
| **K9** | 1.7917913566675505 | `=D9*$E$13/100` |
| **L9** | 225.7719129831621 | `=B9*D9` |
| **A10** | 50 |  |
| **B10** | 0.48576803595765317 | `=((LOG(A10)-'Curvas dosagem (3t)'!$B$15)/'Curvas dosagem (3t)'!$B$14)` |
| **C10** | 3.593953269792962 | `='Curvas dosagem (3t)'!$B$34*B10+'Curvas dosagem (3t)'!$B$35` |
| **D10** | 477.6078317468609 | `='Curvas dosagem (3t)'!$B$53/(C10-'Curvas dosagem (3t)'!$B$54)` |
| **E10** | 104.26988880686136 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(E$3,Empacotamento!$U2:$Z$2,0))*(('3 traços'!$M$3/100*(1+$C10))-1)*$D10,"")` |
| **F10** | 328.45014974161325 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(F$3,Empacotamento!$U2:$Z$2,0))*(('3 traços'!$M$3/100*(1+$C10))-1)*$D10,"")` |
| **G10** | 274.4904822840625 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(G$3,Empacotamento!$U2:$Z$2,0))*(('3 traços'!$M$3/100*(1+$C10))-1)*$D10,"")` |
| **H10** | 807.4317662022562 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(H$3,Empacotamento!$U$2:$Z$2,0))*(($C10*$D10)-SUM($E10:$G10)),"")` |
| **I10** | 60.557382465169205 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(I$3,Empacotamento!$U$2:$Z$2,0))*(($C10*$D10)-SUM($E10:$G10)),"")` |
| **J10** | 141.30055908539498 | `=IFERROR(INDEX(Empacotamento!$U$7:$Z$7,1,MATCH(J$3,Empacotamento!$U$2:$Z$2,0))*(($C10*$D10)-SUM($E10:$G10)),"")` |
| **K10** | 1.9104313269874436 | `=D10*$E$13/100` |
| **L10** | 232.0066183856659 | `=B10*D10` |
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
| **A19** | fc1 | `=A3` |
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
| **B20** | 9.453173831264243 | `=C20/A5` |
| **C20** | 236.32934578160607 | `=SUM(D20:L20)` |
| **D20** | 166.34394413134993 | `=D5*$E$14` |
| **E20** | 2.941500505207824 | `=IFERROR(E5*$E$15,"")` |
| **F20** | 10.071441947178961 | `=IFERROR(F5*$E$16,"")` |
| **G20** | 9.090195746039525 | `=IFERROR(G5*$E$17,"")` |
| **H20** | 26.989158637578285 | `=IFERROR(H5*$L$13,"")` |
| **I20** | 2.1468648916255453 | `=IFERROR(I5*$L$14,"")` |
| **J20** | 5.438724392118054 | `=IFERROR(J5*$L$15,"")` |
| **K20** | 13.307515530507995 | `=K5*$L$17` |
| **L20** | 0 | `=L5*$L$16` |
| **A21** | 30 | `=A6` |
| **B21** | 8.367025513571226 | `=C21/A6` |
| **C21** | 251.0107654071368 | `=SUM(D21:L21)` |
| **D21** | 180.7717336819375 | `=D6*$E$14` |
| **E21** | 2.833323289791435 | `=IFERROR(E6*$E$15,"")` |
| **F21** | 9.70105256830763 | `=IFERROR(F6*$E$16,"")` |
| **G21** | 8.755892875223942 | `=IFERROR(G6*$E$17,"")` |
| **H21** | 26.920681296548864 | `=IFERROR(H6*$L$13,"")` |
| **I21** | 2.141417830407296 | `=IFERROR(I6*$L$14,"")` |
| **J21** | 5.424925170365155 | `=IFERROR(J6*$L$15,"")` |
| **K21** | 14.461738694555002 | `=K6*$L$17` |
| **L21** | 0 | `=L6*$L$16` |
| **A22** | 35 | `=A7` |
| **B22** | 7.587653778833575 | `=C22/A7` |
| **C22** | 265.5678822591751 | `=SUM(D22:L22)` |
| **D22** | 195.0773678618425 | `=D7*$E$14` |
| **E22** | 2.7260619754423745 | `=IFERROR(E7*$E$15,"")` |
| **F22** | 9.333799155047261 | `=IFERROR(F7*$E$16,"")` |
| **G22** | 8.424420437369799 | `=IFERROR(G7*$E$17,"")` |
| **H22** | 26.852783730747486 | `=IFERROR(H7*$L$13,"")` |
| **I22** | 2.136016887673095 | `=IFERROR(I7*$L$14,"")` |
| **J22** | 5.411242782105179 | `=IFERROR(J7*$L$15,"")` |
| **K22** | 15.606189428947403 | `=K7*$L$17` |
| **L22** | 0 | `=L7*$L$16` |
| **A23** | 40 | `=A8` |
| **B23** | 7.004430592445658 | `=C23/A8` |
| **C23** | 280.1772236978263 | `=SUM(D23:L23)` |
| **D23** | 209.43432441820948 | `=D8*$E$14` |
| **E23** | 2.618415854276252 | `=IFERROR(E8*$E$15,"")` |
| **F23** | 8.965228196706734 | `=IFERROR(F8*$E$16,"")` |
| **G23** | 8.091758820970448 | `=IFERROR(G8*$E$17,"")` |
| **H23** | 26.784642578091507 | `=IFERROR(H8*$L$13,"")` |
| **I23** | 2.130596568711824 | `=IFERROR(I8*$L$14,"")` |
| **J23** | 5.397511307403294 | `=IFERROR(J8*$L$15,"")` |
| **K23** | 16.75474595345676 | `=K8*$L$17` |
| **L23** | 0 | `=L8*$L$16` |
| **A24** | 45 | `=A9` |
| **B24** | 6.554942542213552 | `=C24/A9` |
| **C24** | 294.9724143996098 | `=SUM(D24:L24)` |
| **D24** | 223.9739195834438 | `=D9*$E$14` |
| **E24** | 2.509400338577064 | `=IFERROR(E9*$E$15,"")` |
| **F24** | 8.591968550562774 | `=IFERROR(F9*$E$16,"")` |
| **G24** | 7.754865328922229 | `=IFERROR(G9*$E$17,"")` |
| **H24** | 26.715634583965407 | `=IFERROR(H9*$L$13,"")` |
| **I24** | 2.1251072964517936 | `=IFERROR(I9*$L$14,"")` |
| **J24** | 5.383605151011216 | `=IFERROR(J9*$L$15,"")` |
| **K24** | 17.917913566675505 | `=K9*$L$17` |
| **L24** | 0 | `=L9*$L$16` |
| **A25** | 50 | `=A10` |
| **B25** | 6.20126222534546 | `=C25/A10` |
| **C25** | 310.06311126727303 | `=SUM(D25:L25)` |
| **D25** | 238.80391587343044 | `=D10*$E$14` |
| **E25** | 2.398207442557811 | `=IFERROR(E10*$E$15,"")` |
| **F25** | 8.21125374354033 | `=IFERROR(F10*$E$16,"")` |
| **G25** | 7.411243021669688 | `=IFERROR(G10*$E$17,"")` |
| **H25** | 26.645248284674455 | `=IFERROR(H10*$L$13,"")` |
| **I25** | 2.1195083862809225 | `=IFERROR(I10*$L$14,"")` |
| **J25** | 5.369421245245009 | `=IFERROR(J10*$L$15,"")` |
| **K25** | 19.104313269874435 | `=K10*$L$17` |
| **L25** | 0 | `=L10*$L$16` |
