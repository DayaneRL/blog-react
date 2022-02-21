import { useState, useContext } from "react";
import {Link} from 'react-router-dom';
import {AuthContext} from '../../contexts/auth';
import "./login.css";
import logo from '../../assets/React-icon.png';

function Login() {
  const [email,setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const {login, loadingAuth} = useContext(AuthContext);

  function enviar(e){
    e.preventDefault();
    if(email!=='' && senha!==''){
      login(email, senha);
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area col-12 col-md-6">
          <img src={logo} alt="logo" className="spinner"/>
        </div>

        <form onSubmit={enviar} className="col-md-6 col-12">
          <h1>Entrar</h1>
          <input type="text" placeholder="email@email.com" value={email} onChange={(e)=>setEmail(e.target.value)}/>
          <input type="password" placeholder="*****" value={senha} onChange={(e)=>setSenha(e.target.value)}/>
          <button type="submit">{loadingAuth? 'Carregando...':'Acessar'}</button>
          <Link to="/cadastro">Criar uma conta</Link>
        </form>

      </div>
    </div>
  );
}

export default Login;
