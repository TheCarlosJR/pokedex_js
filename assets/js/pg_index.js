//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//
// pg_index.js
//
// Manipula interface da pagina index.html
//-------------------------------------------------------------------------------------
// 14/09/23
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//gera o html dos pokemons requisitados
function loadPokemons(ignora_requisicoes = false) {

    //funcao a ser executada
    var execFuncApi;

    //determina se tem pelo menos um pokemon
    let hasItems = false;

    //ignora requisicoes
    if (ignora_requisicoes == true) {
        return '';
    }

    //obtem valor da barra de pesquisa
    const searchStrData = document.getElementById('edit_search').value.toLowerCase();

    //verifica se tem busca
    if (searchStrData != '') {
        //verifica se vai pesquisar pelo tipo
        if (document.getElementById('rd_search_type').checked == true) {
            execFuncApi = pokeApi.getPokeListType(searchStrData);
        }
        //verifica se vai pesquisar pelo nome
        else
        if (document.getElementById('rd_search_name').checked == true) {
            pokeApi.checkPokeName(searchStrData).then( (nameChecked) => {
                if (nameChecked == true) {
                    pokemon_click(searchStrData);
                }
            });
            return '';
        }
        else {
            return '';
        }
    }
    else {
        execFuncApi = pokeApi.getPokeList();
    }

    //faz as requisicoes ao servidor
    execFuncApi
        .then( (answer_res = []) => {

            //obtem item html
            let poke_list_ol = document.getElementById('pokemons');

            //icone de pokebola normal ou salvo
            let poke_saved_icon;

            //converte json em lista html e depois processa a lista html inteira de uma so vez
            poke_list_ol.innerHTML = answer_res.map( (jsonRes) => {

                //determina que tem pelo menos um item valido
                hasItems = true;

                //verifica se este pokemon foi salvo
                if (savedPoke.includes(jsonRes.name)) {
                    poke_saved_icon = `beast-ball`;
                }
                else {
                    poke_saved_icon = `poke-ball`;
                }

                //gera html de um pokemon
                return `
                <li class="pokemon ${css_type_color}${jsonRes.type}" id="poke_id_${jsonRes.id}" onclick="pokemon_click('${jsonRes.name}')">
                    <div class="poke_number">
                        <span>ID: </span>
                        <span>#${jsonRes.number}</span>
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${poke_saved_icon}.png" alt="pokeball item" />
                    </div>
                    <span class="poke_name">${jsonRes.name}</span>
                    <div class="poke_detail">
                        <ol class="poke_types">
                            ${jsonRes.types.map( (type) => `<li class="poke_type">${type}</li>` ).join('')}
                        </ol>
                        <img src="${jsonRes.sprite}" alt="${jsonRes.name} sprite" />
                    </div>
                </li>
            `;
            }).join('');
        })
        .catch( (api_err) => console.log(api_err) )
        //fim do processo
        .finally(() => {
            //esconde o carrregamento
            document.getElementById('loadbox').classList.add('content_hide');

            //determina que tem pelo menos um item valido
            if (hasItems == true) {
                //processa botoes navegacao
                if (pokeApi.offset == 0) {
                    //primeira pagina
                    document.getElementById('btn_prev_pg').classList.add('content_hide_space');
                    document.getElementById('btn_home_pg').classList.add('content_hide_space');
                    document.getElementById('btn_next_pg').classList.remove('content_hide_space');

                    document.getElementById('btn_prev_pg2').classList.add('content_hide_space');
                    document.getElementById('btn_home_pg2').classList.add('content_hide_space');
                    document.getElementById('btn_next_pg2').classList.remove('content_hide_space');
                }
                else {
                    //demais paginas
                    document.getElementById('btn_prev_pg').classList.remove('content_hide_space');
                    document.getElementById('btn_home_pg').classList.remove('content_hide_space');
                    document.getElementById('btn_next_pg').classList.remove('content_hide_space');

                    document.getElementById('btn_prev_pg2').classList.remove('content_hide_space');
                    document.getElementById('btn_home_pg2').classList.remove('content_hide_space');
                    document.getElementById('btn_next_pg2').classList.remove('content_hide_space');
                }
            }
        });
}

//processa evento click de um pokemon
function pokemon_click(poke_name = '') {
    localStorage.setItem(keyStore_Focus, poke_name);
    window.location.assign('pokemon.html');
}

//evento click btn_prev_pg
function btn_prev_pg_click() {
    //recupera limite padrao
    pokeApi.limit = def_limit;

    //verifica limite negativo
    if (pokeApi.offset >= pokeApi.limit) {
        pokeApi.offset -= pokeApi.limit;

        //salva dados do usuario
        localStorage.setItem(keyStore_Offset, pokeApi.offset);

        //carrega dados do servidor
        loadPokemons();
    }
}

//evento click btn_home_pg
function btn_home_pg_click() {
    //recupera limite padrao
    pokeApi.limit = def_limit;

    //verifica limite negativo
    if (pokeApi.offset > 0) {
        pokeApi.offset = 0;
        
        //salva dados do usuario
        localStorage.setItem(keyStore_Offset, pokeApi.offset);

        //carrega dados do servidor
        loadPokemons();
    }
}

//evento click btn_next_pg
function btn_next_pg_click() {
    //recupera limite padrao
    pokeApi.limit = def_limit;

    //verifica limite positivo
    let newOffset = pokeApi.offset + pokeApi.limit;
    if (newOffset <= pokeApi.max) {
        pokeApi.offset = newOffset;
        
        //salva dados do usuario
        localStorage.setItem(keyStore_Offset, pokeApi.offset);

        //carrega dados do servidor
        loadPokemons();
    }

    //tenta mostrar o restante
    else {
        pokeApi.limit = pokeApi.max - pokeApi.offset;
        pokeApi.offset += pokeApi.limit;
    }
}

//mostra ou esconde elementos de busca
function btn_showsearch_click() {
    document.getElementById('obj_search_line').classList.toggle('content_hide_space');
}

//evento ao carregar a pagina
window.addEventListener("load", function() {
    //assimila eventos index.html
    document.getElementById('btn_showsearch').addEventListener('click', btn_showsearch_click);
    document.getElementById('btn_search').addEventListener('click', loadPokemons);
    document.getElementById('btn_prev_pg').addEventListener('click', btn_prev_pg_click);
    document.getElementById('btn_home_pg').addEventListener('click', btn_home_pg_click);
    document.getElementById('btn_next_pg').addEventListener('click', btn_next_pg_click);
    document.getElementById('btn_prev_pg2').addEventListener('click', btn_prev_pg_click);
    document.getElementById('btn_home_pg2').addEventListener('click', btn_home_pg_click);
    document.getElementById('btn_next_pg2').addEventListener('click', btn_next_pg_click);

    //carrega dados salvos do usuario
    savedPoke.push.apply(savedPoke, localStorage.getItem(keyStore_Saves).split(saves_comma));
    pokeApi.offset = localStorage.getItem(keyStore_Offset);

    //obtem todos os pokemons
    loadPokemons();
});
