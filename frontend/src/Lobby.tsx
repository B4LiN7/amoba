import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {useQuery} from "react-query";
import pollGameStance from "./Game/PollGameStance.tsx";

function Lobby() {
    const token = sessionStorage.getItem('my-session');
    const navigate = useNavigate();
    const [inQueue, setInQueue] = useState(false);

    function toggleQueue() {
        setInQueue(!inQueue)
        if (!inQueue){
            getLobby();
        }

    }
    const getLobby = async ()=>{
        return await axios.get("http://localhost:5173/lobby").then(res=>{
            console.log(res);
            sessionStorage.setItem("my-session",res.data.session)
            return res.data;
        }).catch(err=>{
            console.log(err)
        })
    }
    const { data, isLoading, error } = useQuery('dataKey', pollGameStance, {
        refetchInterval: 1000,
        refetchIntervalInBackground:true,
        enabled:inQueue
    });
    /*const getGame = async ()=>{
        return await axios.get(`http://localhost:3000/game/${sessionStorage.getItem('session')}`).then(res=>{
            console.log(res.data);
            return res.data;
        }).catch(err=>{
            console.log(err);
        })
    }*/
    useEffect(() => {
        console.log("most null")
        console.log(data);
        if (data&&data.response?.status !== 400 && token !== null){
            console.log("most nem null")
            setInQueue(false)
            navigate("/play")
        }
    }, [data,navigate]);
    return (
        (inQueue)?
            <div>
                <p>várakozás más játékosokra...</p>
                <button onClick={toggleQueue}>mégse</button><br/>
            </div>
            :
            <div className={"lobby"}>
                <button onClick={toggleQueue}>Játék keresése</button>
            </div>
)
}

export default Lobby;