import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiAlignJustify, FiUser, FiCalendar } from "react-icons/fi";
import {format} from "date-fns";
import firebase from "../../services/firebaseConn";


export default function PostShow({match}){
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        async function loadPost(){
            await firebase.firestore().collection('posts').doc(match.params.id)
            .get()
            .then((snapshot)=>{
                
                let lista = {
                    id: snapshot.id,
                    titulo: snapshot.data().titulo,
                    autor: snapshot.data().autor,
                    autor_id: snapshot.data().autor_id,
                    categoria: snapshot.data().categoria,
                    conteudo: snapshot.data().conteudo,
                    created_at: snapshot.data().created_at,
                    createdFormated: format(snapshot.data().created_at.toDate(), 'dd/MM/yyyy'),
                    imagem: snapshot.data().imagem
                }

                setPost(lista);
            })
            .catch((error)=>{
                console.log(error);
            })
            
            setLoading(false);
        }
        
        loadPost();
    },[]);

    if(loading){
        return(
          <div>
              <Header/>
    
            <div className="content">
              <Title name="Post">
                <FiAlignJustify size={25}/>
              </Title>
    
              <div className="container painel">
                <span>Buscando post...</span>
              </div>
            </div>
    
          </div>
        )
      }

    return(
        <div>
        <Header/>
        
            <div className="content">
                <Title name="Post">
                    <FiAlignJustify size={25}/>
                </Title>
           
            <div className="container">

                <div className="mb-2">
                
                    <div key={post.id} id="post" className="card mb-2 col-md-12 p-0 show-shadow post-show">

                        <div className="card-body mr-0">
                            <h3> {post.titulo} </h3>
                            <div className="d-flex align-items-center justify-content-between small">
                                <div className="post-show-header">
                                    <FiCalendar size={20}/>{post.createdFormated}
                                    <FiUser size={20}/> {post.autor} 
                                </div>
                            </div>
                            <hr/>
                            <img src={post.imagem} style={{width: "90%", height: "150px", margin:"20px"}}/>

                            <p>{post.conteudo} </p>
                          
                        </div>

                        <div className="card-footer">
                            <small><i className="fas fa-folder mr-1"></i><a href="">{post.categoria}</a> /</small>
                            <small><i className="fas fa-comment mr-1"></i>0 comentarios</small>
                        </div>
                        
                    </div>
                    
                </div>

                </div>

            </div>
        </div>
    )
}