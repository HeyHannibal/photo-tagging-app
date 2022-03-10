export default function Viewfinder(props) {
  
    const frameStyle = {
        width: (props.imgWidth / 100) * 10,
        height: (props.imgWidth / 100) * 10,
      };
      const viewfinderPosition = {
        position: "absolute",
        top: props.Y - ((props.imgWidth / 100) * 10) / 2,
        left: props.X - ((props.imgWidth / 100) * 10) / 2,
      };
  
  function closeWindow() {
    props.setOpenFrame(false)
  }
  const {targets, tagPhoto} = props
  return (
  <div style={viewfinderPosition} id="viewfinder">
      <div id="frame" style={frameStyle}>
        <div id="frameWindow" onClick={closeWindow}></div>
      </div>
      <ul style={frameStyle}>
        <li>
          <a onClick={tagPhoto} id="0">
            {targets[0].name}
          </a>
        </li>
        <li>
          <a onClick={props.tagPhoto} id="1">
          {targets[1].name}
          </a>
        </li>
        <li>
          <a onClick={props.tagPhoto} id="2">
          {targets[2].name}
          </a>
        </li>
      </ul>
    </div>
  );
}
