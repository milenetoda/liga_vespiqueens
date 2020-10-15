const fs = require("fs");
var Xray = require("x-ray");
var x = Xray();

module.exports = async function scraper() {
  return x("https://silph.gg/tournaments/host/ayef", ".roundColumn", [
    {
      numero: "h5",
      partidas: x(".matchup", [
        {
          oponentes: "@data-participant",
          classes: [".competitor@class"],
        },
      ]),
    },
  ]).then(function (rodadas) {
    for (const rodada of rodadas) {
      rodada.numero = rodada.numero.substring(5).trim();

      for (const index in rodada.partidas) {
        var oponentes = rodada.partidas[index].oponentes.split(" ");
        var vencedor = "";

        for (const index2 in rodada.partidas[index].classes) {
          const classe = rodada.partidas[index].classes[index2];
          if (classe.includes("win")) {
            vencedor = oponentes[index2];
          }
        }

        rodada.partidas[index] = {
          dupla1_participante: oponentes[0],
          dupla2_participante: oponentes[1],
          vencedor: vencedor,
        };
      }
    }

    return rodadas;
  });
};

module.exports().then((q) => console.log(JSON.stringify(q, null, 2)));
