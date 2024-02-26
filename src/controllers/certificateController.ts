import { Response, Request } from "express";

export default class certificateController{
    static async newCertificate(req: Request, res: Response) {
        try{
            const forge = require('node-forge');
            const fs = require('fs');

            const certPath: String = req.body.certPath
            const certPassword: String = req.body.certPassword

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
            // console.log('Versão do Certificado:', cert.version);
            // console.log('Nº de Série do Certificado:', cert.serialNumber);
            // console.log('Emissor do Certificado:', cert.issuer.attributes.map((attr: any) => `${attr.shortName}=${attr.value}`).join(', '));
            // console.log('Assunto do Certificado:', cert.subject.attributes.map((attr: any) => `${attr.shortName}=${attr.value}`).join(', '));
            // console.log('Válido de:', cert.validity.notBefore);
            // console.log('Válido até:', cert.validity.notAfter);

            const date: Date = new Date()
            const valid: Number = (cert.validity.notAfter - date.getTime()) / (1000 * 60 * 60 * 24)
            return res.status(200).json({message: valid.toPrecision(2)})
        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
}