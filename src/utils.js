import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    // rgb: "rgb(204, 16, 52)",
    // half_op: "rgba(204,16, 52, 0.5)",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    // rgb: "rgb(125, 215, 29)",
    // half_op: "rgba(125, 215, 29, 0.5)",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    // rgb: "rgb(251, 68, 67)",
    // half_op: "rgba(251, 68, 67, 0.5)",
    multiplier: 200,
  },
};

export const prettyPrintStat = (stat) => {
  return stat ? `${numeral(stat).format("0.0a")}` : "+0";
};

export const sortData = (data) => {
  const sortedData = [...data];

  //   ternary operator
  return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));

  // OR sendcom=n way

  //   sortedData.sort((a, b) => {
  //     if (a.cases > b.cases) {
  //       return -1;
  //     } else {
  //       return 1;
  //     }
  //   });
  //   return sortedData;
};

//Draw circles on the map with interactive tooltip
export const showDataOnMap = (data, caseType = "cases") =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[caseType].hex}
      fillColor={casesTypeColors[caseType].hex}
      radius={
        Math.sqrt(country[caseType]) * casesTypeColors[caseType].multiplier
      }
      fillOpacity={0.4}
    >
      <Popup>
        <div className="info_container">
          <div
            className="info_flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className="info_name">{country.country}</div>
          <div className="info_confirmed">
            Cases:{numeral(country.cases).format("0,0")}
          </div>
          <div className="info_recovered">
            Recovered:{numeral(country.recovered).format("0,0")}
          </div>
          <div className="info_deaths">
            Deaths:{numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
