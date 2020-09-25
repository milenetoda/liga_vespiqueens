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
  
  for (let i=1; i<=dados.rodadas.length; i++) {    
    write("<div>");
    write("<a href='rodada_"+ i +".html'>Rodada #"+ i +"</a>");
    write("</div>");
  }
  cria_pagina("rodadas_menu");

  var i=0;
  for (const rodada of dados.rodadas) {
    i++;
    output = "";
    rodadas(dados, rodada, i);
    cria_pagina("rodada_" + i, "rodadas");
  }
  
  output = "";
  tabela(dados);
  cria_pagina("tabela");

  output = "";
  cria_pagina("index");

}

function cria_pagina(pagina, template){
  if (!template) template = pagina;
    var input = fs.readFileSync(template + "_template.html", "utf-8");
    var menu = fs.readFileSync("menu_template.html", "utf-8");
    
    menu = menu.replace('data-' + template, 'class="selected"');

    var final = input.replace("#" + template + "#", output)
                .replace("#menu#", menu);
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

function tabela(dados){
  write(`
  <div id="legenda">#: Ranking | D: Dupla | P: Pontos | V: Vitórias</div>
<table>
  <thead>
    <tr>
      <th>#</th>
      <th>D</th>
      <th>Nomes</th>
      <th>P</th>
      <th>V</th>
    </tr>
  </thead>
  <tbody>  `);

  var i = 1;

  var classificacao = gera_classificacao(dados);

  for (const linha of classificacao) {
    write(`
    <tr>
      <td>${i}</td>
      <td>${linha.dupla_numero}</td>
      <td class="text-left">${dupla_get_nomes(dados, linha.dupla_id)}</td>
      <td>${linha.pontos}</td>
      <td>${linha.vitorias}</td>
    </tr>
    `);

    i++
  }
  
  write(`
  </tbody>
  </table>`);

}

function gera_classificacao(dados){
  var classificacao = {};

  for (const dupla of dados.duplas) {
    classificacao[dupla.dupla_id] = {
      dupla_numero: dupla.nome,
      dupla_id: dupla.dupla_id,
      pontos: 0,
      vitorias: 0,
    }
  }

  for (const rodada of dados.rodadas) {
    for (const partida of rodada.partidas) {
        var d1 = classificacao[partida.dupla1_id];
        var d2 = classificacao[partida.dupla2_id];
      for (const jogo of partida.jogos) {
        d1.pontos += parseInt(jogo.pontos1);
        d2.pontos += parseInt(jogo.pontos2);
      }
      if (partida.vencedor_id && partida.vencedor_id !== 'Empate!'){
        classificacao[partida.vencedor_id].vitorias++;
      }
    }
  }

  var lista = Object.values(classificacao); 

  lista.sort(function(linha1, linha2){
    var criterio1 = linha2.pontos-linha1.pontos;
    if (criterio1 != 0){
      return criterio1;
    }
    var criterio2 = linha2.vitorias-linha1.vitorias;
      return criterio2;

  })


  
  return lista;
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
      
      if (partida.vencedor_id){
        write(`<li class="vencedor_partida" >`)
        if (partida.vencedor_id !== 'Empate!'){
          write ("Vencedor: " + dupla_get_nomes(dados, partida.vencedor_id));
        }
        else {
          write ("DESEMPATAR");
        }
        write(`</li>`)
      }
            
      
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

function dupla_get_nomes(dados, dupla_id){
  var dupla = busca_dupla(dados, dupla_id);
  var nomes = busca_participante(dados, dupla.participante1_id).nome + " / " +
              busca_participante(dados, dupla.participante2_id).nome;
  return nomes;
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