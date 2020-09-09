const yaml = require("js-yaml");
const fs = require("fs");

var output = "";

main();

function main() {
  console.log("main");
  const objeto = yaml.safeLoad(fs.readFileSync("lista.yaml", "utf8"));
  var paginas = ["rodadas", "duplas"];

  for (pag of paginas) {
    output = "";
    switch (pag) {
      case "rodadas":
        rodadas(objeto);
        break;
      case "duplas":
        duplas(objeto);
        break;
    }
    var pagina = pag;
    var input = fs.readFileSync(pag + "_template.html", "utf-8");
    var final = input.replace("#" + pag + "#", output);
    fs.writeFileSync(pag + ".html", final, "utf-8");
  }
  process.exit(0);
}

function duplas(objeto) {
  var lista_participantes = Object.entries(objeto.participantes);
  for (var [id, participante] of lista_participantes) {
    write(`<div class="dupla bloco">`);
    write(`<div class="bloco_numero">`);
    write(`<h3>Dupla #${id}</h3>`);
    write(`</div>`);
    write(`<ol class="bloco_itens">`);
    write(`<li>${participante.nome1}</li>`);
    write(`<li>Em construção</li>`);
    write(`<li>${participante.nome2}</li>`);
    write(`<li>Em construção</li>`);
    write(`</ol>`);
    write(`</div>`);
  }
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
      <li>${dupla1.nome1}</li>
      <li>${dupla1.nome2}</li>
      <li>${dupla2.nome1}</li>
      <li>${dupla2.nome2}</li>
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
