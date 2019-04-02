import React from 'react';
import './game.css';

const createArray = function (length, filler) {
    return new Array(length).fill(filler);
}

const generateBoard = function (rows, columns) {
    return createArray(rows, rows).map((x) => createArray(columns, 0));
}

const newGeneration = function (board) {
    let newBoard = board.map((row, rowNo) =>
        row.map((stateOfElement, columnNo) => {
            let noOfAlives = findNeighboursState(rowNo, columnNo, board);
            return nextStateOfCell(noOfAlives, stateOfElement);
        }));
    return newBoard;
}

const sum = (a, b) => a + b;

const findNeighboursState = function (row, column, board) {
    let mainrow = board[row]
    let leftrow = board[row - 1] || [];
    let rightrow = board[row + 1] || [];
    let cells = [mainrow[column - 1], mainrow[column + 1]]
    cells.push(leftrow[column])
    cells.push(leftrow[column + 1], leftrow[column - 1])
    cells.push(rightrow[column], rightrow[column + 1], rightrow[column - 1])
    cells = cells.filter((x) => x !== undefined)
    return cells.reduce(sum, 0);
}


const nextStateOfCell = function (totalAliveNeighbours, currentStateoOfCell) {
    let result = [0, 0, currentStateoOfCell, 1, 0, 0, 0, 0, 0]
    return result[totalAliveNeighbours];
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        const board = generateBoard(10, 10);
        this.state = { board }
        this.isStarted = false;
    }

    generateBoard() {
        return this.state.board.map((row, rowId) => {
            const columns = row.map((col, colId) => {
                let className = "alive"
                if (col === 0) {
                    className = "dead"
                }
                const id = rowId + "_" + colId
                return (<td id={id} className={className}></td>)
            });
            return (<tr>{columns}</tr>)
        })
    }

    handleClick(e) {
        const [rowId, colId] = e.target.id.split("_");
        const board = this.state.board.slice();
        board[rowId][colId] = 1 - board[rowId][colId];

        this.setState({board});
    }

    start() {
        this.isStarted = true;
        this.timerId = setInterval(() => {
        const board = newGeneration(this.state.board);
        this.setState({board})
        },100)
    }

    stopInterval(){
        this.isStarted= false;
        clearInterval(this.timerId);
    }

    stop(){
        this.stopInterval();
        this.setState(state => state);
    }

    reset(){
        this.stop();
        this.setState({
            board:generateBoard(10,10)
        })
    }

    canClickOnBoard(){
        return this.state.board.every(row => row.every(col => col === 0));
    }

    render() {
        let onclick = null;
        let canClick = this.canClickOnBoard();
        if (!this.isStarted || canClick) {
            this.stopInterval();
            onclick = this.handleClick.bind(this);
        }
        return (
            <div>
                <div className="heading">Game of Life</div>
                <table onClick={onclick} className="table">{this.generateBoard()}</table>
                <div className="options">
                    <button onClick={this.start.bind(this)}>Start</button>
                    <button onClick={this.stop.bind(this)}>Stop</button>
                    <button onClick={this.reset.bind(this)}>Reset</button>
                </div>

            </div>
        );
    }
}

export default Game;