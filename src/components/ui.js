import { seState, useEffect } from "react";
import React from 'react'
export default function UI(props) {
  // useEffect(() => {
  //   console.log(props)
  // },[props])
  
  return (
    <div id='uiBar'>
      <ul className='uiBar ' id='Targets'>
        {props.targets.map((target) =>
          <li key={target['name']} className='targetLi'>
            <p className='uiBar'>{target['name']}</p>
            <div className={`indicator` + ` ${(props.found.includes(target['name'])) ? 'found' : 'notFound'}`}>  </div>
            </li>)}
      </ul>
    </div>
  )
}
