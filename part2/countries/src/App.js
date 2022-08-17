import { useState, useEffect } from 'react';
import axios from 'axios'


const Weather = ({capital}) => {

  //
  //I couldn't set the initial value to the axios response,
  //so I created a mock object as a placeholder
  //
  const [ weatherData, setWeatherData ] = useState({main:{temp:30},wind:{speed:30},weather:[{icon:'01d'}]})
  
  useEffect(()=>{
    const api_key = process.env.REACT_APP_API_KEY
    axios
    .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`).then(response=>{
      setWeatherData(response.data)
    })
  },[capital])

  const iconSource = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`

  return(
    <>
      <h2>Weather info</h2>
      <p>Temperature <span> {weatherData.main.temp} Celsius</span></p>
      <img src={iconSource} alt='weather icon'></img>
      <p>Wind Speed <span> {weatherData.wind.speed} KM/h</span></p>
    </>
  )
}

const Group = ({list,click}) => {
  return(
    <>
      <span>{list.name.common}<button data-info={list.name.common} onClick={click}>show</button></span><br></br>
    </>
  )
}

const Languages = ({list}) => {
  return(
    Object.keys(list).map((k,i) => <li key={i}>{list[k]}</li>)
  )
}

const Country =({country})=>{
  const [ nation,setNation ] = useState(country)
  useEffect(()=>{
    setNation(country)
  },[country])

  const handleShowBtn = (e) => {
    setNation(nation.filter(n => n.name.common===e.target.dataset.info))
  }

  return (
    nation.length === 1 ?
    <>
      <h1>{nation[0].name.common}</h1>
      <p>Capital City: {nation[0].capital}</p>
      <p>Land Area: {nation[0].area}</p>
      <h2>Languages:</h2>
      <Languages list={nation[0].languages} />
      <img src={nation[0].flags.png} alt=''></img>
      <Weather capital={nation[0].capital}/>
    </>
    : nation.length>1 && nation.length<10 ?
    nation.map((n,i) => <Group key={i} list={n} click={handleShowBtn} />) 
    : "Too many results, narrow down your search"
  )
}

function App() {
  const [ countries,setCountries ] = useState([])
  const [ filterKey, setFilterKey ] = useState('')
  //
  //GET DATA from database
  //
  useEffect(()=>{
    axios.get('https://restcountries.com/v3.1/all').then(response => {
        setCountries(response.data)
      })
  },[])

  //
  //Event handler for change in input element
  //
  const handleInputChange = (e) => {
    return(
      setFilterKey(e.target.value)
    )
  }


  //
  //FILTER OVER HERE TO RETURN THE DATA match from input value
  //
  const filterMatch = countries.filter(country=>country.name.common.toLowerCase().includes(filterKey.toLowerCase()))

  return (
    <div>
      <span>Find countries </span><input value={filterKey} onChange={handleInputChange}/>
      <div>
        <Country country={filterMatch} />
      </div>
    </div>
  );
}

export default App;
