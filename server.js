const faker = require("faker");
const uid = require("uid");
const fs = require("fs");
const lista = require("./lista.js");
const scraper = require("./scraper.js");

class Server {
  middleware() {
    return async (ctx, next) => {

      if (this.route(ctx, "GET", "/load")) {
        ctx.response.type = "json";
        ctx.response.body = this.load();
      } else if (this.route(ctx, "POST", "/save")) {
        ctx.response.type = "json";
        ctx.response.body = await this.save(ctx.request.body);
      } else if (this.route(ctx, "GET", "/scrape")){
        ctx.response.type = "json";
        ctx.response.body = await this.scrape();
      }
      await next();
    };
  }

  route(ctx, method, url) {
    return ctx.request.method === method && ctx.request.url === url;
  }

  load() {
    var dados = fs.readFileSync("dados.json", "utf-8");
    return JSON.parse(dados);
  }

  async save(data) {
    fs.writeFileSync("dados.json", JSON.stringify(data, null, 2), "utf-8");
    await lista();
    return JSON.stringify("Salvo e atualizado!");
  }

  async scrape() {
    await scraper();
    var dados = fs.readFileSync("silph.json", "utf-8");
    return JSON.parse(dados);
  }

}

module.exports = Server;
