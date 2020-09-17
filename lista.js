const fs = require("fs");

var output = "";

//main();

function main() {
  const dados = require("./dados.json");
  var silph = require("./silph.json");  
  output = "";
  duplas(dados, silph);
  cria_pagina("duplas");
  
  output = "";
  var i = 0;
  for (const rodada of dados.rodadas) {
    i++;
    write("<div>");
    write("<a href='rodada_"+ i +".html'>Rodada #"+ i +"</a>");
    write("</div>");
  }
  cria_pagina("rodadas_menu");

  i=0;
  for (const rodada of dados.rodadas) {
    i++;
    output = "";
    rodadas(dados, rodada, i);
    cria_pagina("rodada_" + i, "rodadas");
  }
      
  
}

function cria_pagina(pagina, template){
  if (!template) template = pagina;
    var input = fs.readFileSync(template + "_template.html", "utf-8");
    var final = input.replace("#" + template + "#", output);
    fs.writeFileSync(pagina + ".html", final, "utf-8");  
    
}

function duplas(dados, silph) {
  for (var dupla of dados.duplas) {
    var participante1 = busca_participante(dados, dupla.participante1_id);
    var participante2 = busca_participante(dados, dupla.participante2_id);
    var time1 = silph[participante1.nome.toLowerCase()];
    var time2 = silph[participante2.nome.toLowerCase()];

    write(`<div class="dupla bloco hidden">`);
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

function rodadas(dados, rodada, rodada_indice) {
    var i = 0;

    write(`<h2>Rodada ${rodada_indice}</h2>`);
    for (var partida of rodada.partidas) {
      i++;
      var dupla1_num = busca_dupla(dados, partida.dupla1_id).nome;
      var dupla2_num = busca_dupla(dados, partida.dupla2_id).nome;

      write(`
      <div class="partida bloco" data-d1="${dupla1_num}" data-d2="${dupla2_num}">
        <div class="bloco_numero">
          <h3>Partida #${i}</h3>
        </div>

        <ol class="bloco_itens resultados_partidas">
      `)
      var resultado = {
        dupla1 : "",
        pontos1 : 0,
        dupla2 : "",
        pontos2 : 0,
      };
      var contador = 0;
      for (const jogo of partida.jogos) {
        var nome1 = busca_participante(dados, jogo.jogador1_id).nome;
        var nome2 = busca_participante(dados, jogo.jogador2_id).nome;
        write(`<li>`)
        criaJogo(nome1, jogo.pontos1, nome2, jogo.pontos2);
        write(`</li>`)
        if( contador === 0){
          resultado.dupla1 += nome1;
          resultado.dupla2 += nome2;
        }
        if (contador === 1){
          resultado.dupla2 += "<br/>" + nome2;
        }
        if (contador === 2){
          resultado.dupla1 += "<br/>" + nome1;
        }
        contador++;

        resultado.pontos1 += parseInt(jogo.pontos1);
        resultado.pontos2 += parseInt(jogo.pontos2);
      }
      write(`<li>`)
      criaJogo(resultado.dupla1, resultado.pontos1, resultado.dupla2, resultado.pontos2);
      write(`</li>`)
      write(`
        </ol>
      </div>
          `);      
    }
  
}

function criaJogo(nome1, pontos1, nome2, pontos2){
  write(`
  <div class="jogo">
    <div class="jogador1">
      <input class="resultado1-left" value="${pontos1}" readonly/>
      <span class="jogador-nome">${nome1}</span>
      <input class="resultado1-right" value="${pontos1}" readonly/>
    </div>
    <div class="jogador-vs">X</div>
    <div class="jogador2">
      <input class="resultado2" value="${pontos2}" readonly/>
      <span class="jogador-nome">${nome2}</span>
    </div>
  </div>
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