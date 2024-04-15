import GameBoard from "./GameBoard.tsx";
import './game.css'
import {useQuery} from "react-query";
import PollGameStance from "./PollGameStance.tsx";
import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function Game(){
    const navigate = useNavigate()
    const [isTheGameGoing,setIsTheGameGoing] = useState(true);
    const [errorMessage,setErrorMessage] = useState<string|undefined>(undefined)
    const [gameBoard,setGameBoard] = useState<string[][]>([[]])
    const { data, isLoading, error } = useQuery('dataKey', PollGameStance, {
        refetchInterval: 500,
        refetchIntervalInBackground:false,
        refetchOnWindowFocus:true,
        enabled: isTheGameGoing
    });
    useEffect ( () => {
        setGameBoard(data?.state)
    }, [data] );
    if (data?.winner && isTheGameGoing){
        setIsTheGameGoing(!data?.winner)
    }
    const callingThis = async (x:number,y:number)=>{
        const sessionId = sessionStorage.getItem('my-session');
        const val = await axios.post(`http://localhost:5173/game/${sessionId}/play`,
            {
                x:x,
                y:y,
            }).then(res=>{
                console.log(res.data)
                return res.data
            }
        ).catch(err=>{
            console.log(err)
            return err;
        })
        return val
    }
    const onButtonClick = async (x:number,y:number)=>{
        const res = await callingThis(x,y)
       if(res&& res.response? res.response.status === 400:false){
            console.log(res.response.data.message)
           alert(res.response.data.message)
       }
    }
    const returnToLobby = ()=>{
        console.log("btn-click")
        sessionStorage.removeItem('my-session');
        navigate("/")
    }
    return(
         <>
             {data && data.winner?
             <div className={"winnerScreen"}>
                 <p>{data.winner === "DRAW"? "It's a draw!": data.winner+" won!"}</p>
                 <button onClick={returnToLobby}>Return to lobby</button>
             </div>
             : ""
             }
             A te szimbólumod: {data &&data.yourSymbol}
            <GameBoard onButtonClick={onButtonClick} board={gameBoard}/>
         </>
    )
}
export default Game;