//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//
// pg_pokemon.js
//
// Manipula interface da pagina pokemon.html
//-------------------------------------------------------------------------------------
// 16/09/23
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//constantes
//----------------------------------------

//limite de movimentos por pagina
const moves_limit = 10;

//variaveis
//----------------------------------------

//lista de movimentos em detalhes
const movesPoke = [];

//offset de movimentos
var offsetMoves = 0;

//mostra e esconde conteudos da tabela
function set_table_tab(show_tab_index = 1) {

    //processa botoes das abas
    function button_normal_all(show_tab_index = 1) {
        switch(show_tab_index) {
            case 4:
                document.getElementById('btn_tab4').classList.remove('details_tabs_btn_normal');
                document.getElementById('btn_tab3').classList.add('details_tabs_btn_normal');
                document.getElementById('btn_tab2').classList.add('details_tabs_btn_normal');
                document.getElementById('btn_tab1').classList.add('details_tabs_btn_normal');
                break;

            case 3:
                document.getElementById('btn_tab3').classList.remove('details_tabs_btn_normal');
                document.getElementById('btn_tab2').classList.add('details_tabs_btn_normal');
                document.getElementById('btn_tab1').classList.add('details_tabs_btn_normal');
                document.getElementById('btn_tab4').classList.add('details_tabs_btn_normal');
                break;

            case 2:
                document.getElementById('btn_tab2').classList.remove('details_tabs_btn_normal');
                document.getElementById('btn_tab1').classList.add('details_tabs_btn_normal');
                document.getElementById('btn_tab3').classList.add('details_tabs_btn_normal');
                document.getElementById('btn_tab4').classList.add('details_tabs_btn_normal');
                break;

            case 1:
            default:
                document.getElementById('btn_tab1').classList.remove('details_tabs_btn_normal');
                document.getElementById('btn_tab2').classList.add('details_tabs_btn_normal');
                document.getElementById('btn_tab3').classList.add('details_tabs_btn_normal');
                document.getElementById('btn_tab4').classList.add('details_tabs_btn_normal');
                break;
        }
    }
    function button_down_one(show_tab_index = 1) {
        switch(show_tab_index) {
            case 4:
                document.getElementById('btn_tab4').classList.add('details_tabs_btn_down');
                document.getElementById('btn_tab3').classList.remove('details_tabs_btn_down');
                document.getElementById('btn_tab2').classList.remove('details_tabs_btn_down');
                document.getElementById('btn_tab1').classList.remove('details_tabs_btn_down');
                break;

            case 3:
                document.getElementById('btn_tab3').classList.add('details_tabs_btn_down');
                document.getElementById('btn_tab2').classList.remove('details_tabs_btn_down');
                document.getElementById('btn_tab1').classList.remove('details_tabs_btn_down');
                document.getElementById('btn_tab4').classList.remove('details_tabs_btn_down');
                break;

            case 2:
                document.getElementById('btn_tab2').classList.add('details_tabs_btn_down');
                document.getElementById('btn_tab1').classList.remove('details_tabs_btn_down');
                document.getElementById('btn_tab3').classList.remove('details_tabs_btn_down');
                document.getElementById('btn_tab4').classList.remove('details_tabs_btn_down');
                break;

            case 1:
            default:
                document.getElementById('btn_tab1').classList.add('details_tabs_btn_down');
                document.getElementById('btn_tab2').classList.remove('details_tabs_btn_down');
                document.getElementById('btn_tab3').classList.remove('details_tabs_btn_down');
                document.getElementById('btn_tab4').classList.remove('details_tabs_btn_down');
                break;
        }
    }

    //processa conteudo abas
    function table_hide_all(show_tab_index = 1) {
        switch(show_tab_index) {
            case 4:
                document.getElementById('tab_body4').classList.remove('content_hide');
                document.getElementById('tab_body1').classList.add('content_hide');
                document.getElementById('tab_body2').classList.add('content_hide');
                document.getElementById('tab_body3').classList.add('content_hide');
                break;

            case 3:
                document.getElementById('tab_body3').classList.remove('content_hide');
                document.getElementById('tab_body1').classList.add('content_hide');
                document.getElementById('tab_body2').classList.add('content_hide');
                document.getElementById('tab_body4').classList.add('content_hide');
                break;

            case 2:
                document.getElementById('tab_body2').classList.remove('content_hide');
                document.getElementById('tab_body1').classList.add('content_hide');
                document.getElementById('tab_body3').classList.add('content_hide');
                document.getElementById('tab_body4').classList.add('content_hide');
                break;

            case 1:
            default:
                document.getElementById('tab_body1').classList.remove('content_hide');
                document.getElementById('tab_body2').classList.add('content_hide');
                document.getElementById('tab_body3').classList.add('content_hide');
                document.getElementById('tab_body4').classList.add('content_hide');
                break;
                
        }
    }

    //aplica alteracoes
    button_normal_all(show_tab_index);
    button_down_one(show_tab_index);
    table_hide_all(show_tab_index);
}

