import img1 from "./assets/5.jpg";
import { useRef, useState, useEffect } from "react";


function App() {
  const [gameState, setGameState] = useState({
    found: [],
    isOver: false,
  });

  const [imgWi, setImgWi] = useState(0);
  const [imgHi, setImgHi] = useState(0);
  const targets = [
    {
      name: "predator",
      rangeX: [90, 98],
      rangeY: [66, 68],
    },
    {
      name: "saw dude",
      rangeX: [66, 72],
      rangeY: [90, 91],
    },
    {
      name: "jay and silent bob",
      rangeX: [7, 13],
      rangeY: [80, 81],
    },
  ];

  const [X, setX] = useState(0);
  const [Y, setY] = useState(0);

  const [openFrame, setOpenFrame] = useState(false);

  const [userClickY, setUserClickY] = useState(0);
  const [userClickX, setUserClickX] = useState(0);

  const imgParent = useRef(null);

  useEffect(() => {
    if (gameState.found.length === 3) {
      setGameState({
        found: [],
        isOver: true,
      });
      alert("gameover");
    }
  }, [gameState]);

  const frameStyle = {
    width: (imgWi / 100) * 10,
    height: (imgWi / 100) * 10,
  };
  const viewfinderStyle = {
    position: "absolute",
    top: Y - ((imgWi / 100) * 10) / 2,
    left: X - ((imgWi / 100) * 10) / 2,
  };
  function clickAndFind(e) {
    setOpenFrame(true);
    const { width, height } = e.target.getBoundingClientRect();
    const { offsetX, offsetY } = e.nativeEvent;
    const { pageX, pageY } = e;

    let x = Math.round((offsetX / width) * 100);
    let y = Math.round((offsetY / height) * 100);

    setImgWi(width);
    setImgHi(height);
    setX(pageX);
    setY(pageY);
    setUserClickX(x);
    setUserClickY(y);

    console.log(gameState);
  }

  function ifOpen() {
    setOpenFrame(false);
  }

  function tagPhoto(e) {
    let indx = Number(e.currentTarget.id);

      if (e.currentTarget.textContent.toLowerCase() === targets[indx]["name"]) {
        alert("You found one! good job!");
        let newFound = [...gameState["found"]];
        newFound.push(targets[indx]["name"]);
        setGameState((prev) => ({
          isOver: prev.isOver,
          found: newFound,
        }));
      }
    }
  

  return (
    <div className="App" ref={imgParent}>
      <img src={img1} onClick={clickAndFind}></img>
      {openFrame ? (
        <div style={viewfinderStyle} id="viewfinder">
          <div id="frame" style={frameStyle}>
            <div id="frameWindow" onClick={ifOpen}></div>
          </div>
          <ul>
            <li>
              <a onClick={tagPhoto} id="0">
                Predator
              </a>
            </li>
            <li>
              <a onClick={tagPhoto} id="1">
                Saw Dude
              </a>
            </li>
            <li>
              <a onClick={tagPhoto} id="2">
                Jay And Silent Bob
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default App;
