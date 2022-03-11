import firebase from "../../services/firebaseConn";
import {useHistory, useParams} from 'react-router-dom';

import Header from "../../components/Header";
import Title from "../../components/Title";
import ImagemDefault from "../../assets/default.jpg";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import { toast } from "react-toastify";

import "./post.css";
import { FiPlusCircle,FiUpload } from "react-icons/fi";

export default function Post(){
    const {id} = useParams();
    // const history = useHistory();

    const [loadAutores, setLoadAutores] = useState(true);
    const [loadCategorias, setLoadCategorias] = useState(true);
    const [autores,setAutores] = useState([]);
    const [autorSelected, setAutorSelected] = useState(0);
    const [categoriaSelected, setCategoriaSelected] = useState(0);
    const [titulo, setTitulo] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [conteudo, setConteudo] = useState("");
    const [imagem, setImagem] = useState();
    const [imagemUrl,setImagemUrl] = useState(null);
    const [idAutor, setIdAutor] = useState(false);
    const [autorUser, setAutorUser] = useState(null);
    const {user} = useContext(AuthContext);
    const [saveButton, setSaveButton] = useState(false);

    useEffect(()=>{
        async function loadAutores(){
            await firebase.firestore().collection('autores')
            .get()
            .then((snapshot)=>{
                let lista = [{id:0, nome:'Selecione...'}];
                snapshot.forEach((doc)=>{
                    lista.push({
                        id: doc.id,
                        nome: doc.data().nome
                    })
                })

                if(lista.length ===0){
                    console.log('Nenhum autor encontrada');
                     // setAutores([ {id:'1', nome: ''} ]);
                    return;
                }
                setAutores(lista);

                // if(id){
                //     loadId(lista);
                // }
            })
            .catch((error)=>{
                console.log(error);
                // setAutores([ {id:'1', nome: ''} ]);
            })
            setLoadAutores(false);
        }
        loadAutores();

        async function loadCategorias(){
            await firebase.firestore().collection('categorias').get()
            .then((snapshot)=>{
                let lista = [{id:0, nome:'Selecione...'}];
                snapshot.forEach((doc)=>{
                    lista.push({ id: doc.id, nome: doc.data().nome })
                })
                if(lista.length ===0){
                    console.log('Nenhuma categoria encontrada');
                    return;
                }
                setCategorias(lista);
            })
            .catch((error)=>{
                console.log(error);
            })
            setLoadCategorias(false);
        }
        loadCategorias();

    }, [id]);

    async function loadId(lista){
        
        await firebase.firestore().collection('posts')
        .doc(id).get()
        .then((snapshot)=>{
            setTitulo(snapshot.data().titulo);
            // setCategoriaSelected(snapshot.data().categoria);
            setConteudo(snapshot.data().conteudo);

            let index = lista.findIndex(item => item.id === snapshot.data().autor_id);
            setAutorSelected(index);
            setIdAutor(true);
        })
        .catch((error)=>{
            console.log(error);
            setIdAutor(false);
        })
    }

    async function Register(e){
        e.preventDefault();
        if(titulo!=='' && autorSelected !== 0 && categoriaSelected !== 0){
            setSaveButton(false);

            // if(idAutor){
            //     await firebase.firestore().collection('posts').doc(id)
            //     .update({
            //         autor: autores[autorSelected].nome,
            //         autor_id: autores[autorSelected].id,
            //         titulo: titulo,
            //         categoria: categoria,
            //         conteudo: conteudo,
            //         user_id: user.uid
            //     })
            //     .then(()=>{
            //         toast.success('Post editado com sucesso!')
            //         setAutorSelected(0);
            //         setConteudo('');
            //         history.push('/painel');
            //     })
            //     .catch((error)=>{
            //         toast.error('Oops... Erro ao registrar');
            //         console.log(error);
            //     })
            //     return;
            // }

            await firebase.firestore().collection('posts')
            .add({
                created_at: new Date(),
                titulo: titulo,
                categoria: categorias[categoriaSelected].nome,
                conteudo: conteudo,
                imagem: null,
                autor: (autorSelected===0) ? user.nome : autores[autorSelected].nome,
                autor_id: (autorSelected===0)?user.uid : autores[autorSelected].id,
                user_id: user.uid
            })
            .then((value)=>{
                toast.success('Post criado com sucesso');
                setConteudo('');
                setAutorSelected(0);
                setTitulo("");
                setCategoriaSelected(0);

                if(imagem){
                    uploadImage(value.id);
                }
            })
            .catch((error)=>{
                toast.error('Oops... Erro ao registrar, tente mais tarde');
                console.log(error);
            })
            
        }else{
            toast.error('Por favor preencha todos os campos');
        }

    }
    
    function changeStatus(e){
        setTitulo(e.target.value);
        setSaveButton(true);
        if(e.target.value===''){
            setSaveButton(false);
        }
    }

    function ChangeSelect(e){
        setCategoriaSelected(e.target.value);
    }

    function ChangeAutores(e){
        setAutorSelected(e.target.value);
        if(e.target.value!=="0"){
            setAutorUser(false);
        }else{
            setAutorUser(null);
        }
    }

    function ChangeCheckbox(){
        if(autorUser===true){
            setAutorUser(false);
        }else{
            setAutorUser(true);
        }
        setAutorSelected(0);
    }

    function handleFile(e){

        if(e.target.files[0]){
            const image = e.target.files[0];
            if(image.type === 'image/jpeg'||image.type === 'image/png'){
                setImagem(image);
                setImagemUrl(URL.createObjectURL(e.target.files[0]));
            }else{
                toast.error('Envie uma imagem tipo png ou jpeg');
                setImagem(null);
                return null;
            }
        }
    }

    async function uploadImage(post_id){
        console.log(post_id);
        console.log(imagem.name);
        await firebase.storage()
        .ref(`images/posts/${post_id}/${imagem.name}`)
        .put(imagem)
        .then(async ()=>{
            
            await firebase.storage().ref(`images/posts/${post_id}`)
            .child(imagem.name).getDownloadURL()
            .then(async (url)=>{

                await firebase.firestore().collection('posts')
                .doc(post_id)
                .update({
                    imagem: url
                })
            })
           
            setImagem(null);
            setImagemUrl(null);
        })
    }

    return(
        <div>
            <Header/>
            
            <div className="content">
                <Title name="Novo Post">
                    <FiPlusCircle size={25}/>
                </Title>

                <div className="post">
                    <form className="form-post" onSubmit={Register}>

                        <div className="row">
                            <div className="form-group col-12 col-md-12">
                            <label>Título</label>
                                <input type="text" className="form-control" value={titulo} onChange={changeStatus}/>
                            </div>
                        </div>  
            
                        <div className="row post-row">
                            <div className="form-group col-12 col-md-4">
                                <label>Autor</label>
                                {loadAutores ? (
                                    <input className="form-select form-control" type="text" disabled value="Carregando..."/>
                                ) : (
                                    <select className="form-select form-control" disabled={autorUser===true} value={autorSelected} onChange={ChangeAutores}>
                                        {autores.map((item, index) => {
                                            return(
                                                <option key={item.id} value={index}>
                                                    {item.nome}
                                                </option>
                                            )
                                        })}
                                    </select>
                                )}
                            </div>

                            <div className="form-check form-check ml-5 mt-5 col-5 col-md-2">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" disabled={autorUser===false}
                                    onChange={ChangeCheckbox}/>
                                 Eu sou o autor
                           </div>

                            <div className="form-group col-md-5 col-12">
                                <label>Categoria</label>

                                {loadCategorias ? (
                                    <input className="form-select form-control" type="text" disabled value="Carregando..."/>
                                ) : (
                                <select className="form-select form-control" value={categoriaSelected} onChange={ChangeSelect}>
                                        {categorias.map((item, index) => {
                                            return(
                                                <option key={item.id} value={index}>
                                                    {item.nome}
                                                </option>
                                            )
                                        })}
                                </select>
                                )}
                            </div>
                        </div>

                        <div className="row post-row">
                            <div className="col-12 col-md-12">
                                <label>Post</label>
                                <textarea className="form-control post-textarea" rows="4" placeholder="Escreva seu post" value={conteudo}
                                    onChange={(e)=>setConteudo(e.target.value)}/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 col-md-12">
                                <label>Imagem</label>
                                <label className="label-avatar label-post">
                                    <span><FiUpload color="#fff" size={25}/></span>
                                    <input type="file" accept="image/*" onChange={handleFile}/>
                                    {imagemUrl === null ? 
                                    <img src={ImagemDefault} width={400} height={200} alt="avatar perfil"/>
                                    :       <img src={imagemUrl} width={350} height={200} alt="avatar perfil"/>}
                                </label>
                            </div>
                        </div>
                        
                        <button type="submit" className={!saveButton ? "disabled":""}>Salvar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}