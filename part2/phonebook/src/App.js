
import { useEffect, useState } from 'react'
import contactService from './services/persons'
import axios from 'axios'

const Notification = ({msg,classify}) => {
  if (msg===null) {
    return null
  }
  return (
    <div className={classify}>
      {msg}
    </div>
  )
}

const Name = (props) => {
  return(
    props.list.map(name=> {
      return(
        <li key={name.id}>{name.name} {name.number}
        <button onClick={()=>props.handleBtn(name.id)}>delete</button>
        </li>
      )
    })
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [contactNumber, setNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [filterKey, setFilterKey] = useState('')
  const [alertMessage, setAlertMessage] = useState(null)
  const [className, setClassName] = useState('')

  useEffect(() => {
    contactService.getAll()
    .then(response => {
      setPersons(response)
    })
  },[])

  const notifyMsg = (str,ver) => {
    setAlertMessage(`${newName} has been ${str}`)
    setTimeout(()=>{
      setAlertMessage(null)
    },5000)
    setClassName(ver)
  }
  //
  //
  //ADDING A CONTACT
  //
  const addContact = (e) => {
    e.preventDefault()
    const contactObject = {
      name: newName,
      id: Math.floor(Math.random()*999999),
      number: contactNumber,
    }
    //
    //Check if name exists in Phonebook
    //

    const updateContact = (name) => {
      notifyMsg('changed','correct')
      const contactToUpdate = persons.find(p=>p.name===name)
      const url = `http://localhost:3001/persons/${contactToUpdate.id}`
      const updatedObj={...contactToUpdate, number:contactNumber}
      window.confirm('The name already exists in your phonebook. Do you want to update it instead?')
      ? axios.put(url,updatedObj)
      .then(response=>{
        setPersons(persons.map(p=>p.name!==name?p:response.data))
      })
      : console.log('wow');
    }

    const createContact = (obj) => {
      notifyMsg('added','correct')
      contactService
      .create(obj)
      .then(response => {
        setPersons(persons.concat(response))
      })
    }

    persons.map(e => e.name).includes(contactObject.name) 
    ? updateContact(contactObject.name)
    : createContact(contactObject)
  }

  //
  //DELETE BTN handler
  //
  const deleteContact = (id) => {
    const deleteAndReset = () => {
      contactService
      .removeContact(id)
      .then(response=>console.log(response))
      .catch(error=>{
        console.log(error)
        notifyMsg('deleted already','error')
      })
      setPersons(persons.filter(person=>person.id!==id))
    }

    window.confirm('Are you sure you want to delete this contact?')
    ? deleteAndReset()
    : alert('Whew');
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
      <Notification msg={alertMessage} classify={className}/>
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
      <Name list={contactsToShow} handleBtn={deleteContact}/>
    </div>
  )
}

export default App