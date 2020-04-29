import React from 'react';

function Cell(props) {
  const getCellColor = (x,y) => {
    let result = props.colors.find(data =>
      data.x === props.x &&
      data.y === props.y
    )
    if(result) return result.color
    else return "#ffffff"
  }

  const handleCellClick = () => {
    props.draw(props.x, props.y)
  }

  return (
    <td
      className={props.x}
      style={{backgroundColor: getCellColor(props.x, props.y)}}
      onClick={handleCellClick}
    >
    </td>
  )
}

export default Cell;
