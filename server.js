const faker = require("faker");
const uid = require("uid");
const fs = require("fs");
const lista = require("./lista.js");
const scraper = require("./scraper.js");

class Server {
  middleware() {
    return (ctx, next) => {
      if (this.route(ctx, "GET", "/load")) {
        ctx.response.type = "json";
        ctx.response.body = this.load();
      } else if (this.route(ctx, "POST", "/save")) {
        ctx.response.type = "json";
        ctx.response.body = this.save(ctx.request.body);
      } else if (this.route(ctx, "GET", "/scrape")){
        ctx.response.type = "json";
        ctx.response.body = this.scrape();
      }
      next();
    };
  }

  route(ctx, method, url) {
    return ctx.request.method === method && ctx.request.url === url;
  }

  load() {
    var dados = fs.readFileSync("dados.json", "utf-8");
    return JSON.parse(dados);
  }

  save(data) {
    fs.writeFileSync("dados.json", JSON.stringify(data, null, 2), "utf-8");
    lista.executar();

    return JSON.stringify("Salvo e atualizado!");
  }
  
  scrape(){
    scraper();
    var dados = fs.readFileSync("silph.json", "utf-8");
    return JSON.parse(dados);    
  }
}

module.exports = Server;
