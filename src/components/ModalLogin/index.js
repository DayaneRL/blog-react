import {Link} from "react-router-dom";
import { FiX } from "react-icons/fi";

export default function ModalLogin({close}){
    return(
        <div className="modal">
            <div className="container">
                <button className="fechar" onClick={ close }>
                    <FiX size={23} color="#FFF"/>
                </button>

                <div className="modal-items">
                    <p style={{marginTop: "1em"}}>Deseja fazer login?</p>
                    <div>
                        <Link to ="/login" className="btn aceitar-modal" >Sim</Link>          
                        <button className="btn cancelar-modal" onClick={ close }>Cancelar</button>          
                    </div>
                </div>
            </div>
        </div>
    )
}