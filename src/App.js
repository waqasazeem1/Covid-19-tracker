import React, { useState, useEffect } from "react";
import {
  MenuItem,
  Select,
  FormControl,
  CardContent,
  Card,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import CountryTable from "./CountryTable";
import { sortData, prettyPrintStat } from "./utils";
import LineGraph from "./LineGraph";
import "./App.css";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide"); // set the country in state
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.8076, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [caseType, setCaseType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all") // fetch worldwide data
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          // set countries in state
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onChangeCountry = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // All of the data ..
        // console.log(data.countryInfo);
        // From the country response
        setCountry(countryCode);
        setCountryInfo(data);
        if (countryCode === "worldwide") {
          setMapCenter(mapCenter);
          setMapZoom(3);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        }
      });
  };

  // console.log(countryInfo);

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>Covid-19 App</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              onChange={onChangeCountry}
              value={country}
            >
              <MenuItem value="worldwide">worldwide</MenuItem>

              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app_status">
          <InfoBox
            isRed
            active={caseType === "cases"}
            onClick={(e) => setCaseType("cases")}
            title="cronavirus cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases) + " Total"}
          />
          <InfoBox
            isGreen
            active={caseType === "recovered"}
            onClick={(e) => setCaseType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered) + " Total"}
          />
          <InfoBox
            isRed
            active={caseType === "deaths"}
            onClick={(e) => setCaseType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths) + " Total"}
          />
        </div>
        <div>
          <Map
            caseType={caseType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </div>

      <Card className="app_right">
        <CardContent>
          <h3>Live cases by country</h3>
          <CountryTable countries={tableData} />
          <h3>Worldwide new {caseType}</h3>
          <LineGraph className="app_graph" caseType={caseType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
