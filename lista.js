const yaml = require("js-yaml");
const fs = require("fs");

var output = "";

main();

function main() {
  const objeto = yaml.safeLoad(fs.readFileSync("lista.yaml", "utf8"));
  var paginas = ["rodadas", "duplas"];
  var silph = require("./results.json");

  for (pag of paginas) {
    output = "";
    switch (pag) {
      case "rodadas":
        rodadas(objeto);
        break;
      case "duplas":
        duplas(objeto, silph);
        break;
    }
    var pagina = pag;
    var input = fs.readFileSync(pag + "_template.html", "utf-8");
    var final = input.replace("#" + pag + "#", output);
    fs.writeFileSync(pag + ".html", final, "utf-8");
  }
  process.exit(0);
}

function duplas(objeto, silph) {
  var lista_participantes = Object.entries(objeto.participantes);
  for (var [id, participante] of lista_participantes) {
    var dados1 = silph[participante.nome1.toLowerCase()];
    var dados2 = silph[participante.nome2.toLowerCase()];

    write(`<div class="dupla bloco">`);
    write(`<div class="bloco_numero">`);
    write(`<h3>Dupla #${id}</h3>`);
    write(`</div>`);
    write(`<ol class="bloco_itens">`);
    write(`<li>${participante.nome1}</li>`);
    write(`<li class="li_pokemon">`);
    lista_pokemon(dados1.pokemon);
    write(`</li>`);
    write(`<li>${participante.nome2}</li>`);
    write(`<li class="li_pokemon">`);
    lista_pokemon(dados2.pokemon);
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

function rodadas(objeto) {
  var j = 0;
  for (var rodada of objeto.rodadas) {
    var i = 0;
    j++;
    write(`<h2>Rodada ${j}</h2>`);
    for (var partida of rodada) {
      i++;
      var dupla1_id = partida[0];
      var dupla2_id = partida[1];

      var dupla1 = objeto.participantes[dupla1_id];
      var dupla2 = objeto.participantes[dupla2_id];

      write(`
    <div class="partida bloco">
    <div class="bloco_numero">
      <h3>Partida #${i}</h3>
    </div>

    <ol class="bloco_itens">
      <li>${dupla1.nome1} X ${dupla2.nome1}</li>
      <li>${dupla1.nome1} X ${dupla2.nome2}</li>
      <li>${dupla1.nome2} X ${dupla2.nome1}</li>
      <li>${dupla1.nome2} X ${dupla2.nome2}</li>
    </ol>
  </div>
    `);
    }
  }
}

function write(a) {
  //console.log(a);
  output += a + "\r\n";
}
