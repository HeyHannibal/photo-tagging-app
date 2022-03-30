export default function LoadAnimation(props) {
  return (
    <div style={props.position} id="animationContainer">
      <div className="lds-ring" style={props.size}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p id="check">Checking Target</p>
    </div>
  );
}
