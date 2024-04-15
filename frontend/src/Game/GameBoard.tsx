function GameBoard({board,onButtonClick}:{board:string[][],onButtonClick:(x:number,y:number)=>void}){
    return(
        <div className={"gameBoard"}>
            <div className={"center"}>
            {board && board.map((row,rowId)=>{
                return(
                    <div key={rowId} className={"row"}>
                        {row.map((col,colId)=>{
                            return(
                                <button onClick={()=>onButtonClick(rowId,colId)} key={colId} className={"gameButton"}>{col}</button>
                            )
                        })}
                    </div>
                )
            })}
            </div>
        </div>
    )
}
export default GameBoard;