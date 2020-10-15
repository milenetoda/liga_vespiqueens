const fs = require("fs");
var Xray = require("x-ray");
var x = Xray();

module.exports = async function scraper() {
  return x("https://silph.gg/tournaments/host/ayef", ".roundColumn", [
    {
      numero: "h5",
      partidas: x([".matchup@data-participant"]),
    },
  ]).then(function (rodadas) {
    for (const rodada of rodadas) {
      rodada.numero = rodada.numero.substring(5).trim();

      for (const index in rodada.partidas) {
        rodada.partidas[index] = rodada.partidas[index].split(" ");
      }
    }

    return rodadas;
  });
};
