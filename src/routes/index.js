import {Switch} from 'react-router-dom'; 
import Route from './Route';

import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import Painel from '../pages/Painel';
import Perfil from '../pages/Perfil';
import Autor from '../pages/Autor';
import Post from '../pages/Post';

export default function Routes(){
    return(
        <Switch>
            <Route exact path="/" component={Painel} />
            <Route exact path="/login" component={Login}/>
            <Route exact path="/cadastro" component={Cadastro}/>

            <Route exact path="/painel" component={Painel} isPrivate/>
            <Route exact path="/perfil" component={Perfil} isPrivate/>
            <Route exact path="/autores" component={Autor} isPrivate/>
            <Route exact path="/novoPost" component={Post} isPrivate/>
            {/* <Route exact path="/post/:id" component={New} isPrivate/> */}
        </Switch>
    )
}