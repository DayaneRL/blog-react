import { useState, useContext } from "react";
import logo from '../../assets/React-icon.png';
import {Link} from 'react-router-dom';
import {AuthContext} from '../../contexts/auth';

function Cadastro() {
  const [email,setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');

  const {cadastro,loadingAuth} = useContext(AuthContext);

  function enviar(e){
    e.preventDefault();
    
    if(nome !== '' && email !=='' && senha !== ''){
        cadastro(email, senha, nome);
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area col-12 col-md-6 cad">
          <img src={logo} alt="logo" className="spinner"/>
        </div>

        <form onSubmit={enviar} className="col-12 col-md-6">
          <h1>Cadastrar</h1>
          <input type="text" placeholder="Nome" value={nome} onChange={(e)=>setNome(e.target.value)}/>
          <input type="text" placeholder="email@email.com" value={email} onChange={(e)=>setEmail(e.target.value)}/>
          <input type="password" placeholder="*****" value={senha} onChange={(e)=>setSenha(e.target.value)}/>
          <button type="submit">{loadingAuth? 'Carregando...':'Cadastrar'}</button>
          <Link to="/">Já tem uma conta? Logar</Link>
        </form>

      </div>
    </div>
  );
}

export default Cadastro;

  