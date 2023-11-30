import React, {MouseEvent, useEffect, useState} from 'react';
import './Tiles.css';

interface Props{
  rowCount: number;
  colCount: number;
}


export default function Tiles(props: Props) {
  const [startIndex, setStartIndex] = useState({row: 0, col: 0});
  const [endIndex, setEndIndex] = useState({row: 0, col: 0})
  const [currentIndex, setCurrentIndex] = useState({row: 0, col: 0});
  const [touched, setTouched] = useState([{}]);
  const [bombs, setBombs] = useState([{row: 0, col: 0}]);
  const [gameOver, setGameOver] = useState(false);
  const [clearedRound, setClearedRound] = useState(false);

  useEffect(() => {
      const getRandomNumber = () => { return Math.floor((Math.random() * (props.rowCount - 1)) + 1) }

      const setIndexRow = getRandomNumber();
      const setIndexCol = getRandomNumber();

      setStartIndex({row: setIndexRow, col: setIndexCol});
      setCurrentIndex({row: setIndexRow, col: setIndexCol});

      const setEndIndexRow = getRandomNumber();
      const setEndIndexCol = getRandomNumber();

      setEndIndex({row: setEndIndexRow, col: setEndIndexCol});
      for (let i=0; i<3; i++){
        
        let setBombRow = getRandomNumber();
        let setBombCol = getRandomNumber();
        if ((setIndexRow === setBombRow && setIndexCol === setBombCol) || (setEndIndexRow === setBombRow && setEndIndexCol === setBombCol)){
          setBombRow = getRandomNumber();
          setBombCol = getRandomNumber();
        }

        setBombs([{row: setBombRow, col: setBombCol}]);
      }
  }, [setStartIndex, setCurrentIndex, setEndIndex, setBombs, props.rowCount])

  const isValidPos = (row: number, col: number) => {
    if (row < 0 || col < 0 || row > (props.rowCount - 1) || col > (props.colCount - 1))
      return 0;
    return 1;
  }
  
  const getPossibleWays = (row: number, col: number) => {
    // Initialising a vector array
           // where adjacent element will be stored
           let v = [];
 
           // Checking for all the possible adjacent positions
          
          if (isValidPos(row, (col - 1)))
            v.push([(row ),(col - 1)]);
          
          if (isValidPos(row, (col + 1)))
            v.push([(row),(col + 1)]);
          
          if (isValidPos((row + 1), col))
            v.push([(row + 1),(col)]);
          
          if (isValidPos((row - 1), col))
            v.push([(row - 1),(col)]);
          
           // Returning the vector
           return v;
  }

  const handleMouseOver = (event: MouseEvent) => {
    if (gameOver){
      return;
    }

    if (event.currentTarget.className.split(" ").indexOf("touched-tile") < 0){
      const possibleWays = getPossibleWays(currentIndex.row, currentIndex.col);
      
      const row = event.currentTarget.parentElement?.id ? parseInt( event.currentTarget.parentElement?.id) : -1;
      const col = event.currentTarget.id ? parseInt(event.currentTarget.id) : -1;


      const isValidPath = possibleWays.filter((v, i) => v[0] === row && v[1] === col);

      if (!isValidPath.length){
        return;
      }

      const isBombPresent = bombs.filter((bomb, i) => bomb.row === row && bomb.col === col)

      if (isBombPresent.length){
        event.currentTarget.className = event.currentTarget.className.trim() + " bomb"
        setGameOver(true);
        return;
      }

      const isReachedToEnd = (endIndex.row === row && endIndex.col === col);
      if (isReachedToEnd){
        setClearedRound(true);
      }
      
      setTouched([...touched, {row: row, col: col}])
      setCurrentIndex({row: row, col: col})
      event.currentTarget.className = event.currentTarget.className.trim() + " touched-tile"
    }
  }

  return (
    <>
    {gameOver? <h1> Game Over </h1> : null}
    {clearedRound? <h1> Cleared Round </h1> : null}
    {
        [...Array(props.rowCount)].map((e, i) => {
          return <div key={i} id={""+i} className="row">
            {[...Array(props.colCount)].map((_e, _i) => {
              return <div onMouseEnter={handleMouseOver} key={_i} id={""+_i} className={"col-md-1 tile" + (((startIndex.row === i && startIndex.col === _i) || (endIndex.row === i && endIndex.col === _i))? ' active': '')}>
                {(startIndex.row === i && startIndex.col === _i)? "START" : ''}
                {(endIndex.row === i && endIndex.col === _i)? "END" : ''}
              </div>
            })}
          </div>
        })
    }
    </>
  )
}
