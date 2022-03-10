import { useRef, useState, useEffect } from "react";

// firebase
import { initializeApp } from "firebase/app";
import { getDoc, getFirestore } from "firebase/firestore";
import {
  collection,
  doc,
  addDoc,
  getDocs,
} from "firebase/firestore";

// components
import img1 from "./assets/5.jpg";
import StartGame from "./components/startSreen";
import UI from "./components/ui";
import Viewfinder from "./components/viewfinder";
import LoadAnimation from "./components/animations";
import Timer from "./components/timer";


// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAeIFD5PXQCHqo-AD45_GLzp5yRsJ403dA",
  authDomain: "phototagging-47506.firebaseapp.com",
  projectId: "phototagging-47506",
  storageBucket: "phototagging-47506.appspot.com",
  messagingSenderId: "196085090300",
  appId: "1:196085090300:web:78eeebade8eee855a09479",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  
  async function getCollection(name) {
    let getCollection = await getDocs(collection(db, name));
    let allDocs = getCollection.docs.map((doc) => {
      return doc.data();
    });
    return allDocs;
  }
 async function startStopTimer(id, end) {
    if (arguments.length === 0) {
    let userRef = await addDoc(collection(db, "myTime"), {
        startTimestamp: new Date().getTime(),
      });
      setTimerID(userRef._key.path.segments[1]);
    } 
     else {
      let start = await (await getDoc(doc(db, "myTime", id))).data()
        .startTimestamp;
      setUserTimeScore((end - start) / 1000);
  }}
  
  const [round, setRound] = useState(0);
  const [found, setFound] = useState([]);
  const [targets, setTargets] = useState(null);
  const [timerDatabaseId, setTimerID] = useState(null);
  const [userTimeScore, setUserTimeScore] = useState(null);
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
    if (found.length === 3) {
      if (round < targets.length - 1) {
        setFound([]);
        setRound((prev) => prev + 1);
      } else {
        let end = new Date().getTime();

        console.log("over");
        startStopTimer(timerDatabaseId, end);
      }
    }

    if (!targets) {
      const getTargets = await getCollection("targets");
      const targets = Object.values(getTargets[0].targets);

      const getRange = (x, y) => {
        return { rangeY: [y - 10, y + 11], rangeX: [x - 30, x + 30] };
      };
      for (const arr of targets) {
        arr.map((item) =>
          Object.assign(item, getRange(item.coords[0], item.coords[1]))
        );
      }
      console.log(targets)
      setTargets(targets);
    }
  }, [isLoading, found, round]);

  function clickAndFind(e) {
    setOpenFrame(true);
    const { width, height } = e.target.getBoundingClientRect();
    const { offsetX, offsetY } = e.nativeEvent;
    const { pageX, pageY } = e;
    setImgWidth(width);
    setX(pageX);
    setY(pageY);
    let x = Math.round((offsetX / width) * 1000);
    let y = Math.round((offsetY / height) * 1000);
    setClickX(x);
    setClickY(y);
    (function allc(x, y) {
      console.log([x, y]);
    })(x, y);
    console.log(timerDatabaseId);
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
          console.log("true");

          setFound((prev) => [...prev, name]);
        } else console.log("wrong");
      }
    }
  }

  function complete() {
    let allTargos = targets[round].map((item) => {
      return item.name;
    });
    setFound(allTargos);
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
      {targets ? (
        <UI targets={targets[round]} found={found} finish={complete} />
      ) : null}
      <StartGame start={startStopTimer} />
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
