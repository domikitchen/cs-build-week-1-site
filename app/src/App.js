import React, { useEffect } from 'react';
import './App.css';

const rows = 50;
const columns = 50;

const newBoardRender = () => {
  const grid = []
  for(let r = 0; r < rows; r++) {
    grid[r] = [];
    for(let c = 0; c < columns; c++) {
      grid[r][c] = false;
    }
  }
  return grid;
};

const Board = ({boardCurrent, toggleCellCurrent }) => {
  const clicky = (r,c) => toggleCellCurrent(r,c);

  const tr = []
  for(let r = 0; r < rows; r++) {
    const td = [];
    for(let c = 0; c < columns; c++) {
      td.push(
        <td
          key = {`${r}, ${c}`}
          className = {boardCurrent[r][c] ? 'alive' : 'dead'}
          onClick = {() => clicky(r,c)}
        />
      );
    };
    tr.push(
      <tr key = {r}>{td}</tr>
    );
  };
  return <table><tbody>{tr}</tbody></table>
};

class App extends React.Component {
  state = {
    boardCurrent: newBoardRender(),
    generation: 0,
    isGameRunning: false,
    speed: 100,
    count: 0
  }

  randomize = () => {
    this.clearBoard();
    for(let r = 0; r < rows; r++) {
      for(let c = 0; c < columns; c++) {
        let num = Math.floor(Math.random() * 10)
        if(num >= 8) {
          this.toggleCell(r, c)
        }
      }
    }
  }

  runstopbooton = () => {
    return this.state.isGameRunning ?
    <button type = 'button' onClick = {this.stop}>Stop</button> :
    <button type = 'button' onClick = {this.run}>Start</button>;
  }

  run = () => {
    this.setState({ isGameRunning: true });
  };

  stop = () => {
    this.setState({ isGameRunning: false });
  };

  clearBoard = () => {
    if(this.state.isGameRunning === true) {
      this.stop();
      this.setState({
        boardCurrent: newBoardRender(() => false),
        generation: 0
      });
    }
    else {
      this.setState({
        boardCurrent: newBoardRender(() => false),
        generation: 0
      });
    }
  };

  newBoard = () => {
    this.setState({
      boardCurrent: newBoardRender(),
      generation: 0
    })
  };

  toggleCell = (r, c) => {
    if(this.state.isGameRunning === false) {
      const toggleBoardStatus = prevState => {
        const clonedBoardStatus = JSON.parse(JSON.stringify(prevState.boardCurrent));
        clonedBoardStatus[r][c] = !clonedBoardStatus[r][c];
        return clonedBoardStatus;
      };
  
      this.setState(prevState => ({
        boardCurrent: toggleBoardStatus(prevState)
      }));
    }
  }

  onchanwe = evt => {
    if(this.state.isGameRunning === true) {
      this.stop();
      evt.preventDefault();
      this.setState({ speed: evt.target.value })
    }
    else{
      evt.preventDefault();
      this.setState({ speed: evt.target.value })
    }
  }

  next = () => {
    if(this.state.isGameRunning === true) {
      this.stop();
      this.handleStep();
    }
    else{
      this.handleStep();
    }
  }

  handleStep = () => {
    const nextStep = prevState => {
      const boardCurrent = prevState.boardCurrent;
      const clonedBoardStatus = JSON.parse(JSON.stringify(boardCurrent));

      const amountTrueNeighboars = (r,c) => {
        const neighbors = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
        return neighbors.reduce((trueNeighbors, neighbor) => {
          const x = r + neighbor[0];
          const y = c + neighbor[1];
          const isNeighborOnBoard = (x >= 0 && x < rows && y >= 0 && y < columns);
          if(trueNeighbors < 4 && isNeighborOnBoard && boardCurrent[x][y]) {
            return trueNeighbors + 1
          }
          else {
            return trueNeighbors
          };
        }, 0);
      };

      for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
          const totalTrueNeightbors = amountTrueNeighboars(r,c);

          if(!boardCurrent[r][c]) {
            if(totalTrueNeightbors === 3) clonedBoardStatus[r][c] = true;
          }
          else {
            if(totalTrueNeightbors < 2 || totalTrueNeightbors > 3) clonedBoardStatus[r][c] = false;
          };
        };
      };
      return clonedBoardStatus;
    };
    this.setState(prevState => ({
      boardCurrent: nextStep(prevState),
      generation: prevState.generation + 1
    }));
  };

  componentDidUpdate(prevProps, prevState) {
    const { isGameRunning, speed } = this.state;
    const gameStarted = !prevState.isGameRunning && isGameRunning;
    const gameStopped = prevState.isGameRunning && !isGameRunning;

    if(gameStopped) {
      clearInterval(this.timerID);
      this.setState({count: 0})
    }
    if(gameStarted) {
        this.timerID = setInterval(() => {
          this.handleStep();
          this.setState({count: this.state.count+1})
          if(this.state.count >= 100) {
            this.stop();
          }
        }, speed)
    }
  }

  render() {
    const { boardCurrent, isGameRunning, generation, speed } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1>The Game of Life</h1>
        </header>
        <section>
          <Board boardCurrent = {boardCurrent} toggleCellCurrent = {this.toggleCell} />
          <div>
            {`Generation: ${generation}`}
          </div>
          {this.runstopbooton()}
          <button onClick = {this.next}>Next</button>
          <button onClick = {this.randomize}>Random</button>
          <button onClick = {this.clearBoard}>Reset</button>
          <br/>
            <label>Speed(mb):
              <input
                id = 'numberinput'
                type = 'number'
                value = {this.state.speed}
                onChange = {this.onchanwe}
              />
            </label>
        </section>
        <br/>
      </div>
    );
  };
}

export default App;
