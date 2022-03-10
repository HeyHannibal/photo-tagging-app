import { useRef, useState, useEffect } from "react";

// firebase

import img1 from "./assets/5.jpg";
import StartGame from "./components/startSreen";
import UI from "./components/ui";
import Viewfinder from "./components/viewfinder";
import LoadAnimation from "./components/animations";
import Timer from "./components/timer";
import Leaderboard from "./components/leaderboard";

import { initializeApp } from "firebase/app";
import { getDoc, getFirestore } from "firebase/firestore";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAeIFD5PXQCHqo-AD45_GLzp5yRsJ403dA",
  authDomain: "phototagging-47506.firebaseapp.com",
  projectId: "phototagging-47506",
  storageBucket: "phototagging-47506.appspot.com",
  messagingSenderId: "196085090300",
  appId: "1:196085090300:web:78eeebade8eee855a09479",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

async function enterLeaderboard(name, score) {
  addDoc(collection(db, "leaderboard"), {
    name: name,
    score: score,
  });
}

function App() {
  const [gameState, setGameState] = useState({
    found: [],
    isOver: false,
    isOn: false,
    round: 0,
  });
  const [round, setRound] = useState(0);
  const [found, setFound] = useState([]);
  const [targets, setTargets] = useState(null);

  const [timerDatabaseId, setTimerID] = useState(null);
  const [userTimeScore, setUserTimeScore] = useState(null);
  ///game animations
  const [openFrame, setOpenFrame] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [foundOne, setFoundOne] = useState(false);

  const [imgWidth, setImgWidth] = useState(0);
  const [X, setX] = useState(0);
  const [Y, setY] = useState(0);
  const [clickY, setClickY] = useState(0);
  const [clickX, setClickX] = useState(0);

  const imgParent = useRef(null);

  useEffect(async () => {
    // console.log(found);
    if (found.length === 3 && round < 2) {
      setFound([]);
      setRound((prev) => prev + 1);
    }

    //alert("gameover");
    //stopTimer(timerDatabaseId);

    if (!targets) {
      let targets = [
        [
          {
            rangeX: [90, 98],
            rangeY: [66, 68],
            name: "predator",
          },
          {
            name: "saw dude",
            rangeX: [66, 72],
            rangeY: [90, 91],
          },
          {
            rangeY: [80, 81],
            rangeX: [7, 13],
            name: "jay and silent bob",
          },
        ],
        [
          {
            name: "bender",
            rangeX: [18, 22],
            rangeY: [80, 85],
          },
          {
            name: "afrosamurai",
            rangeX: [49, 53],
            rangeY: [70, 75],
          },
          {
            name: "mask from spirited away",
            rangeX: [59, 63],
            rangeY: [35, 38],
          },
        ],
      ];
      //  let targets = await getCollection("targets");
      setTargets(targets);
    }
  }, [gameState, isLoading, foundOne]);

  async function getCollection(name) {
    let getCollection = await getDocs(collection(db, name));
    let allDocs = getCollection.docs.map((doc) => {
      return doc.data();
    });
    return allDocs;
  }

  async function startGame() {
    startTimer();
  }
  async function startTimer() {
    let start = Timestamp.now();
    let userRef = await addDoc(collection(db, "myTime"), {
      startTimestamp: start["nanoseconds"],
    });
    setTimerID(userRef._key.path.segments[1]);
  }
  async function stopTimer(id) {
    let start = await (await getDoc(doc(db, "myTime", id))).data()
      .startTimestamp;
    let end = Timestamp.now().nanoseconds;
    setUserTimeScore((end - start) / 1_000_000 / 10);
  }

  function clickAndFind(e) {
    setOpenFrame(true);
    const { width, height } = e.target.getBoundingClientRect();
    const { offsetX, offsetY } = e.nativeEvent;
    const { pageX, pageY } = e;

    // let x = Math.round((offsetX / width) * 100);
    // let y = Math.round((offsetY / height) * 100);
    // console.log(x, y);

  
    setImgWidth(width);

    setX(pageX);
    setY(pageY);

  let nx = Math.round((offsetX / width) * 1000);
    let ny = Math.round((offsetY / height) * 1000);

    setClickX(nx);
    setClickY(ny);



    function calc(nx, ny) {
      return {
        rangeY: [ny - 10, ny + 11],
        rangeX: [nx - 30, nx + 30],
      };
    }

    // if (
    //   nx >= newTarg.rangeX[0] &&
    //   nx <= newTarg.rangeX[1] &&
    //   ny >= newTarg.rangeY[0] &&
    //   ny <= newTarg.rangeY[1]
    // )
    //   console.log("true");
  }

  async function tagPhoto(e) {
    let indx = Number(e.currentTarget.id);
    const eTargetName = e.currentTarget.textContent.toLowerCase();

    const { rangeX, rangeY, name } = targets[round][indx];
    if (
      clickX >= rangeX[0] &&
      clickX <= rangeX[1] &&
      clickY >= rangeY[0] &&
      clickY <= rangeY[1]
    ) {
      if (eTargetName === name) {
        if (!found.includes(name)) {
          // console.log("true");

          setFound((prev) => [...prev, name]);
        } else console.log("wrong");
      }
    }
  }
  const frameStyle = {
    width: (imgWidth / 100) * 10,
    height: (imgWidth / 100) * 10,
  };
  const viewfinderPosition = {
    position: "absolute",
    top: Y - ((imgWidth / 100) * 10) / 2,
    left: X - ((imgWidth / 100) * 10) / 2,
  };
  return (
    <div className="App" ref={imgParent}>
      {targets ? <UI targets={targets[round]} found={found} /> : null}
      <StartGame start={startGame} />
      {userTimeScore ? (
        <Timer
          myTime={userTimeScore}
          resetTime={setUserTimeScore}
          addDoc={addDoc}
          collection={collection}
          db={db}
          getCollection={getCollection}
        />
      ) : null}
      <img src={img1} onClick={clickAndFind}></img>
      {isLoading ? (
        <LoadAnimation position={viewfinderPosition} size={frameStyle} />
      ) : null}
      {openFrame && !isLoading ? (
        <Viewfinder
          imgWidth={imgWidth}
          tagPhoto={tagPhoto}
          setOpenFrame={setOpenFrame}
          targets={targets[round]}
          X={X}
          Y={Y}
        />
      ) : null}
    </div>
  );
}

export default App;

// let targos = [
//   {
//     rangeX: [90, 98],
//     rangeY: [66, 68],
//     name: "predator",
//   },
//   {
//     name: "saw dude",
//     rangeX: [66, 72],
//     rangeY: [90, 91],
//   },
//   {
//     rangeY: [80, 81],
//     rangeX: [7, 13],
//     name: "jay and silent bob",
//   },
// ];

// // async function getTarget(id) {
// //   setIsLoading(true);
// //   let target = await getDoc(doc(db, "targets", id));
// //   setIsLoading(false);
// //   return target.data();
// // }
