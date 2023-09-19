
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//
// poke_api.js
//
// Permite acesso a dados atraves do servidor pokeapi disponivel em
// https://pokeapi.co/api/v2/
//-------------------------------------------------------------------------------------
// 13/09/23
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//constantes
const def_limit = 12;         //limite padrao

//variaveis do objeto
const pokeApi = {
    limit: def_limit,         //quantidade por requisicao
    offset: 0,                //deslocamento requisicao
    max: 0,                   //total de registros
};

//converte dados do modelo original para nosso modelo simplificado
pokeApi.pokeToModel = (pokeItem, simpleData = true) => {
    //novo objeto do nosso modelo
    pokemon = new Pokemon();

    //converte lista de tipos
    const types = pokeItem.types.map( (pokeType) => pokeType.type.name );
    const [type] = types; //pega o tipo no index 0

    //informacoes basicas
    pokemon.id = pokeItem.id;
    pokemon.number = pokeItem.id.toString().padStart(6,"0");
    pokemon.name = pokeItem.name;
    pokemon.types = types;
    pokemon.type = type;

    //sprite
    pokemon.sprite = pokeItem.sprites.other.dream_world.front_default;
    if (pokemon.sprite === null) {
        pokemon.sprite = pokeItem.sprites.front_default;
    }
    if (pokemon.sprite === null) {
        pokemon.sprite = pokeItem.sprites.front_female;
    }
    if (pokemon.sprite === null) {
        pokemon.sprite = pokeItem.sprites.front_shiny;
    }
    if (pokemon.sprite === null) {
        pokemon.sprite = pokeItem.sprites.front_shiny_female;
    }
    if (pokemon.sprite === null) {
        pokemon.sprite = pokeItem.sprites.other.official-artwork.front_default;
    }
    if (pokemon.sprite === null) {
        pokemon.sprite = pokeItem.sprites.other.official-artwork.front_shiny;
    }

    //retorna apenas dados basicos e sem fazer novas requisicoes
    if (simpleData == true) {
        return pokemon;
    }

    //informacoes extendidas - sobre
    pokemon.about.height = pokeItem.height;
    pokemon.about.weight = pokeItem.weight;
    pokemon.about.baseExp = pokeItem.base_experience;
    pokemon.about.abilities = pokeItem.abilities.map( (pokeAbility) => pokeAbility.ability.name );

    //informacoes extendidas - estatisticas
    pokemon.stats.hp = pokeItem.stats[0].base_stat;
    pokemon.stats.atk = pokeItem.stats[1].base_stat;
    pokemon.stats.def = pokeItem.stats[2].base_stat;
    pokemon.stats.spAtk = pokeItem.stats[3].base_stat;
    pokemon.stats.spDef = pokeItem.stats[4].base_stat;
    pokemon.stats.spd =  pokeItem.stats[5].base_stat;

    //informacoes extendidas - golpes
    pokemon.moves = pokeItem.moves.map( (pokeMove) => pokeMove.move.name );

    //obtem informacoes da especie
    return fetch(pokeItem.species.url)
        //converte para json
        .then( (pokeItemData1) => pokeItemData1.json() )
        //tratamento de dados da especie
        .then( (pokeSpecies) => {
            //complementa informacoes de about
            pokemon.about.body = pokeSpecies.shape.name;
            pokemon.about.habitat = pokeSpecies.habitat.name;
            pokemon.about.gen = pokeSpecies.generation.name;

            //obtem informacoes da evolucao da especie
            return fetch(pokeSpecies.evolution_chain.url)
                //converte para json
                .then( (pokeItemData2) => pokeItemData2.json() )
                //tratamento de dados da evolucao
                .then( (pokeEvo) => {
                    //informacoes extendidas - evolucao
                    pokemon.evo.to = pokeEvo.chain.evolves_to[0].species.name;
                    pokemon.evo.at = pokeEvo.chain.evolves_to[0].evolution_details[0].min_level;
                    pokemon.evo.when = pokeEvo.chain.evolves_to[0].evolution_details[0].trigger.name;

                    //fim das requisicoes
                    return pokemon;
                })
                //mostra erro
                .catch( (api_err) => console.log(api_err) );
        })
        //retorna o objeto
        .then( (pokeDataModel) => pokeDataModel )
        //mostra erro
        .catch( (api_err) => console.log(api_err) );
}

//pega infos com detalhes dos pokemons
pokeApi.getPokeData = (pokeItem, simpleData = true) => {
    return fetch(pokeItem)
        //converte para json
        .then( (pokeItemData) => pokeItemData.json() )
        //converte para nosso modelo
        .then( (pokeItemJson) => pokeApi.pokeToModel(pokeItemJson, simpleData) );
}

//verifica se nome de pokemon existe
pokeApi.checkPokeName = (pokeName) => {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`)
        .then( (api_resp) => {
            if ((api_resp.status >= 200) && (api_resp.status < 300)) {
                return true;    
            }
            return false;
        })
        .catch( (api_err) => {
            return false;
        });
}

//pega detalhes de lista usando a busca principal de todos os pokemons
pokeApi.getPokeList = (offset = pokeApi.offset, limit = pokeApi.limit) => {
    const dataUrl = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    return fetch(dataUrl)
        //resposta da API
        .then( (apiAnswer) => apiAnswer.json() ) //retorna conversao string para json
        //conversao para json filtrado
        .then( (answerJson) => {
            //obtem contagem maxima
            pokeApi.max = answerJson.count;

            //retorna lista
            return answerJson.results;
        })
        //conversao para lista de urls com multiplas requisicoes fetch para json
        .then( (answerList) => answerList.map( (answerItem) => pokeApi.getPokeData(answerItem.url, true) ) )
        //espera resultado de cada item
        .then( (detailsReq) => Promise.all(detailsReq) )
        //trata resultado de cada requisicao
        .then( (detailsList) => detailsList )
        //mostra erro
        .catch( (api_err) => console.log(api_err) );
        //fim do processo
        //.finally( () => console.log('Fim da requisição da API') );
}

//pega detalhes de lista usando a busca principal de pokemons com o tipo
pokeApi.getPokeListType = (type = '', offset = pokeApi.offset, limit = pokeApi.limit) => {
    const dataUrl = `https://pokeapi.co/api/v2/type/${type}`;
    return fetch(dataUrl)
        //resposta da API
        .then( (apiAnswer) => apiAnswer.json() ) //retorna conversao string para json
        //conversao para json filtrado
        .then( (answerJson) => answerJson.pokemon )
        //filtra cada item encontrado
        .then( (answerLists) => answerLists.map( (answerListItem) => answerListItem.pokemon ) )
        //conversao lista de urls para multiplas requisicao fetch em json
        .then( (answerList) => answerList.map( (answerListItem) => pokeApi.getPokeData(answerListItem.url, true) ) )
        //espera resultado de cada item
        .then( (detailsReq) => Promise.all(detailsReq) )
        //trata resultado de cada requisicao
        .then( (detailsList) => detailsList )
        //mostra erro
        .catch( (api_err) => console.log(api_err) );
}

//pega detalhes de um pokmeon
pokeApi.getPokemon = (pokeName = '') => {
    //obtem nosso modelo json de um pokemon
    return pokeApi.getPokeData(`https://pokeapi.co/api/v2/pokemon/${pokeName}`, false);
}
