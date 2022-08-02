import { useState } from "react";

const Button = ({handleClick,text}) => {
  return(<button onClick = {handleClick}>
    {text}
  </button>
  )
}

const StatisticLine = (props) => {
  return(
    <td>{props.text} {props.number} {props.text1}</td>
  )
}

const Statistics = (props) => {
  return(
    <table>
      <thead>
        <tr>
          <th>
            STATS
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <StatisticLine text='good' />
          <StatisticLine number={props.good} />
        </tr>
        <tr>
          <StatisticLine text='neutral' />
          <StatisticLine number={props.neutral} />
        </tr>
        <tr>
          <StatisticLine text='bad' />
          <StatisticLine number={props.bad} />
        </tr>
        <tr>
          <StatisticLine text='total' />
          <StatisticLine number={props.allClicks} />
        </tr>
        <tr>
          <StatisticLine text='average' />
          <StatisticLine number={props.averageFeedback} />
        </tr>
        <tr>
          <StatisticLine text='positive' />
          <StatisticLine number={props.percentPosFeedback} text1='%' />
        </tr>
      </tbody>
    </table>
  )
}

const History = (props) => {
  if (props.allClicks === 0) {
    return (
      <p>To show the statistics, give us your feedback first.</p>
    )
  }
  return (
    <>
      <Statistics good={props.good} neutral={props.neutral} bad={props.bad} allClicks={props.allClicks} averageFeedback={props.averageFeedback} percentPosFeedback={props.percentPosFeedback}/>
    </>
  )
}

const App = () => {
  //save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [bad, setBad] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [allClicks, setTotalClicks] = useState(0)

  const handleGoodClick = () => {
    setGood(good+1)
    setTotalClicks(allClicks+1)
  }
  const handleNeutralClick = () => {
    setNeutral(neutral+1)
    setTotalClicks(allClicks+1)
  }
  const handleBadClick = () => {
    setBad(bad+1)
    setTotalClicks(allClicks+1)
  }
  const averageFeedback = () => {
    const sum = good-bad
    return(
      sum/allClicks
    )
  }
  const percentPosFeedback = () => {
    return(
      good/allClicks*100
    )
  }

  return (
    <div>
      <h1>
        Give Feedback
      </h1>
      <Button handleClick={handleGoodClick} text="good"/>
      <Button handleClick={handleNeutralClick} text="neutral"/>
      <Button handleClick={handleBadClick} text="bad"/>
      
      <History good={good} neutral={neutral} bad={bad} allClicks={allClicks} averageFeedback={averageFeedback()} percentPosFeedback={percentPosFeedback()}/>
    </div>
  )
}

export default App;