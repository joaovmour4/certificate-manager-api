var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'certificate-manager',
  description: 'Serviço de gerenciamento de Certificados Digitais MG Contabilidade. Feito por João Vitor Moura',
  script: 'C:\\Users\\Cliente\\Documents\\JS\\certificate-manager-api\\build\\index.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();