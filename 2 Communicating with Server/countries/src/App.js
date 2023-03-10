import { useState, useEffect } from "react";
import Search from "./components/Search";
import CountryInfo from "./components/CountryInfo";
import CountryList from "./components/CountryList";
import getAll from "./services/countries";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [newSearch, setNewSearch] = useState("");

  const hook = () => {
    getAll.getCountries().then((countries) => setCountries(countries));
  };
  useEffect(hook, []);

  if (!countries) {
    return null;
  }

  const countriesToShow = countries.filter((c) =>
    c.name.common.toLowerCase().includes(newSearch.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value);
  };

  const showCountryInfo = (countryName) => {
    setNewSearch(countryName);
  };

  return (
    <>
      <Search newSearch={newSearch} handleSearchChange={handleSearchChange} />
      <CountryList
        countriesToShow={countriesToShow}
        showCountryInfo={showCountryInfo}
      />
      <CountryInfo countriesToShow={countriesToShow} />
    </>
  );
};

export default App;
