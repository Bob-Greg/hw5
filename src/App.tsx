import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {TextBox} from "./text-box";

function App() {

    const [numDice, setNumDice] = useState(0)
    const [numErr, setNumErr] = useState(false)
    const [targetVal, setTargetVal] = useState(0)
    const [targetErr, setTargetErr] = useState(false)
    const [diceRolls, setDiceRolls] = useState(0)
    const [diceErr, setDiceErr] = useState(false)
    const [prob, setProb] = useState(0.0)

    function updateDiceProb(numDice:number, numErr:boolean, targetVal:number, targetErr:boolean, diceRolls:number, diceErr:boolean, prob:number) {
        if (diceErr || numErr || targetErr) {
            setProb(0)
            return
        }
        let mult: number[] = []
        let mult1: number[] = []
        mult[0] = mult1[0] = 1
        for (let i = 1; i <= targetVal; i++) {
            mult.push(0)
            mult1.push(0)
        }

        function swap() {
            let tmp = [...mult];
            mult = mult1;
            mult1 = tmp;
        }

        for (let i = 0; i < numDice; i++) {
            for (let j = 0; j <= targetVal; j++) {
                mult1[j] = 0;
                for (let k = 1; k <= 6; k++) {
                    mult1[j] += j - k > -1 ? mult[j - k] : 0
                }
            }
            swap()
        }
        setProb((mult[targetVal] / Math.pow(6, numDice)) * diceRolls)
    }

    return (
        <div className={"mt-6 mb-6 ml-6 mr-6 pt-6 grid grid-cols-1 content-start space w-full-margin h-full-margin fixed place-items-center new-box-aqua"}>
            <div className={"new-text-aqua text-4xl pb-1"}>
                Dice Roll Simulator
            </div>
            <a href={"https://www.github.com/Bob-Greg/hw5"}>
                <div className={"new-text-aqua text-xl pb-7"}>
                    https://www.github.com/Bob-Greg/hw5
                </div>
            </a>
            <TextBox defaultText={"Number of dice to roll"} customCss={"bg-gray-200 rounded-xl pl-1 new-button-aqua"} onChange={str => {
                if (isNaN(parseInt(str)) || parseInt(str) === 0) {
                    setNumErr(true)
                    updateDiceProb(0, true, 0, true, 0, true, prob)
                    return
                }
                setNumDice(parseInt(str))
                setNumErr(false)
                updateDiceProb(parseInt(str), false, targetVal, targetErr, diceRolls, diceErr, prob)
            }}/>
            <div className={"pb-3"}>
                { numErr &&
                    <div>^^^ Please enter a valid number of dice to roll! ^^^</div>
                }
            </div>
            <TextBox defaultText={"Target value"} customCss={"bg-gray-200 rounded-xl pl-1 new-button-aqua"} onChange={str => {
                if (isNaN(parseInt(str)) || parseInt(str) === 0) {
                    setTargetErr(true)
                    updateDiceProb(0, true, 0, true, 0, true, prob)
                    return
                }
                setTargetVal(parseInt(str))
                setTargetErr(false)
                updateDiceProb(numDice, numErr, parseInt(str), false, diceRolls, diceErr, prob)
            }}/>
            <div className={"pb-3"}>
                { targetErr &&
                    <div>
                        ^^^ Please enter a valid target value! ^^^
                    </div>
                }
            </div>
            <TextBox defaultText={"Number of times to roll"} customCss={"bg-gray-200 rounded-xl pl-1 new-button-aqua"} onChange={str => {
                if (isNaN(parseInt(str)) || parseInt(str) === 0) {
                    setDiceErr(true)
                    updateDiceProb(0, true, 0, true, 0, true, prob)
                    return
                }
                setDiceRolls(parseInt(str))
                setDiceErr(false)
                updateDiceProb(numDice, numErr, targetVal, targetErr, parseInt(str), false, prob)
            }}/>
            <div className={"pb-3"}>
                { diceErr &&
                    <div>
                        ^^^ Please enter a valid number of dice to roll! ^^^
                    </div>
                }
            </div>
            <div className={"new-text-aqua text-xl"}>{ prob === 0 ? "NaN" : `~${Math.floor(prob * 100)}/100 (${prob})` }</div>
        </div>
    );
}

export default App;
