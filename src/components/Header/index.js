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
                <img src={user === null ? avatar : user.avatarUrl} alt="avatar"/>
                {!user?( 
                    <Link to="/login"> Login </Link>
                ):(<></>)}
                <h2>{user? user.nome:''}</h2>
                <p>{user? user.email : ''}</p>
            </div>
            <hr/>

            <Link to="/painel"> <FiHome color="#fff" size={24}/> Home</Link>
            <Link to="/autores"> <FiEdit color="#fff" size={24}/> Autor</Link>
            <Link to="/novoPost"> <FiMail color="#fff" size={24}/> Post</Link>
            {user?( 
            <Link to="/perfil"> <FiUser color="#fff" size={24}/> Meu Perfil</Link>
            ):(<></>)}
        </div>
    )
}