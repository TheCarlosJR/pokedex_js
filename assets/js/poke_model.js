
//constantes
//----------------------------------------

//comeco de string para classes de cores por tipo de pokemon
const css_type_color = 'bg_';

const saves_comma = ';';

const keyStore_Offset = 'offset_poke';
const keyStore_Focus = 'focus_poke';
const keyStore_Saves = 'saves_poke';

//variaveis
//----------------------------------------

//nome do pokemon em detalhes
var focusPoke = '';

//lista de pokemons salvos
const savedPoke = [];

//objetos
//----------------------------------------

class PokeAbout {
    height;
    weight;
    body;
    habitat;
    gen;
    baseExp;
    abilities = [];
};

class PokeStats {
    hp;
    atk;
    def;
    spAtk;
    spDef;
    spd;
};

class PokeEvo {
    to;
    at;
    when;
}

class Pokemon {
    id;
    number;
    sprite;
    name;
    type;
    types = [];
    moves = [];
    about = PokeAbout;
    stats = PokeStats;
    evo = PokeEvo;
}
