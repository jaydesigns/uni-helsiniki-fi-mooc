import React from "react"

const TotalExercises = ({parts}) => {
    const total = parts.reduce(
      (acc,next) => acc+next.exercises,0
      )
    return (
      <span>The total number of exercises is {total}.</span>
    )
}
  
const Header = ({course}) => {
    return(
      <h1>{course.name}</h1>
    )
}
  
const ListItem = ({val}) => {
    return(
      <li>{val.name} {val.exercises}</li>
    )
}

const Course = ({course}) => {
    return(
      <div>
        <Header key={course.id} course={course} />
        <ul>
          {course.parts.map(val => {
            return (
              <ListItem key={val.id} val={val}/>
            )
          })
        }
        </ul>
        <TotalExercises parts={course.parts} />
      </div>
    )
  }

export default Course