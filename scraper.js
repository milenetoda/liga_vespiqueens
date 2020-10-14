const fs = require("fs");
var Xray = require("x-ray");
var x = Xray();

module.exports = function scraper() {
  x(
    "https://silph.gg/tournaments/results/buve",
    ".playerList tr[data-participant]",
    [
      {
        competidor: "@data-participant",
        competidor_display: ".competitorUsername",
        removido: "span.removed",
        pokemon: x(".pokemonEntry", [
          {
            img: "img@src",
            nome: "p:not(.cp)",
            cp: "p.cp",
          },
        ]),
      },
    ]
  ).then(function (arr) {
    var rv = {};
    for (var i = 0; i < arr.length; ++i) {
      var value = arr[i];
      var key = value.competidor;
      value.competidor_display = value.competidor_display.trim();
      if (!value.removido) {
        rv[key] = value;
      }
    }
    //console.log(rv);

    fs.writeFileSync("silph.json", JSON.stringify(rv, null, 2), "utf-8");
  });
  //.write("results.json");
};