var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'certificate-manager',
  description: 'Serviço de gerenciamento de Certificados Digitais MG Contabilidade. Feito por João Vitor Moura',
  script: 'C:\\PUBLICA\\AGENDA DE OBRIGAÇÕES FISCAIS\\TI\\certificate-manager\\build\\index.js'
});

svc.on('uninstall',function(){
console.log('Uninstall complete.');
});
// Desistalar serviço.
svc.uninstall();