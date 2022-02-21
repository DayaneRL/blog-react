import "./modal.css";
import { FiX } from "react-icons/fi";

export default function Modal({item, close}){
    return(
        <div className="modal">
            <div className="container">
                <button className="fechar" onClick={ close }>
                    <FiX size={23} color="#FFF"/>
                </button>

                <div>
                    <h2>Post</h2>

                    <div className="row">
                        <span>Autor: <i>{item.autor}</i></span>
                    </div>

                    <div className="row">
                        <span>Assunto: <i>{item.titulo}</i></span>
                        <span>Cadastrado: <i>{item.createdFormated}</i></span>
                    </div>

                    <div className="row">
                        <span>Categoria: <i>{item.categoria}</i></span>
                    </div>

                    <div className="row">
                        <span>Conteudo: <i>{item.conteudo}</i></span>
                    </div>
                </div>
            </div>
        </div>
    )
}