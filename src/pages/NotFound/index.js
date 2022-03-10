import {Link} from "react-router-dom";
export default function PageNotFound(){
    return(
        <div style={{textAlign: "center", margin: "100px"}}>
            <h1 style={{ color: "red"}}>404 <br/>Não encontrado</h1>
            <Link to="/" >Ir para página principal</Link>
        </div>
    )
}