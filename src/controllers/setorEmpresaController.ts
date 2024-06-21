import { Response, Request } from "express"
import SetorEmpresa from "../schemas/SetorEmpresaSchema"


export default class setorEmpresaController{
    static async atribuirSetorEmpresa(req: Request, res: Response){
        try{
            const idSetor: number = req.body.idSetor
            const idEmpresa: number = req.body.idEmpresa

            const verify = await SetorEmpresa.findAll({where:{
                idSetor: idSetor,
                idEmpresa: idEmpresa
            }})

            if(res.user.cargo !== 'admin' && res.user.idSetor !== idSetor)
                return res.status(401).json({message: 'Somente usuários do próprio setor podem alterar suas atribuições.'})
            if(verify.length)
                return res.status(400).json({message: 'O registro já existe na base de dados.'})

            const setorEmpresa = SetorEmpresa.create({
                idSetor: idSetor,
                idEmpresa: idEmpresa
            })

            if(!setorEmpresa)
                return res.status(400).json({message: 'Verifique os dados informados.'})
            return res.status(201).json({message: 'Empresa/Setor anexados com sucesso.'})
        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
    static async removeAtribuicaoSetorEmpresa(req: Request, res: Response){
        try{
            const idSetor: number = req.body.idSetor
            const idEmpresa: number = req.body.idEmpresa

            if(res.user.cargo !== 'admin' && res.user.idSetor !== idSetor)
                return res.status(401).json({message: 'Somente usuários do próprio setor podem alterar suas atribuições.'})
            
            const deleteAtribuicao = await SetorEmpresa.destroy({where:{
                idSetor: idSetor,
                idEmpresa: idEmpresa
            }})

            if(!deleteAtribuicao)
                return res.status(400).json({message: 'Não foi possível remover a atribuição.'})
            return res.status(200).json({message: 'Atribuição removida com sucesso.'})

        }catch(err: unknown){
            return res.status(500).json({message: err})
        }
    }
}