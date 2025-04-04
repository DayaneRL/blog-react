import firebase from "../../services/firebaseConn";
import {useHistory, useParams, useLocation} from 'react-router-dom';

import Header from "../../components/Header";
import Title from "../../components/Title";
import ModalLogin from "../../components/ModalLogin";
import ImagemDefault from "../../assets/default.jpg";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import { toast } from "react-toastify";

import "./post.css";
import { FiPlusCircle,FiUpload } from "react-icons/fi";

export default function Post(){
    const {id} = useParams();
    const history = useHistory();
    const location = useLocation()

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
    const [imagemPostId, setImagemPostId] = useState();
    const [idAutor, setIdAutor] = useState(false);
    const [autorUser, setAutorUser] = useState(null);
    const {user} = useContext(AuthContext);
    const [saveButton, setSaveButton] = useState(false);
    const [ modalLogin, setModalLogin] = useState(false);

    useEffect(()=>{

        load('autores');
        load('categorias');
        if(!id){
            limpaCampos();
        }

    }, [location.key, id]);

    if(!loadCategorias && titulo==='' && id){
        loadId();
    }

    async function load(select){
        var lista = [{id:0, nome:'Selecione...'}];

        await firebase.firestore().collection(select)
        .get()
        .then((snapshot)=>{
            
            snapshot.forEach((doc)=>{
                lista.push({ id: doc.id, nome: doc.data().nome });
            })

            if(lista.length===0){
                console.log('Nenhum '+select+' encontrado(a)');
                return;
            }
            (select==='autores'? setAutores(lista):setCategorias(lista));
           
        })
        .catch((error)=>{
            console.log(error);
        });

        (select==='autores'? setLoadAutores(false):setLoadCategorias(false));
    }

    function limpaCampos(){
        setTitulo('');
        setAutorSelected(0);
        setCategoriaSelected(0);
        setConteudo('');
        setAutorUser(null);
        setImagemUrl(null);
        document.getElementById('euSouOAutor').checked=false;
    }

    async function loadId(){
        
        await firebase.firestore().collection('posts')
        .doc(id).get()
        .then((snapshot)=>{
            setTitulo(snapshot.data().titulo);
            setConteudo(snapshot.data().conteudo);

            let indexAutor = autores.findIndex(item => item.id === snapshot.data().autor_id);
            setAutorSelected(indexAutor);
            let indexCategoria = categorias.findIndex(item => item.nome === snapshot.data().categoria);
            setCategoriaSelected(indexCategoria);

            setIdAutor(true);
            if(snapshot.data().autor_id===user.uid && autorUser===null){
                document.getElementById('euSouOAutor').checked = true;
                setAutorUser(true);
            }
            setImagem(snapshot.data().imagem);
            setImagemUrl(snapshot.data().imagem);
            setImagemPostId(snapshot.data().imagem);

            setSaveButton(true);
        })
        .catch((error)=>{
            console.log(error);
            setIdAutor(false);
        })
    }

    async function Register(e){
        e.preventDefault();
        if(titulo!=='' && (autorSelected!==0 ||idAutor!==false||autorUser) && categoriaSelected !== 0){
            setSaveButton(false);

            if(id){
                await firebase.firestore().collection('posts').doc(id)
                .update({
                    titulo: titulo,
                    categoria: categorias[categoriaSelected].nome,
                    conteudo: conteudo,
                    imagem: null,
                    autor: (autorSelected===0) ? user.nome : autores[autorSelected].nome,
                    autor_id: (autorSelected===0)?user.uid : autores[autorSelected].id,
                    user_id: user.uid
                })
                .then(()=>{
                    toast.success('Post editado com sucesso!');
                    if(imagem){ uploadImage(id, ); }
                    limpaCampos();
                    history.push('/');
                })
                .catch((error)=>{
                    toast.error('Oops... Erro ao registrar');
                    console.log(error);
                })
                return;
            }

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
                if(imagem){  uploadImage(value.id, null); }
                limpaCampos();
                history.push('/');
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
            if(!user){
                optionModalLogin();
            }
        }
        setAutorSelected(0);
    }
    function optionModalLogin(){
        setModalLogin(!modalLogin);
        if(modalLogin===false){
            document.getElementById("euSouOAutor").click();
            setAutorUser(null);
        }
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

        await firebase.storage()
        .ref(`images/posts/${post_id}/${imagem.name}`)
        .put(imagem)
        .then(async ()=>{
            
            await firebase.storage().ref(`images/posts/${post_id}`)
            .child(imagem.name).getDownloadURL()
            .then(async (url)=>{

                await firebase.firestore().collection('posts').doc(post_id)
                .update({
                    imagem: url
                })
                
                if(imagemPostId!==null && url!==imagemPostId){ //apaga a imagem anterior
                    await firebase.storage().refFromURL(`${imagemPostId}`).delete();
                }
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

                            <div className="form-check col-12 col-md-2">
                                <input className="form-check-input" type="checkbox" value="" id="euSouOAutor" disabled={autorUser===false}
                                    onChange={ChangeCheckbox}/>
                                 Eu sou o autor
                            </div>
                        </div>

                        <div className="row post-row">
                            <div className="form-group col-12 col-md-12">
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
                                        <img src={ImagemDefault} width={400} height={180} alt="imagem padrao"/>
                                    :       <img src={imagemUrl} className="pic-send" alt="imagem"/>}
                                </label>
                            </div>
                        </div>
                        
                        <button type="submit" className={!saveButton ? "disabled":""}>Salvar</button>
                    </form>
                </div>
            </div>

            
            {modalLogin && (<ModalLogin close={optionModalLogin}/>)}

        </div>
    )
}