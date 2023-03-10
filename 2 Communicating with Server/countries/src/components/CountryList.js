const CountryList = ({ countriesToShow, showCountryInfo }) => {
  if (countriesToShow.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countriesToShow.length > 1) {
    return countriesToShow.map((country) => (
      <div key={country.cca2.toLowerCase()}>
        {country.name.common} &nbsp;
        <button onClick={() => showCountryInfo(country.name.common)}>
          show
        </button>
      </div>
    ));
  }
  return null;
};

export default CountryList;
