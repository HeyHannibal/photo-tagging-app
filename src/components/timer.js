import { useState } from 'react'

import Leaderboard from './leaderboard'

export default function Timer(props) {

    const [userInput, setUserInput] = useState(null)

    function handleChange(e) {
        setUserInput(e.currentTarget.value)
    }

    async function enterLeaderboard() {
        props.addDoc(props.collection(props.db, "leaderboard"), {
          name: userInput,
          score:  props.myTime,
        });
        props.resetTime('display Leaderboard')
      }

    return (<div>
        {(props.myTime && props.myTime !== 'display Leaderboard') ? <div className="popUp" id="timeScore">
            <h3>Your time is {props.myTime}s</h3>
            <label>
                <h1>{userInput}</h1>
                Enter Your Name
                <input onChange={handleChange} type='text'></input>
                <button onClick={enterLeaderboard}>Submit Score</button>
            </label>
        </div> : null}
        {(props.myTime === 'display Leaderboard') ? <Leaderboard getCollection={props.getCollection} /> : null}
    </div>

    )

}