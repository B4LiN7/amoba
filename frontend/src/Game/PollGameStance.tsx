import axios from "axios"
    const PollGameStance = async ()=>{
        const sessionId = sessionStorage.getItem('my-session');
        const val = await axios.get(`http://localhost:5173/game/${sessionId}`).then(res=>{
                console.log(res.data)
                return res.data
            }
        ).catch(err=>{
            console.log(err)
            return err;
        })
        return val
    }
export default PollGameStance;