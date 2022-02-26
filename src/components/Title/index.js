import { useContext } from "react";
import "./title.css";
import { AuthContext } from "../../contexts/auth";
import {Link} from "react-router-dom"; 

export default function Title({children, name}){
    const { user, sair} = useContext(AuthContext);
   
    return(
        <div className="title">
            {children}
            <span>{name}</span>
            {!user ? (
                <Link className="sair" to="/login">
                Login
                </Link>
            ):(

                <button className="sair" onClick={()=>sair()}>
                    Sair
                </button>
            )}
        </div>
    )
}