//mostra pagina de movimentos
function ShowPokeMoves() {

    //itens construidos
    let ContItem = 0;

    //string para acrescentar depois
    let innerMoveList = '';

    //acrescenta itens na pagina web
    document.getElementById('poke_move_list').innerHTML = movesPoke.map( (moveItem, moveID) => {
        if ( (moveID >= offsetMoves) && (moveID < (offsetMoves + moves_limit)) ) {
            //faz contagem de itens construidos
            ContItem += 1;
            return `<li>${moveItem}</li>`;
        }
    }).join('');

    //completar com espacos vazios
    for (let index = ContItem; index < moves_limit; index++) {
        innerMoveList += `<li>-</li>`;
    }
    document.getElementById('poke_move_list').innerHTML += innerMoveList;

    //verifica se eh a primeira pagina
    if (offsetMoves == 0) {
        document.getElementById('btn_prev_moves').classList.add('content_hide_space');
        document.getElementById('btn_next_moves').classList.remove('content_hide_space');
    }
    //verifica se eh a ultima pagina
    else
    if ((offsetMoves + moves_limit) >= movesPoke.length) {
        document.getElementById('btn_prev_moves').classList.remove('content_hide_space');
        document.getElementById('btn_next_moves').classList.add('content_hide_space');
    }
    else {
        document.getElementById('btn_prev_moves').classList.remove('content_hide_space');
        document.getElementById('btn_next_moves').classList.remove('content_hide_space');
    }
}

//define largura da barra de stat
function set_stat_bar(nameBar = '', valueBar = 0) {
    const valuePercent = (valueBar * 100) / 255;
    document.getElementById(nameBar).style.width = `${valuePercent}%`;
}

//mostra ou esconde elementos da tabela
function btn_tab1_click() {
    set_table_tab(1);
}
function btn_tab2_click() {
    set_table_tab(2);
}
function btn_tab3_click() {
    set_table_tab(3);
}
function btn_tab4_click() {
    set_table_tab(4);
}

//processa evento click botao voltar
function btn_back_click() {
    window.location.assign('/');
}

//processa evento click botao voltar
function btn_heart_click() {
    document.getElementById('img_heart_empty').classList.toggle('content_hide');
    const heartFull = !document.getElementById('img_heart_full').classList.toggle('content_hide');

    if (heartFull == true) {
        if (savedPoke.includes(focusPoke) == false) {
            savedPoke.push(focusPoke); //add item
            localStorage.setItem(keyStore_Saves, savedPoke.join(saves_comma));
        }
    }
    else
    if (savedPoke.includes(focusPoke) == true) {
        savedPoke.pop(focusPoke); //remove item
        localStorage.setItem(keyStore_Saves, savedPoke.join(saves_comma));
    }
}

//processa evento click botao voltar movimentos
function btn_prev_moves_click() {
    //limite negativo
    if (offsetMoves >= moves_limit) {
        offsetMoves -= moves_limit;
        ShowPokeMoves();
    }
}

//processa evento click botao avancar movimentos
function btn_next_moves_click() {
    //limite positivo
    if ((offsetMoves + moves_limit) < movesPoke.length) {
        offsetMoves += moves_limit;
        ShowPokeMoves();
    }
}

