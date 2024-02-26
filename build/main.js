"use strict";
const forge = require('node-forge');
const fs = require('fs');
const certPath = "C:\\Users\\Cliente\\Downloads\\CERTIFICADO_JOAO_VITOR_MOURA-SENHA_JoaovDOTmour02.p12";
// Senha do certificado (se houver)
const certPassword = 'Joaov.mour02';
// Lê o conteúdo do arquivo do certificado PFX
const pfxData = fs.readFileSync(certPath, 'binary');
// Decodifica o certificado PFX usando a senha
const p12Asn1 = forge.asn1.fromDer(pfxData);
const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, certPassword);
// Obtém informações sobre o certificado
const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
const certBag = bags[forge.pki.oids.certBag][0];
const cert = certBag.cert;
// Exibe as informações do certificado
console.log('Versão do Certificado:', cert.version);
console.log('Nº de Série do Certificado:', cert.serialNumber);
console.log('Emissor do Certificado:', cert.issuer.attributes.map((attr) => `${attr.shortName}=${attr.value}`).join(', '));
console.log('Assunto do Certificado:', cert.subject.attributes.map((attr) => `${attr.shortName}=${attr.value}`).join(', '));
console.log('Válido de:', cert.validity.notBefore);
console.log('Válido até:', cert.validity.notAfter);
const date = new Date();
const valid = (cert.validity.notAfter - date.getTime()) / (1000 * 60 * 60 * 24);
console.log(`Restam ${valid.toPrecision(2)} dias`);
