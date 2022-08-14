import { useState, useEffect } from 'react';
import axios from 'axios'

const Country =({list})=>{
  return(
    <li>{list}</li>
  )
}

function App() {
  const [ countries,setCountries ] = useState([])
  const [ filterKey, setFilterKey ] = useState("Country's name goes here")


  useEffect(()=>{
    axios.get('https://restcountries.com/v3.1/all').then(response => {
        setCountries(response.data.map(i=>i.name.common))
      })
  },[])

  const handleInputChange = (e) => {
    return(
      setFilterKey(e.target.value)
    )
  }

  const filterMatch = countries.filter(country=>country.toLowerCase().includes(filterKey.toLowerCase()))

  return (
    <div>
      <span>Find countries </span><input value={filterKey} onChange={handleInputChange}/>
      <ul>
        {filterMatch.length>10
          ? "Too many results, narrow down your search"
          : filterMatch.map(country=>{
          return(<Country key={countries.indexOf(country)} list={country} />)
        })}
      </ul>
    </div>
  );
}

export default App;
