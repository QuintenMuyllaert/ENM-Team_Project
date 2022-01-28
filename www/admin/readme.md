# Admin control panel

## First login

The first login you get to decide the username & password!<br>
There is also a QR code to scan with Google Authenticator for two factor recovery.<br>
Incase you forget the username and/or password you can use this to recover the account.<br>

## Future logins

All future logins will use the set username and password.<br>

## Slide editor

### Data links

You can link any JavaScript code to any element using the data link function.<br>
The entire influx database is nicely organised so the enduser doesn"t need to worry about any math.<br>

#### Structure

`influx` : root object

`influx.BOARD` : any board written in the database

`influx.BOARD.minuut` : minute data.<br>
`influx.BOARD.uur` : hour data.<br>
`influx.BOARD.dag` : day data.<br>
`influx.BOARD.week` : week data.<br>
`influx.BOARD.maand` : month data.<br>
`influx.BOARD.jaar` : year data.<br>

`.uur` `.dag` `.week` all have a subobject for both daytime & nighttime data.<br>
`influx.BOARD.TIME.overdag` : daytime data.<br>
`influx.BOARD.TIME.snachts` : nighttime data.<br>

`influx.BOARD.TIME.MODIFIER.gemiddeld` : average value for the `TIME` specified. ( W/h ) ( Watt / hour ) <br>
`influx.BOARD.TIME.MODIFIER.totaal` : total value for the `TIME` specified. ( W/`TIME` ) ( Watt / `TIME` ) <br>

every `TIME` frame also has a `data` object assigned to it.<br>
This object can be used to get a sub `TIME` frame.<br>
`influx.BOARD.dag.data[0]` will return the last `HOUR`'s data.<br>
`influx.BOARD.dag.data[1]` will return previous `HOUR`'s data.<br>

At moment of writing these are all available `BOARDS` : <br>

```txt
Aansluiting_Conciergewoning_EB2
Aansluiting_Directeurswoning_EB2
Bord_EB_Niveau1_Totaal
Bord_HVAC_Totaal
Bord_Waterbehandeling_Totaal
Buitenbar_Totaal
Compressor_Totaal
Stopcontacten_Circuit_Niveau0_Cafetaria_Totaal
TotaalNet
Voeding_Datarack_Totaal
Aansluiting_Fuifzaal_EB1_I
Aansluiting_kantoren_Verdiep_4_EB3_B
Aansluiting_kantoren_Verdiep_5_EB3_D
Aansluiting_Machinezaal_EB3_A
Aansluiting_Mechaniekersgebouw_EB2
Aansluiting_Oenanthe_EB3_C
Aansluiting_Opzichterswoning_En_Kantoorgebouwen_EB2
Aansluiting_Reserve_Loods_EB3_H
Aansluiting_Silo
Stopcontact16A_EB1_D
Stopcontact63A_Fuifzaal_EB1_E
Stopcontact_125A_EB1_A
Stopcontact_32A_EB1_C
Stopcontact_63A_EB1_B
Stopcontact_Fuifzaal_Opbouw
Stopcontact32A_EB2_C
Stopcontact63A_EB2_A
Stopcontact63A_EB2_B
Totaal
Totaal_EB2
Aansluiting_Waterkot_EB3_I
```

#### Examples

```js
//Average power useage of the compressor TODAY in W/h
influx.Compressor_Totaal.dag.gemiddeld;

//Average power useage of the compressor TODAY in W/day
influx.Compressor_Totaal.dag.totaal;

//Average power useage of the compressor PAST NIGHT in W/h
influx.Compressor_Totaal.dag.snachts.gemiddeld;

//Average power useage of the compressor PAST NIGHT in W/h
influx.Compressor_Totaal.dag.overdag.average;

//Basic math is also allowed
influx.Stopcontact63A_EB2_A.uur.average + influx.Stopcontact63A_EB2_B.uur.average;

//Switch from W/UNIT -> kW/UNIT
//1234 -> 1.23 / 1000 -> 1.00
k(influx.BOARD.TIME.TYPE);

//Format number as kW
//1234 -> 1.23 kW / 1000 -> 1.00 kW
kW(influx.BOARD.TIME.TYPE);

//Format number as kW/h !!ONLY IMPORT VALUES WITH /h AS TIME!!
//( .gemiddeld OR influx.BOARD.uur.totaal)
//1234 -> 1.23 kW/h / 1000 -> 1.00 kW/h
kWh(influx.BOARD.TIME.TYPE);

//Format number as kW AS NUMBER
//1234 -> 1.234 / 1000 -> 1
//!!!ALWAYS USE WITH GRAPHS / CHARTS!!!
kN(influx.BOARD.TIME.TYPE);


//Basic math can also be done within the functions!
k(influx.Stopcontact63A_EB2_A.uur.average + influx.Stopcontact63A_EB2_B.uur.average);
kW(influx.Stopcontact63A_EB2_A.uur.average + influx.Stopcontact63A_EB2_B.uur.average);
kWh(influx.Stopcontact63A_EB2_A.uur.average + influx.Stopcontact63A_EB2_B.uur.average);
kN(influx.Stopcontact63A_EB2_A.uur.average + influx.Stopcontact63A_EB2_B.uur.average);

//Piechart's are a bit more advanced and need some extra code.
//"title" has the unit of the piechart.
//"data" has a list of data you want in order.
//"labels" has the correct labels to match the data.
{
  title: "kW/h",
  data: [
    kN(influx.Bord_Waterbehandeling_Totaal.minuut.gemiddeld),
    kN(influx.Bord_HVAC_Totaal.minuut.gemiddeld),
    kN(influx.Compressor_Totaal.minuut.gemiddeld),
    kN(influx.Buitenbar_Totaal.minuut.gemiddeld)
  ],
  labels: [
    "Waterbehandeling",
    "Airconditioning",
    "Compressor",
    "Bar"
  ]
}
```
