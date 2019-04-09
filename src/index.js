import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

var checkSuccess = function (arr) {
    var win = [
        [0, 4, 8],
        [2, 4, 6],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
    ]
    for (var i = 0; i < win.length; i++) {
        var [a, b, c] = win[i]
        if (arr[a] === arr[b] && arr[b] === arr[c] && arr[a] !== null) {
            return win[i]
        }
    }
    return false
}

class Box extends React.Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div className="box"
                onClick={
                    () => this.props.handleClick(this.props.index)
                }
                style={this.props.isHightLight ? { color: "red" } : {}}
            >
                {this.props.char}
            </div>
        )
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props)
    }
    getBox(i) {
        var isHightLight = false
        if (this.props.hilight) {
            var find = this.props.hilight.find((v) => v === i)
            if (find !== undefined) isHightLight = true
        }
        return <Box
            index={i}
            isHightLight={isHightLight}
            char={this.props.arr[i]}
            handleClick={
                (index) => this.props.handleClick(index)
            }
        />
    }
    render() {
        return (
            <div>
                <div>
                    {this.getBox(0)}
                    {this.getBox(1)}
                    {this.getBox(2)}
                </div>
                <div>
                    {this.getBox(3)}
                    {this.getBox(4)}
                    {this.getBox(5)}
                </div>
                <div>
                    {this.getBox(6)}
                    {this.getBox(7)}
                    {this.getBox(8)}
                </div>
            </div>
        )
    }
}

class Game extends React.Component {
    constructor() {
        super()
        this.state = {
            xIsNext: true,
            step: 0,
            history: [Array(9).fill(null)],
            positiveOrder: true
        }
    }
    handleClick(i) {
        var { step, history, xIsNext } = this.state
        var current = history[step].slice()
        history = history.slice(0, step + 1)
        if (checkSuccess(current) || current[i]) {
            return
        }
        current[i] = xIsNext ? 'X' : 'O'
        this.setState(
            {
                xIsNext: !xIsNext,
                history: history.concat([current]),
                step: history.length
            }
        )
    }
    jump(historyIndex) {
        this.setState({
            step: historyIndex,
            xIsNext: historyIndex % 2 === 0
        })
    }
    reverseOrder() {
        this.setState({
            positiveOrder: !this.state.positiveOrder
        })
    }
    render() {
        var { history, step } = this.state
        var arr = history[step]
        var winner = checkSuccess(arr)
        var status

        if (winner) {
            status = `winner is ${history[step][winner[0]]}`
        } else {
            status = "Next player is " + (this.state.xIsNext ? "X" : "O")
        }

        var moves = history.map((v, i) => {
            if (this.state.positiveOrder) {

            } else {
                i = history.length - 1 - i
            }

            return (
                <li key={v}>
                    <button
                        type="button"
                        onClick={() => this.jump(i)}>

                        {
                            i === 0 ?
                                (i === step ? <strong>gamestart</strong> : "game start")
                                : (i === step ? <strong>is looking #{i}</strong> : `back to # ${i}`)
                        }

                    </button>
                </li>
            )
        })

        return (
            <div className="game">
                <div className="board">
                    <Board hilight={winner} arr={arr} handleClick={(index) => this.handleClick(index)} />
                </div>
                <div className="history">
                    <p>{status}</p>
                    <p>
                        <button type="button" onClick={() => this.reverseOrder()}>
                            order step {this.state.positiveOrder ? "⬆" : "⬇"}
                        </button>
                    </p>
                    <hr />
                    <ul>
                        {moves}
                    </ul>
                </div>
            </div>
        )
    }
}


ReactDOM.render(<Game />, document.getElementById('root'));
registerServiceWorker();
