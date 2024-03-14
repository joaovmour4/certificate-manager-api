import { Response, Request } from "express";
import { Certificate, ICertificate } from "../schemas/certificateSchema";

function removerAcentos(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function removerCaracteresEspeciais(str: string): string {
    return str.replace(/[^\w\s]/gi, '');
}

function removerAcentosEspeciais(str: string): string {
    let semAcentos = removerAcentos(str.toUpperCase());
    return removerCaracteresEspeciais(semAcentos);
}

function isValidVerify(notAfter: any){
    const date: Date = new Date()
    const valid: number = (notAfter.valueOf() - date.valueOf()) / (1000 * 60 * 60 * 24)
    return valid >= 0 ? true:false
}

export default class certificateController{
    static async newCertificate(req: any, res: Response) {
        try{
            const forge = require('node-forge');
            const fs = require('fs');

            const certFile = req.file?.buffer
            const certPassword: String = req.body.certPassword

            const certPath = `temp_${Date.now()}.pfx`;
            fs.writeFileSync(certPath, certFile);

            // Lê o conteúdo do arquivo do certificado PFX
            const pfxData = fs.readFileSync(certPath, 'binary');
            const p12Asn1 = forge.asn1.fromDer(pfxData);
            const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, certPassword);
            const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
            const certBag = bags[forge.pki.oids.certBag][0];
            const cert = certBag.cert;
            const owner = cert.subject.attributes.find((attr: any) => attr.shortName === 'CN')

            fs.unlinkSync(certPath);

            const ownerDoc: string = owner.value.split(':')[1]
            if(await Certificate.findOne({docOwner: ownerDoc})){
                return res.status(400).json({message: 'Já existe um certificado cadastrado para o CNPJ/CPF. Atualize o registro existente'})
            }
            
            // const date: Date = new Date()
            // const valid: number = (cert.validity.notAfter.valueOf() - date.valueOf()) / (1000 * 60 * 60 * 24)

            const newCertificate: ICertificate = await Certificate.create({
                owner: owner.value.split(':')[0],
                docOwner: ownerDoc,
                issuing: cert.validity.notBefore,
                valid: cert.validity.notAfter,
            })

            if(typeof newCertificate === null)
                return res.status(500).json({message: 'Não foi prossível criar o documento.'})
            return res.status(201).json({message: 'Certificado inserido com sucesso.'})
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
                valid: cert.validity.notAfter,
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
                return res.status(200).json({
                    valid: false,
                    message: 'O certificado está vencido.'
                })
            return res.status(200).json({
                valid: true,
                message: `Restam ${valid.toFixed()} dias para o vencimento.`
            })
        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
    static async getCertificates(req: Request, res: Response){
        try{
            const allCertificates = await Certificate.find()
            if(!allCertificates)
                return res.status(400).json({message: 'Não foi possível buscar os certificados.'})
            return res.status(200).json(allCertificates)
        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
    static async getCertificate(req: Request, res: Response){
        try{
            const owner: string = removerAcentosEspeciais(req.params.owner)
            const certificates = await Certificate.find({owner: {$regex: owner}})
            if(!certificates)
                return res.status(400).json({message: 'Não foi possível buscar os certificados.'})
            return res.status(200).json(certificates)
        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
}