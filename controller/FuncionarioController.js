import Funcionario from "../model/FuncionarioModel.js";

async function listar (req, res) {
    const respostaBanco = await Funcionario.findAll();
    res.json(respostaBanco);
}

async function selecionar (req, res) {
    const id = req.params.id;
    const respostaBanco = await Funcionario.findByPk(id);
    res.json(respostaBanco);
}

async function inserir (req, res) {


    const respostaBanco = await Funcionario.create(req.body);
    res.json(respostaBanco);
}

async function alterar (req, res) {
    const nomefuncionario = req.body.nomefunctionario;
    const cpf = req.body.cpf;
    const email = req.body.email;
    const telefone = req.body.telefone;
    const nascimento = req.body.nascimento;
    const salario = req.body.salario;
    const contratacao = req.body.contratacao;
    const demissao = req.body.demissao;
    const ativo = req.body.ativo;
    const senha = req.body.senha;
    const token = req.body.token;

    const idfuncionario = req.params.id;

    const respostaBanco = await Funcionario.update(
        { nomefuncionario, cpf, email, telefone, nascimento,salario, contratacao, demissao, ativo, senha, token },
        { where: { idfuncionario } });
    res.json(respostaBanco);
}

async function demitir(req, res) {
    const idfuncionario = req.body.idfuncionario;
    const demissao = req.body.demissao;

    
    //verifica se existe o id do funcionário existe
    const funcionario = await Funcionario.findByPk(idfuncionario);
    if (!funcionario) {
        return res.status(404).send('Funcionário não encontrado.');
    }

    //verifica se o funcionário já não foi demitido
    if (!funcionario.ativo) {
        return res.status(422).send('Este funcionário já foi demitido.');
    }


    //atualiza o registro de funcionário, marcando a demissão e o desativando
    await Funcionario.update(
        { demissao, ativo: false},
        { where: { idfuncionario } }
    );
    
    return res.status(200).send('Demissão realizada.');
}

//função de senha
async function funcionariosenha(req, res) {
    const idfuncionario = req.body.idfuncionario;
    const senha = req.body.senha;

    //verifica se existe o id do funcionário existe
    const funcionario = await Funcionario.findByPk(idfuncionario);
    if (!funcionario) {
        return res.status(404).send('Funcionário não encontrado.');
    }
    
    if (senha.length > 20) {
        return res.status(400).send('A senha tem mais de 20 digitos');
    }
    
    if (senha.length < 6) {
        return res.status(400).send('A senha tem menos de 6 dígitos');
    }


    const token = null;


    await Funcionario.update(
        { senha, token},
        { where: { idfuncionario } }
    );

    return res.status(200).send('Senha criada.');

}

export default {listar, selecionar, inserir, alterar, demitir, funcionariosenha};