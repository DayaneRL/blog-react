import { useState, useEffect } from "react";
// import { AuthContext } from "../../contexts/auth";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiAlignJustify, FiPlus,FiCalendar,FiUser } from "react-icons/fi";
import {format} from "date-fns";
import './painel.css'

import firebase from "../../services/firebaseConn";

const url = firebase.firestore().collection('posts').orderBy('created_at', 'desc');

export default function Painel() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{

    async function loadChamados(){
      await url.limit(5)
      .get()
      .then((snapshot)=>{
        updateState(snapshot);
      })
      .catch((error)=>{
        console.log(error);
      })
  
      setLoading(false);
    }

    loadChamados();

    return () => {

    }
  }, [])

  async function updateState(snapshot){
      let lista = [];
      snapshot.forEach((doc)=>{
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
          autor_id: doc.data().autor_id,
          categoria: doc.data().categoria,
          conteudo: doc.data().conteudo,
          imagem: doc.data().imagem,
          created_at: doc.data().created_at,
          createdFormated: format(doc.data().created_at.toDate(), 'dd/MM/yyyy'),
        })
      })

      //pega os chamados que ja tem e adiciona as listas carregadas
      setPosts(posts => [...posts,...lista]);
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
                                    <FiCalendar size={15} className="mr-1"/>{item.createdFormated} 
                                    <FiUser size={15} className="ml-2 mr-1"/>{item.autor} 
                                </div>
                            </div>
                            
                            {item.imagem &&
                            <img src={item.imagem} alt="Post imagem"/>}

                            <p>{item.conteudo}</p>
                            <Link to={`/post/${item.id}`}>Ver Detalhes</Link>
                        </div>
            
                        <div className="card-footer">
                            <small>{item.categoria} /</small>
                            <small>0 comentarios</small>
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
  

  