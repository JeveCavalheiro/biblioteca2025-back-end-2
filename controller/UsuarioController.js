import Usuario from "../model/UsuarioModel.js";

async function listar (req, res) {
    const respostaBanco = await Usuario.findAll();
    res.json(respostaBanco);
}

async function selecionar (req, res) {
    const id = req.params.id;
    const respostaBanco = await Usuario.findByPk(id);
    res.json(respostaBanco);
}

async function inserir (req, res) {
    //    const nomeeditora = req.body.nomeeditora;
    //    const cnpj = req.body.cnpj;
    //    const endereco = req.body.endereco;

    const respostaBanco = await Usuario.create(req.body);
    res.json(respostaBanco);
}

async function alterar (req, res) {
    const nome = req.body.nome;
    const cpf = req.body.cpf;
    const email = req.body.email;
    const telefone = req.body.telefone;
    const nascimento = req.body.nascimento;
    const senha = req.body.senha;


    const idusuario = req.params.id;

    const respostaBanco = await Usuario.update(
        { nome, cpf, email, telefone, nascimento, senha },
        { where: { idusuario } });
    res.json(respostaBanco);
}

async function excluir (req, res) {
    const idusuario = req.params.id;

    const respostaBanco = await Usuario.destroy({ where: { idusuario } });
    res.json(respostaBanco);
}

//função de senha
async function usuariosenha(req, res) {
    const idusuario = req.body.idusuario;
    const senha = req.body.senha;

    //verifica se existe o id do funcionário existe
    const usuario = await Usuario.findByPk(idusuario);
    if (!usuario) {
        return res.status(404).send('Usuario não encontrado.');
    }
    
    if (senha.length > 20) {
        return res.status(400).send('A senha tem mais de 20 digitos');
    }
    
    if (senha.length < 6) {
        return res.status(400).send('A senha tem menos de 6 dígitos');
    }


    


    await Usuario.update(
        { senha},
        { where: { idusuario } }
    );

    return res.status(200).send('Senha criada.');

}


export default {listar, selecionar, inserir, alterar, excluir, usuariosenha};