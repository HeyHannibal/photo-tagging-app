import { useState, useEffect } from "react";

export default function Leaderboard(props) {
  const [board, setBoard] = useState(null);
  useEffect(async () => {
    if (!board) {
      let getBoard = await getLeaderboard();
      getBoard.sort((a, b) => a.score - b.score);
      setBoard(getBoard);
    }
  });

  async function getLeaderboard() {
    let leaderboard = await props.getCollection("leaderboard");
    return leaderboard;
  }
  return (
    <div id="leaderboard" className="popUp">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Time</th>
          </tr>
        </thead>
        {board ? (
          <tbody>
            {board.map((entry) => (
              <tr>
                <td>{entry.name}</td>
                <td>{entry.score}s</td>
              </tr>
            ))}
          </tbody>
        ) : null}
      </table>
    </div>
  );
}
