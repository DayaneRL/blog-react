import { useContext } from "react";
import "./header.css";
import { AuthContext } from "../../contexts/auth";
import avatar from '../../assets/avatar.png';
import { Link } from "react-router-dom";
import { FiHome, FiUsers, FiMail,FiEdit, FiUser} from "react-icons/fi";

export default function Header(){
    const {user} = useContext(AuthContext);

    return(
        <div className="sidebar">
            <div>
                <img src={user.avatarUrl === null ? avatar : user.avatarUrl} alt="avatar"/>
                <h2>{user.nome? user.nome:'Name'}</h2>
                <p>{user? user.email : 'email@email.com'}</p>
            </div>
            <hr/>

            <Link to="/painel"> <FiHome color="#fff" size={24}/> Home</Link>
            <Link to="/autores"> <FiEdit color="#fff" size={24}/> Novo Autor</Link>
            <Link to="/novoPost"> <FiMail color="#fff" size={24}/> Novo Post</Link>
            <Link to="/meuPerfil"> <FiUser color="#fff" size={24}/> Meu Perfil</Link>
        </div>
    )
}