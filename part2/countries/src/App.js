import { useState, useEffect } from 'react';
import axios from 'axios'

const Group = ({list,click}) => {
  return(
    <>
      <span>{list.name.common}<button onClick={click}>show</button></span><br></br>
    </>
  )
}
//
//
//UPDATE the SHOW BUTTON 
//
//
//
const Languages = ({list}) => {
  return(
    Object.keys(list).map((k,i) => <li key={i}>{list[k]}</li>)
  )
}

const Country =({country})=>{
  return (
    <>
      <h1>{country.name.common}</h1>
      <p>Capital City: {country.capital}</p>
      <p>Land Area: {country.area}</p>
      <h2>Languages:</h2>
      <Languages list={country.languages} />
      <img src={country.flags.png} alt=''></img>
    </>
  )
}

function App() {
  const [ countries,setCountries ] = useState([])
  const [ filterKey, setFilterKey ] = useState('')
  //const [ countriesToShow, setCountriesToShow ] = useState('')
  //
  //PROBABLY USE useState to change the country/list to display depending on filterMatch
  //
  useEffect(()=>{
    axios.get('https://restcountries.com/v3.1/all').then(response => {
        setCountries(response.data)
      })
  },[])

  const handleInputChange = (e) => {
    return(
      setFilterKey(e.target.value)
    )
  }

  const handleShowBtn = (c) => {
    return (
      <Country country={c} />
    )
  }

  //
  //FIX THE FILTER OVER HERE TO RETURN THE DATA NOT JUST THE NAME
  //
  const filterMatch = countries.filter(country=>country.name.common.toLowerCase().includes(filterKey.toLowerCase()))


  const areThereMoreThanOne = filterMatch.length<10 && filterMatch.length>1
  const exactMatch = filterMatch.length===1

  const showWhich = () => {
    return (
      exactMatch ? <Country country={filterMatch[0]}/>
      : areThereMoreThanOne ? filterMatch.map((country,i) => {
        return(
          <Group key={i} list={country} click={handleShowBtn(country)}/>
        )
      })
      : "There are too many on this list, narrow your search"
    )
  }

  return (
    <div>
      <span>Find countries </span><input value={filterKey} onChange={handleInputChange}/>
      <div>
        {showWhich()}  
      </div>
    </div>
  );
}

export default App;
