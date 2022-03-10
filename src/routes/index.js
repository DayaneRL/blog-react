import {Switch} from 'react-router-dom'; 
import Route from './Route';

import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import Painel from '../pages/Painel';
import Perfil from '../pages/Perfil';
import Autor from '../pages/Autor';
import Categoria from '../pages/Categoria';
import Post from '../pages/Post';
import PostShow from '../pages/Post/show.js';
import MeusPosts from '../pages/Post/list.js';
import PageNotFound from '../pages/NotFound';

export default function Routes(){
    return(
        <Switch>
            <Route exact path="/" component={Painel} />
            <Route exact path="/login" component={Login}/>
            <Route exact path="/cadastro" component={Cadastro}/>

            <Route exact path="/painel" component={Painel} isPrivate/>
            <Route exact path="/perfil" component={Perfil} isPrivate/>
            <Route exact path="/autores" component={Autor} />
            <Route exact path="/categorias" component={Categoria} />
            <Route exact path="/meusPosts" component={MeusPosts} isPrivate/>
            <Route exact path="/novoPost" component={Post} />
            <Route exact path="/novoPost/:id" component={Post} />
            <Route exact path="/post/:id" component={PostShow}/>
            <Route path="*" component={PageNotFound} />
        </Switch>
    )
}