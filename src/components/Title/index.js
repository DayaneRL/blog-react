import { useContext } from "react";
import "./title.css";
import { AuthContext } from "../../contexts/auth";

export default function Title({children, name}){
    const { sair} = useContext(AuthContext);
   
    return(
        <div className="title">
            {children}
            <span>{name}</span>
            <button className="sair" onClick={()=>sair()}>
                Sair
            </button>
        </div>
    )
}