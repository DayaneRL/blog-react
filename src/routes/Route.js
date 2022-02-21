import { useContext } from 'react';
import {Route, Redirect} from 'react-router-dom';
import {AuthContext} from '../contexts/auth';

export default function RouterWrapper({
    component: Component,
    isPrivate, // rota privada
    ...rest 
}){
    const {signed, loading} = useContext(AuthContext);

    if(loading){
        return(
            <div></div>
        )
    }
    if(!signed && isPrivate){//se tentar acessar rota sem logar
        return <Redirect to="/"/>
    }

    if(signed && !isPrivate){//se ta logado e tentou acessar tela nao privada
        return <Redirect to="/painel"/>
    }

    return(
        <Route {...rest}
            render={ props => (
                <Component {...props}/>
            )}
        />
       
    )
}