
import { FiX } from "react-icons/fi";

export default function ModalExcluir({onYes = ()=>{}, close}){
    return(
        <div className="modal">
            <div className="container">
                <button className="fechar" onClick={ close }>
                    <FiX size={23} color="#FFF"/>
                </button>

                <div className="modal-items">
                    <p style={{marginTop: "1em"}}>Deseja realmente excluir?</p>
                    <button className="aceitar-modal" onClick={onYes}>Sim</button>                    
                </div>
            </div>
        </div>
    )
}