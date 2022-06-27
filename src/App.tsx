import React, {useState} from 'react';
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
    const [probStr, setProbStr] = useState("")
    const [state, setState] = useState("")

    function updateDiceProb(numDice:number, numErr:boolean, targetVal:number, targetErr:boolean, diceRolls:number, diceErr:boolean, prob:number) {
        if (diceErr || numErr || targetErr) {
            setProb(0)
            setState("")
            return
        }

        if (diceRolls < 100000) {
            let count = 0
            let rand = Math.floor(Math.random() * 12) + 1
            for (let i = 0; i < diceRolls; i++) {
                let sum = 0
                for (let j = 0; j < numDice; j++) {
                    // use xorshift to generate a random number
                    rand ^= rand << 13;
                    rand ^= rand >> 7;
                    rand ^= rand << 17;
                    rand = Math.abs(rand)
                    sum += rand % 6 + 1
                }
                if (sum === targetVal) {
                    count++
                }
            }

            setProb(count / diceRolls * 100)
            setProbStr("")
            setState("Simulated")
            return;
        }

        // I MISUNDERSTOOD THE PROBLEM AND DID THE ACTUAL CALCULATION AAAAAAAAAAAAAAAAAAH but it's a faster solution so we use it for big numbers

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
        let prob1 = Math.min(1.0, Math.floor(mult[targetVal] / Math.pow(6, numDice) * 1000000) / 1000000) * 100
        if (prob1 < 1) {
            setProbStr(`${mult[targetVal]}/${Math.pow(6, numDice)}`)
            setProb(prob1)
            setState("Calculated")
            return
        }
        setProbStr("")
        setProb(prob1)
        setState("Calculated")
    }

    return (
        <div className={
            "mt-6 mb-6 ml-6 mr-6 pt-6 " +
            "grid grid-cols-1 content-start space place-items-center " +
            "w-full-margin h-full-margin fixed " +
            "new-box-aqua " +
            "overflow-auto"
        }>
            <div className={"new-text-aqua text-4xl pb-2"}>
                Rolling Dice
            </div>
            <a href={"https://www.github.com/Bob-Greg/hw5"}>
                <div className={"new-text-aqua sm:text-sm md:text-xl pb-7"}>
                    https://github.com/Bob-Greg/hw5
                </div>
            </a>
            <div className={"new-text-aqua text-xl text-center pb-1"}># of dice to roll</div>
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
            <div className={"pb-3 pt-2 new-text-aqua text-xs"}>
                { numErr &&
                    <div>^^^ Please enter a valid number of dice to roll! ^^^</div>
                }
            </div>
            <div className={"new-text-aqua text-xl text-center pb-1"}>Target value</div>
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
            <div className={"pb-3 pt-2 new-text-aqua text-xs"}>
                { targetErr &&
                    <div>
                        ^^^ Please enter a valid target value! ^^^
                    </div>
                }
            </div>
            <div className={"new-text-aqua text-xl text-center pb-1"}># of times to roll</div>
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
            <div className={"pb-4 pt-2 new-text-aqua text-xs"}>
                { diceErr &&
                    <div>
                        ^^^ Please enter a valid number of times to roll! ^^^
                    </div>
                }
            </div>
            <div className={"pb-1"}>
                { probStr === "" &&
                    <div className={"new-text-aqua text-xl"}>
                        { prob === 0 ? "None found" : `~${Math.floor(prob)}/100 (${Math.floor(prob * 10000) / 10000}%)` }
                    </div>
                }
                { probStr !== "" &&
                    <div className={"new-text-aqua text-xl"}>
                        { `${probStr} (${Math.floor(prob * 10000) / 10000}%)` }
                    </div>
                }
            </div>
            <div className={"new-text-aqua text-md"}>
                { state }
            </div>
        </div>
    );
}

export default App;
