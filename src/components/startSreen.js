import React from 'react'
import { useState, useEffect } from "react";


export default function StartScreen(props) {
    const [ok, setOk] = useState(false)
    let switchOK = () => {
        setOk(true)
        props.start()
    }

    return (
        <div>
            {(!ok) ? <ClickOK switch={switchOK} /> : null}
        </div>
    )
}

function ClickOK(props) {
    return (
        <div id='startCont'>
            <div id='startScreen'>
                <div>
                <h1>Find Them All</h1>
                <p> This Game is a version of 'whswld'.
                    The game consists of 3 rounds,  in each round you will
                    be given 3 characters to find. Click on the image to open the viewfinder,
                    choose the character from the dropdown list to submit your awnser.<br></br>
                    The game is timed, so at the end
                    you'll recieve a time score, and can enter it into the leaderboard.
                </p>
                    </div>
                <button onClick={props.switch}>Start</button>
            </div>
        </div>
    )
}