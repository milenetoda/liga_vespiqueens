const yaml = require('js-yaml');
const fs   = require('fs');
 
// Get document, or throw exception on error
try {
  const objeto = yaml.safeLoad(fs.readFileSync('lista.yaml', 'utf8'));
  //console.log(objeto.participantes);

  for(var participante of objeto.participantes){
    console.log(`<li>${participante.nome1}</li>`);
    console.log(`<li>${participante.nome2}</li>`);

  }
  
} catch (e) {
  console.log(e);
}