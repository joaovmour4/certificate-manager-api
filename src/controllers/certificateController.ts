import { Response, Request } from "express";
import { Certificate, ICertificate } from "../schemas/certificateSchema";


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
            // console.log('Nº de Série do Certificado:', cert.serialNumber);
            const owner = cert.subject.attributes.find((attr: any) => attr.shortName === 'CN')

            const ownerDoc: string = owner.value.split(':')[1]
            if(await Certificate.findOne({docOwner: ownerDoc})){
                return res.status(400).json({message: 'Já existe um certificado cadastrado para o CNPJ/CPF. Atualize o registro existente'})
            }
                

            const newCertificate: ICertificate = await Certificate.create({
                owner: owner.value.split(':')[0],
                docOwner: ownerDoc,
                issuing: cert.validity.notBefore,
                valid: cert.validity.notAfter
            })

            if(typeof newCertificate === null)
                return res.status(500).json({message: 'Não foi prossível criar o documento.'})
            return res.status(201).json(newCertificate)
        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
    static async modifyCertificate(req: Request, res: Response){
        try{
            const forge = require('node-forge');
            const fs = require('fs');
            const docOwner: string = req.params.docOwner
            const certificate = await Certificate.findOne({docOwner: docOwner})

            if(!certificate)
                return res.status(404).json({message: 'O certificado requisitado não existe na base de dados.'})

            const certPath: String = req.body.certPath
            const certPassword: String = req.body.certPassword

            // Lê o conteúdo do arquivo do certificado PFX
            const pfxData = fs.readFileSync(certPath, 'binary')
            const p12Asn1 = forge.asn1.fromDer(pfxData)
            const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, certPassword)
            const bags = p12.getBags({ bagType: forge.pki.oids.certBag })
            const certBag = bags[forge.pki.oids.certBag][0]
            const cert = certBag.cert

            const owner = cert.subject.attributes.find((attr: any) => attr.shortName === 'CN')
            if(certificate.docOwner !== owner.value.split(':')[1])
                return res.status(401).json({message: 'O certificado informado não pertence ao registro informado.'})

            const newCertificate = await Certificate.findByIdAndUpdate(certificate._id, {
                owner: owner.value.split(':')[0],
                docOwner: owner.value.split(':')[1],
                issuing: cert.validity.notBefore,
                valid: cert.validity.notAfter
            })

            
            if(!newCertificate)
                return res.status(400).json({message: 'Não foi possível atualizar o certificado solicitado.'})
            return res.status(200).json({message: 'O certificado foi atualizado com sucesso.'})

        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
    static async validityVerify(req: Request, res: Response){
        try{
            const docOwner: string = req.params.docOwner
            const certificate = await Certificate.findOne({docOwner: docOwner})

            if(!certificate)
                return res.status(404).json({message: 'O certificado requisitado não existe na base de dados.'})

            const date: Date = new Date()
            const valid: number = (certificate.valid.valueOf() - date.valueOf()) / (1000 * 60 * 60 * 24)
            if(valid < 0)
                return res.status(202).json({message: 'O certificado está vencido.'})
            return res.status(200).json({message: `Restam ${valid.toFixed()} dias para o vencimento.`})
        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
}