import Emprestimo from "../model/EmprestimoModel.js";
import Livro from "../model/LivroModel.js";
import Usuario from "../model/UsuarioModel.js";
import moment from 'moment';

async function listar(req, res) {
    const respostaBanco = await Emprestimo.findAll();
    res.json(respostaBanco);
}

async function selecionar(req, res) {
    const id = req.params.id;
    const respostaBanco = await Emprestimo.findByPk(id);
    res.json(respostaBanco);
}

async function emprestar(req, res) {
    //Lendo os parametros
    const idlivro = req.body.idlivro;
    const idusuario = req.body.idusuario;

    //verifica se existe o parametro idlivro
    if (!idlivro) {
        res.status(422).send('O parâmetro idlivro é obrigatório.');
    }

    //verifica se existe o parametro idusuario
    if (!idusuario) {
        res.status(422).send('O parâmetro idusuario é obrigatório.');
    }

    //verifica se o livro existe
    const livroBanco = await Livro.findByPk(idlivro);
    if (!livroBanco) {
        res.status(404).send('Livro não encontrado.');
    }

    const usuarioBanco = await Usuario.findByPk(idusuario);
    if (!usuarioBanco) {
        res.status(404).send('Usuário não encontrado.');
    }

    //Verifica se o campo está inativo
    if (!livroBanco.ativo) {
        res.status(422).send('Este livro está inativo.');
    }

    if (livroBanco.emprestado) {
        res.status(422).send('Este livro já está emprestado.');
    }

    //verifica se o usuário tem um empréstimo pendente
    //falta fazer

    //setando data de empréstimo e data de vencimento
    const emprestimo = moment().format('YYYY-MM-DD');
    const vencimento = moment().add(15, 'days').format('YYYY-MM-DD');

    //inserindo o empréstimo no banco
    const respostaBanco = await Emprestimo.create({ idlivro, idusuario, emprestimo, vencimento });

    //alterando o campo emprestado do livro para true
    const emprestado = true;
    await Livro.update(
        { emprestado },
        { where: { idlivro } });

    res.json(respostaBanco);
}

//devolução do livro

// Extrai o id do empréstimo e a observação da requisição
async function devolver(req, res) {
    const idemprestimo = req.body.idemprestimo;
    const observacao = req.body.observacao;

    //verifica se o id do emprestimo foi colocado 
    if (!idemprestimo) {
        return res.status(422).send('O parâmetro idemprestimo é obrigatório.');
    }

    //verifica se existe o emprestimo
    const emprestimo = await Emprestimo.findByPk(idemprestimo);
    if (!emprestimo) {
        return res.status(404).send('Empréstimo não encontrado.');
    }

    //verifica se o emprestimo já não foi devolvido
    if (emprestimo.devolucao) {
        return res.status(422).send('Este empréstimo já foi devolvido.');
    }

    //obtém a data atual e formata no formato YYYY-MM-DD
    const data_devolucao = moment().format('YYYY-MM-DD');

    //atualiza o registro de empréstimo, marcando a devolução e adicionando a observação
    await Emprestimo.update(
        { devolucao: data_devolucao, observacao },
        { where: { idemprestimo } }
    );

    //obtém o id do livro associado ao empréstimo
    const idlivro = emprestimo.idlivro;

    //atualiza o livro, marcando-o como não emprestado
    await Livro.update(
        { emprestado: false },
        { where: { idlivro } }
    );

    //retorna se o processo deu certo
    return res.status(200).send('Livro devolvido com sucesso.');
}

export default { listar, selecionar, emprestar, devolver };
