import Tiles from "../Tiles/Tiles";

export default function GameBoard() {

  return (
    <div className="container">
      <Tiles rowCount={6} colCount={6}/>
      <button className="btn btn-danger" onClick={() => window.location.reload()}>Restart the game</button>
    </div>
  );
}
