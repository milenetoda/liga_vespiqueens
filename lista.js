const fs = require("fs");

var output = "";

//main();

function main() {
  const dados = require("./dados.json");
  var paginas = ["rodadas", "duplas"];
  var silph = require("./silph.json");


  for (var pagina of paginas) {
    output = "";
    switch (pagina) {
      case "rodadas":
        rodadas(dados);
        break;
      case "duplas":
        duplas(dados, silph);
        break;
    }
    var input = fs.readFileSync(pagina + "_template.html", "utf-8");
    var final = input.replace("#" + pagina + "#", output);
    fs.writeFileSync(pagina + ".html", final, "utf-8");
  }
}

function duplas(dados, silph) {
  for (var dupla of dados.duplas) {
    var participante1 = busca_participante(dados, dupla.participante1_id);
    var participante2 = busca_participante(dados, dupla.participante2_id);
    var time1 = silph[participante1.nome.toLowerCase()];
    var time2 = silph[participante2.nome.toLowerCase()];

    write(`<div class="dupla bloco">`);
    write(`<div class="bloco_numero">`);
    write(`<h3>Dupla #${dupla.nome}</h3>`);
    write(`</div>`);
    write(`<ol class="bloco_itens">`);
    write(`<li>${participante1.nome}</li>`);
    write(`<li class="li_pokemon">`);
    lista_pokemon(time1.pokemon);
    write(`</li>`);
    write(`<li>${participante2.nome}</li>`);
    write(`<li class="li_pokemon">`);
    lista_pokemon(time2.pokemon);
    write(`</li>`);
    write(`</ol>`);
    write(`</div>`);
  }
}



function lista_pokemon(pokemon) {
  write(`<div class="pokemon_list">`);
  for (var i = 0; i < pokemon.length; i++) {
    write(`<div class="pokemon">`);
    write(`<div class="pokemon-cp">${pokemon[i].cp}</div>`);
    write(`<img class="pokemon-img" src="${pokemon[i].img}"/>`);
    write(`<div class="pokemon-nome">${fixname(pokemon[i].nome)}</div>`);
    write(`</div>`);
  }
  write(`</div>`);
}

function fixname(name) {
  switch (name) {
    case "Galarian Stunfisk":
      return "Stunfisk G";
    case "Deoxys (Defense Forme)":
      return "Deoxys D";
    case "Marowak (Alolan)":
      return "Marowak A";
    case "Raichu (Alolan)":
      return "Raichu A";
    case "Rainy Castform":
      return "Castform R";
  }
  return name;
}

function rodadas(dados) {
  var j = 0;
  for (var rodada of dados.rodadas) {
    var i = 0;
    j++;
    write(`<h2>Rodada ${j}</h2>`);
    for (var partida of rodada.partidas) {
      i++;

      write(`
    <div class="partida bloco">
    <div class="bloco_numero">
      <h3>Partida #${i}</h3>
    </div>

    <ol class="bloco_itens resultados_partidas">
    `)
    for (const jogo of partida.jogos) {
      criaJogo(dados, jogo);
    }  
    write(`
    </ol>
  </div>
    `);
    }
  }
}

function criaJogo(dados, jogo) {
  var nome1 = busca_participante(dados, jogo.jogador1_id).nome;
  var nome2 = busca_participante(dados, jogo.jogador2_id).nome;

  write(`
  <li>
    <div class="jogador1">
      <input class="resultado1-left" value="${jogo.pontos1}" readonly/>
      <span class="jogador-nome">${nome1}</span>
      <input class="resultado1-right" value="${jogo.pontos1}" readonly/>
    </div>
    <div class="jogador-vs">X</div>
    <div class="jogador2">
      <input class="resultado2" value="${jogo.pontos2}" readonly/>
      <span class="jogador-nome">${nome2}</span>
    </div>
  </li>
  `)
}

function busca_participante (dados, id){
  return find_by_id(
    dados.participantes,
    "participante_id",
    id)
}

function busca_dupla(dados, id) {
  return find_by_id(
    dados.duplas,
    "dupla_id",
    id)
}

function find_by_id(array, nome_id, valor_id) {
  for (const item of array) {
    if (item[nome_id] === valor_id) return item;
  }
  return null;
}

function write(a) {
  //console.log(a);
  output += a + "\r\n";
}

module.exports = {
  executar: main
}