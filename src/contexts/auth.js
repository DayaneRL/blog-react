import {createContext, useState, useEffect } from "react";
import firebase from '../services/firebaseConn';
import { toast } from "react-toastify";

export const AuthContext = createContext({});

function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{

        function loadStorage(){
            const storageUser = localStorage.getItem('SistemaUser');
            if(storageUser){
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }
            setLoading(false);
        }
        loadStorage();

    },[]);

    //fazer login
    async function login(email, password){
        setLoadingAuth(true);
        
        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then(async (value)=>{
           
            let uid = value.user.uid;
            const userProfile = await firebase.firestore().collection('users')
            .doc(uid).get();

            let data = {
                uid: uid,
                nome: userProfile.data().nome,
                avatarUrl: userProfile.data().avatarUrl,
                email: value.user.email
            }
            
            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success('Seja bem vindo(a) '+userProfile.data().nome);
        })
        .catch((error)=>{
            console.log(error);
            toast.error('Ops... algo deu errado');
            setLoadingAuth(false);
        })
    }

    //cadastrar novo usuario
    async function cadastro(email,password, nome){
        setLoadingAuth(true);
        await firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(async (value)=>{
            let uid = value.user.uid;

            await firebase.firestore().collection('users')
            .doc(uid).set({
                nome: nome,
                avatarUrl: null,
            })
            .then(()=>{
                let data = {
                    uid: uid,
                    nome: nome,
                    email: email,
                    avatarUrl: null
                }
                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                toast.success('Seja bem vindo(a) '+nome);
            })
          
        })
        .catch((error)=>{
            console.log(error);
            toast.error('Ops... algo deu errado');
            setLoadingAuth(false);
        })
    }

    function storageUser(data){
        localStorage.setItem('SistemaUser', JSON.stringify(data));
    }

    //fazer logout
    async function sair(){
        setLoadingAuth(true);
        await firebase.auth().signOut();
        localStorage.removeItem('SistemaUser');
        toast.info('Usuário deslogado');
        setUser(null);
        setLoadingAuth(false);
    }

    //!! = converter para booleano, se houver valor é true, se vazio é false
    return(
        <AuthContext.Provider 
            value={{signed: !!user,user,loading,cadastro,sair,login,loadingAuth, setUser, storageUser}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;