//processa dados do pokemon
function getPokeData(pokeName = '') {

    //verifica se nome existe
    if (pokeName == '') {
        return;
    }
    if (pokeApi.checkPokeName(pokeName) == false) {
        return;
    }

    //obtem dados do servidor
    pokeApi.getPokemon(pokeName)
        .then( (PokeObj) => {
            //sprite
            document.getElementById('main_sprite').src = PokeObj.sprite;

            //cor do tipo
            document.getElementById('poke_content').classList.add(`${css_type_color + PokeObj.type}`);

            //basico
            document.getElementById('poke_name').innerHTML = PokeObj.name;
            document.getElementById('poke_id').innerHTML = `#${PokeObj.number}`;

            //sobre
            document.getElementById('poke_height').innerHTML = `${PokeObj.about.height / 10} cm`;
            document.getElementById('poke_weight').innerHTML = `${PokeObj.about.weight / 10} kg`;
            document.getElementById('poke_body').innerHTML = `${PokeObj.about.body}`;
            document.getElementById('poke_habitat').innerHTML = `${PokeObj.about.habitat}`;
            document.getElementById('poke_gen').innerHTML = `${PokeObj.about.gen}`;
            document.getElementById('poke_base_exp').innerHTML = `${PokeObj.about.baseExp}`;
            document.getElementById('poke_abilities').innerHTML = `${PokeObj.about.abilities.join(', ')}`;

            //movimentos
            movesPoke.push.apply(movesPoke, PokeObj.moves.map( (moveData) => moveData ));
            offsetMoves = 0;
            ShowPokeMoves();
            
            //estatisticas
            document.getElementById('hpValue').innerHTML = `${PokeObj.stats.hp}`;
            document.getElementById('atkValue').innerHTML = `${PokeObj.stats.atk}`;
            document.getElementById('defValue').innerHTML = `${PokeObj.stats.def}`;
            document.getElementById('spAtkValue').innerHTML = `${PokeObj.stats.spAtk}`;
            document.getElementById('spDefValue').innerHTML = `${PokeObj.stats.spDef}`;
            document.getElementById('spdValue').innerHTML = `${PokeObj.stats.spd}`;

            //barras de estatisticas
            set_stat_bar('hpBar', PokeObj.stats.hp);
            set_stat_bar('atkBar', PokeObj.stats.atk);
            set_stat_bar('defBar', PokeObj.stats.def);
            set_stat_bar('spAtkBar', PokeObj.stats.spAtk);
            set_stat_bar('spDefBar', PokeObj.stats.spDef);
            set_stat_bar('spdBar', PokeObj.stats.spd);

            //evolucao
            document.getElementById('evolves_to_value').innerHTML = PokeObj.evo.to;
            document.getElementById('level_at_value').innerHTML = PokeObj.evo.at;
            document.getElementById('evolves_when_value').innerHTML = PokeObj.evo.when;

            //verifica se este pokemon foi salvo
            if (savedPoke.includes(focusPoke) == true) {
                document.getElementById('img_heart_empty').classList.add('content_hide');
                document.getElementById('img_heart_full').classList.remove('content_hide');
            }
        });
}

//evento ao carregar a pagina
window.addEventListener("load", function() {
    //assimila eventos pokemon.html
    document.getElementById('btn_tab1').addEventListener('click', btn_tab1_click);
    document.getElementById('btn_tab2').addEventListener('click', btn_tab2_click);
    document.getElementById('btn_tab3').addEventListener('click', btn_tab3_click);
    document.getElementById('btn_tab4').addEventListener('click', btn_tab4_click);
    document.getElementById('btn_back').addEventListener('click', btn_back_click);
    document.getElementById('btn_heart').addEventListener('click', btn_heart_click);
    document.getElementById('btn_prev_moves').addEventListener('click', btn_prev_moves_click);
    document.getElementById('btn_next_moves').addEventListener('click', btn_next_moves_click);

    //carrega dados salvos do usuario
    focusPoke = localStorage.getItem(keyStore_Focus);
    savedPoke.push.apply(savedPoke, localStorage.getItem(keyStore_Saves).split(saves_comma));

    //carrega dados do pokemon
    getPokeData(focusPoke);
});
