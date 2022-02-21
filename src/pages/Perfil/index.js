import { useState, useContext } from "react";
import "./perfil.css";
import Header from "../../components/Header";
import Title from "../../components/Title";
import avatar from '../../assets/avatar.png';
import firebase from '../../services/firebaseConn';
import { AuthContext } from "../../contexts/auth";
import { FiSettings, FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";

export default function Perfil(){
    const {user, setUser, storageUser, sair,loadingAuth} = useContext(AuthContext);
    
    const [nome,setNome] = useState(user && user.nome);
    const [email,setEmail] = useState(user && user.email);
    const [avatarUrl,setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);
    const [loading, setLoading] = useState(false);

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0];
            if(image.type === 'image/jpeg'||image.type === 'image/png'){
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(e.target.files[0]))
            }else{
                toast.error('Envie uma imagem tipo png ou jpeg');
                setImageAvatar(null);
                return null;
            }
        }
    }

    async function uploadImage(){
        const uid = user.uid;

        const uploadTask = await firebase.storage()
        .ref(`images/users/${uid}/${imageAvatar.name}`)
        .put(imageAvatar)
        .then(async ()=>{
            setLoading(true);

            if(user.avatarUrl!==null){ //apaga a imagem anterior
                const ref = await firebase.storage().refFromURL(`${user.avatarUrl}`).delete()
            }

            await firebase.storage().ref(`images/users/${uid}`)
            .child(imageAvatar.name).getDownloadURL()
            .then(async (url)=>{

                await firebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    avatarUrl: url,
                    nome: nome
                })
                .then(()=>{
                    let data = {
                        ...user,
                        avatarUrl: url,
                        nome: nome
                    }
                    setUser(data);
                    storageUser(data);
                    toast.success('Atualizado com sucesso');
                })

            })
            setLoading(false);
        })
    }

    async function salvarEdit(e){
        e.preventDefault();
        setLoading(true);
        if(imageAvatar===null && nome !== ''){
            await firebase.firestore().collection('users')
            .doc(user.uid)
            .update({
                nome: nome
            })
            .then(()=>{
                let data = {
                    ...user,
                    nome: nome
                }
                setUser(data);
                storageUser(data);
            })
            .catch((error)=>{
                console.log(error);
                toast.error('Algo deu errado');
            })
        }else if(imageAvatar!==null && nome !== ''){
            uploadImage();
        }
        setLoading(false);
    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title name="Meu Perfil">
                    <FiSettings size={25}/>
                </Title>

                <div className="perfil">
                    <form className="form-profile" onSubmit={salvarEdit}>
                        <label className="label-avatar">
                            <span><FiUpload color="#fff" size={25}/></span>
                            <input type="file" accept="image/*" onChange={handleFile}/><br/>
                            {avatarUrl === null ? 
                                <img src={avatar} width={250} height={250} alt="avatar perfil"/>
                            :    <img src={avatarUrl} width={250} height={250} alt="avatar perfil"/>}
                        </label>

                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(e)=> setNome(e.target.value)}/>
                        
                        <label>Email</label>
                        <input type="text" value={email} disabled/>

                        <button type="submit" >{loading? 'Carregando...':'Salvar'}</button>
                    </form>
                    
                </div>
                
                <button className="logout" onClick={()=>sair()}>
                    {loadingAuth? 'Saindo...':'Sair'}
                </button>

            </div>
        </div>
    )
}