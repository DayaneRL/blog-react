import { useState } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiUser } from "react-icons/fi";
import firebase from "../../services/firebaseConn";
import { toast } from "react-toastify";

export default function Categoria(){
    const [nome, setNome] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleAdd(e){
        e.preventDefault();
        if(nome!==''){
            setLoading(true);
            await firebase.firestore().collection('categorias')
            .add({
                nome: nome,
            })
            .then(()=>{
                setNome('');
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
                <Title name="Categoria">
                    <FiUser size={25}/>
                </Title>

                <div className="autor">
                    <form  onSubmit={handleAdd}>
                        <label>Nome</label>
                        <input type="text" value={nome} placeholder="Nome da categoria" onChange={(e)=>setNome(e.target.value)}/>
                        
                     
                        <button type="submit">{loading === false ? 'Cadastrar':'Cadastrando...'}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}