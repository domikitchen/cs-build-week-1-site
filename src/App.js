import React from 'react';
import logo from './images/bg.png'
import './App.css';
import Button from '@material-ui/core/Button'
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import ClearIcon from '@material-ui/icons/Clear';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

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

const randoBoard = () => {
  const grid = []
  for(let r = 0; r < rows; r++) {
    grid[r] = [];
    for(let c = 0; c < columns; c++) {
      let num = Math.floor(Math.random() * 10)
      if(num >= 8) {
        grid[r][c] = true;
      }
      else {
        grid[r][c] = false;

      }
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
    if(this.state.isGameRunning === true) {
      this.stop();
      this.setState({
        boardCurrent: randoBoard(),
        generation: 0
      });
    }
    else {
      this.setState({
        boardCurrent: randoBoard(),
        generation: 0
      });
    }
  }

  runstopbooton = () => {
    return this.state.isGameRunning ?
    <Button
      className = 'buttons'
      variant = 'outlined'
      onClick = {this.stop}
      startIcon = {<StopIcon />}
    >Stop</Button> :
    <Button
      className = 'buttons'
      variant = 'outlined'
      onClick = {this.run}
      startIcon = {<PlayArrowIcon />}
    >Start</Button>;
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

  rulesHHEKCINGOn() {
    let stupidHECKINGRULES = document.getElementById('Rules')
    stupidHECKINGRULES.classList.remove('toggle')
    stupidHECKINGRULES.classList.add('noToggle')
  }

  rulesHHEKCINGOff() {
    let stupidHECKINGRULES = document.getElementById('Rules')
    stupidHECKINGRULES.classList.remove('noToggle')
    stupidHECKINGRULES.classList.add('toggle')
  }

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
        <div id = "Rules" className = 'toggle'>
          <h1>RULES:</h1>
          <hr/>
          <p>-A living cell must have two or three live neighbors in order to survive</p>
          <p>-A living cell will die if it has either:</p>
          <p><span class = 'tab'></span>&#9725; less than two neighbors</p>
          <p><span class = 'tab'></span>&#9725; four or more neigbors</p>
          <p>-A cell will be born if it's next to exactly three neighbors</p>
          <div className = 'exitButton'>
            <Button
              size = 'small'
              startIcon = {<ExitToAppIcon />}
              color = 'inherit'
              onClick = {this.rulesHHEKCINGOff}
            >close</Button>
          </div>
        </div>
        <a href = 'https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life' target = '_blank'>
          <header className="App-header">
            <img src = {logo} alt = 'The Game of Life' />
          </header>
        </a>
        <section>
          <Board boardCurrent = {boardCurrent} toggleCellCurrent = {this.toggleCell} />
          <div>
            {`Generation: ${generation}`}
          </div>
          <div>
            {this.runstopbooton()}
            <Button
              className = 'buttons'
              variant = 'outlined'
              onClick = {this.next}
              startIcon = {<SkipNextIcon />}
            >Next</Button>
            <Button
              className = 'buttons' 
              variant = 'outlined' 
              onClick = {this.randomize}
              startIcon = {<ShuffleIcon />}
            >Random</Button>
            <Button
              className = 'buttons'
              variant = 'outlined' 
              onClick = {this.clearBoard}
              startIcon = {<ClearIcon />}
            >Reset</Button>
          </div>
            <label>Speed(mb):
              <input
                id = 'numberinput'
                type = 'number'
                value = {this.state.speed}
                onChange = {this.onchanwe}
              />
            </label>
          <hr/>
          <footer>
            <p>The Game of Life is a cellular automation created by John Conway.</p>
            <Button
              endIcon = {<AssignmentLateIcon />}
              onClick = {this.rulesHHEKCINGOn}
            >Rules</Button>
          </footer>
        </section>
      </div>
    );
  };
}

export default App;
