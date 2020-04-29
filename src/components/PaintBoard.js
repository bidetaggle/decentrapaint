import React from 'react';
import Cell from './Cell'
import config from './../config'

function PaintBoard(props) {

  const cellsLine = (y, colorPositions) => {
    let cells = []
    for(let i=0; i<config.WIDTH; i++)
      cells.push(
        <Cell
          key={i}
          colors={colorPositions}
          x={i}
          y={y}
          draw={props.onDraw}
          drawColor={props.color}
        />
      )
    return cells
  }

  let rows = [];
  for(let j=0; j<config.HEIGHT; j++){
    rows.push(
      <tr className={j} key={j}>
        {cellsLine(j, props.colorPositions)}
      </tr>
    )
  }

  return (
    <table>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}

export default PaintBoard;
