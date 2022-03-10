import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/auth";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiAlignJustify, FiPlus, FiSearch, FiEdit2 } from "react-icons/fi";
import {format} from "date-fns";
import './painel.css'

import firebase from "../../services/firebaseConn";

const url = firebase.firestore().collection('posts').orderBy('created_at', 'desc');

export default function Painel() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [lastPost, setLastPost] = useState(0);
  const [ modal, setModal] = useState(false);
  const [detalhes, setDetalhes] = useState();

  useEffect(()=>{

    async function loadChamados(){
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

    loadChamados();

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
          created_at: doc.data().created_at,
          createdFormated: format(doc.data().created_at.toDate(), 'dd/MM/yyyy'),
        })
      })

      const lastDoc = snapshot.docs[snapshot.docs.length - 1]; //pegando ultimo doc buscado

      //pega os chamados que ja tem e adiciona as listas carregadas
      setPosts(posts => [...posts,...lista]);
      setLastPost(lastPost);
    }else{
      setEmpty(true);
    }

    setMore(false);
  }

  async function mais(){
    setMore(true);
    await url.startAfter(lastPost).limit(5)
    .get()
    .then((snapshot)=>{
      updateState(snapshot);
    })
    .catch((error)=>{
      console.log(error);
    })
  }

  if(loading){
    return(
      <div>
          <Header/>

        <div className="content">
          <Title name="Publicações">
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
          <Title name="Publicações">
            <FiAlignJustify size={25}/>
          </Title>

        {posts.length===0 ? (

          <div className="container painel">
            <span>Nenhum chamado registrado...</span>
            <Link to="/novoPost" className="novo">
              <FiPlus size={25} color="#fff"/>Novo post
            </Link>
          </div> 
        ) : (

          <div className="container">
            {/* <Link to="/novoPost" className="novo bg-success" style={{float:"none", padding: "0.1em", marginBottom: "1em"}}>
              <FiPlus size={25} color="#fff"/>Novo post
            </Link> */}

            <div className="mb-2">
            {posts.map((item, index)=>{
                return(
                  <div key={index} id="post" className="card mb-2 col-md-12 p-0 show-shadow">
            
                      <div className="card-body mr-0">
                          <h3> {item.titulo} </h3>
                          <div className="d-flex align-items-center justify-content-between small">
                              <div>
                                  <i className="far fa-calendar-alt mr-1"></i>{item.createdFormated}
                                  &middot;
                                  <i className="far fa-user mr-1"></i><a href=""> {item.autor} </a>
                              </div>
                          </div>
                          <hr/>
          
                          <p>conteudo post </p>
                          <Link to = {`/post/${item.id}`}>Ver Detalhes</Link>
                         
                      </div>
          
                      <div className="card-footer">
                          <small><i className="fas fa-folder mr-1"></i><a href="">{item.categoria}</a> /</small>
                          <small><i className="fas fa-comment mr-1"></i>0 comentarios</small>
                      </div>
                      
                  </div>
                )
            })}
            </div>
            
          </div>

        )}
        </div>

      </div>
    );
  }
  

  