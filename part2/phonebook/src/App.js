import { useEffect, useState } from 'react'
import axios from 'axios'

const Name = (props) => {
  return(
    props.list.map(name=> <p key={name.id}>{name.name} {name.number}</p>)
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [contactNumber, setNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [filterKey, setFilterKey] = useState('')
  
  useEffect(() => {
    axios.get('http://localhost:3001/persons').then(response=>{
      setPersons(response.data)
    })
  },[])

  const addContact = (e) => {
    e.preventDefault()
    const contactObject = {
      name: newName,
      id: persons.length+1,
      number: contactNumber,
    }

    persons.map(e => e.name).includes(contactObject.name) ? 
    alert(`${newName} is already in your phonebook`):
    setPersons(persons.concat(contactObject))
    setNewName('')
    setNumber('')
  }

  const handleInputChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    setNumber(e.target.value)
  }

  const handleFilterChange = (e) => {
    setFilterKey(e.target.value)
  }
//
//OVER HERE 
//We're trying to filter the names to be shown
  const contactsToShow = showAll
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(filterKey))

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addContact}>
        <div>
          Filter: <input value={filterKey} onChange={handleFilterChange}/>
        </div>
        <div>
          <button onClick={()=>setShowAll(!showAll)}>Add filter</button>
        </div>
        <h2>Add Contact</h2>
        <div>
          name: <input value={newName} onChange={handleInputChange}/>
        </div>
        <div>
          number: <input value={contactNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Name list={contactsToShow} />
    </div>
  )
}

export default App