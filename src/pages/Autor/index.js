import { useState } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiUser } from "react-icons/fi";
import firebase from "../../services/firebaseConn";
import { toast } from "react-toastify";
import './autor.css';

export default function Autor(){
    const [nome, setNome] = useState('');
    const [genero, setGenero] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleAdd(e){
        e.preventDefault();
        if(nome!=='' && genero !== '' && email!==''){
            setLoading(true);
            await firebase.firestore().collection('autores')
            .add({
                nome: nome,
                genero: genero,
                email: email
            })
            .then(()=>{
                setNome('');
                setGenero('');
                setEmail('');
                toast.success('Cadastrado com sucesso!');
                setLoading(false);
            })
            .catch((error)=>{
                console.log(error);
                toast.error('Houve algum erro.');
                setLoading(false);
            })
        }else{
            toast.error('Por favor, preencha todos os campos');
        }
    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title name="Autor">
                    <FiUser size={25}/>
                </Title>

                <div className="autor">
                    <form className="form-profile costumers" onSubmit={handleAdd}>
                        <label>Nome</label>
                        <input type="text" value={nome} placeholder="Nome do(a) autor(a)" onChange={(e)=>setNome(e.target.value)}/>
                        
                        <label>Gênero</label>
                        <input type="text" value={genero} placeholder="Romance, Ficção, etc" onChange={(e)=>setGenero(e.target.value)}/>
                        
                        <label>Email para contato</label>
                        <input type="email" value={email} placeholder="email@email.com" onChange={(e)=>setEmail(e.target.value)}/>

                        <button type="submit">{loading === false ? 'Cadastrar':'Cadastrando...'}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}