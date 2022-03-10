import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/auth";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiAlignJustify, FiPlus, FiSearch, FiEdit2 } from "react-icons/fi";
import {format} from "date-fns";

import firebase from "../../services/firebaseConn";
import Modal from "../../components/Modal";


export default function MeusPosts() {
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [lastPost, setLastPost] = useState(0);
  const [ modal, setModal] = useState(false);
  const [detalhes, setDetalhes] = useState();

  const {user} = useContext(AuthContext);
  const url = firebase.firestore().collection('posts').where('user_id','==',user.uid);

  useEffect(()=>{
   console.log(user.uid);
    async function loadMeusPosts(){
      await url.limit(5)
      .get()
      .then((snapshot)=>{
        updateState(snapshot);
      })
      .catch((error)=>{
        console.log(error);
        setMore(false);
      })
  
      setLoading(false);
    }

    loadMeusPosts();

    return () => {

    }
  }, [])

  async function updateState(snapshot){
    const colletionEmpty = snapshot.size === 0;
    if(!colletionEmpty){
      let lista = [];
      snapshot.forEach((doc)=>{
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
          autor_id: doc.data().autor_id,
          categoria: doc.data().categoria,
          conteudo: doc.data().conteudo,
          created_at: doc.data().created_at,
          createdFormated: format(doc.data().created_at.toDate(), 'dd/MM/yyyy'),
        })
      })

      const lastDoc = snapshot.docs[snapshot.docs.length - 1]; //pegando ultimo doc buscado

      setPosts(posts => [...posts,...lista]);
      setLastPost(lastPost);
    }else{
      setEmpty(true);
    }

    setMore(false);
  }

  async function mais(){
    setMore(true);
    await url.startAfter(lastPost).limit(5).get()
    .then((snapshot)=>{
      updateState(snapshot);
    })
    .catch((error)=>{
      console.log(error);
    })
  }

  function optionModal(item){
    setModal(!modal);//trocando de true pra false
    setDetalhes(item);
    console.log(item);
  }

  if(loading){
    return(
      <div>
          <Header/>

        <div className="content">
          <Title name="Meus Posts">
            <FiAlignJustify size={25}/>
          </Title>

          <div className="container painel">
            <span>Buscando posts...</span>
          </div>
        </div>

      </div>
    )
  }

    return (
      <div>
        <Header/>

        <div className="content">
          <Title name="Meus Posts">
            <FiAlignJustify size={25}/>
          </Title>

        <div className="card-body">

        {posts.length===0 ? (

          <div className="container painel">
            <span>Nenhum post registrado...</span>
            <Link to="/novoPost" className="novo">
              <FiPlus size={25} color="#fff"/>Novo post
            </Link>
          </div> 
        ) : (
          <>
          <Link to="/novoPost" className="novo">
            <FiPlus size={25} color="#fff"/>Novo post
          </Link>

          <table>
            <thead>
              <tr>
                <th scope="col">Título</th>
                <th scope="col">Categoria</th>
                <th scope="col">Cadastrado em</th>
                <th scope="col"> # </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((item, index)=>{
                return(
                  <tr key={index}>
                    <td data-label="Titulo">{item.titulo}</td>
                    <td data-label="Categoria">{item.categoria}
                    </td>
                    <td data-label="Cadastrado">{item.createdFormated}</td>
                    <td data-label="#">
                      <button className="action" style={{backgroundColor: '#3583f6'}} onClick={()=>optionModal(item)}>
                        <FiSearch color="#fff" size={17}/>
                      </button>

                      <Link to={`/novoPost/${item.id}`} className="action " style={{backgroundColor: '#F6a935'}}>
                        <FiEdit2 color="#fff" size={17}/>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            
            </tbody>
          </table>

          {more && <h3 style={{textAlign: 'center', marginTop:15}}> Buscando dados...</h3>}
          {!more && !empty && <button className="btn-more" onClick={mais}>Buscar Mais</button>}
          </>
        )}
        </div>
        </div>

        {modal && (<Modal item={detalhes} close={optionModal}/>)}

      </div>
    );
  }
  

  