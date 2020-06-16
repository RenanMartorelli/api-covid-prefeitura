

const fs = require('fs');
const moment = require('moment');
require('express-group-routes');
let qtdLinhas = 0;
let numeroLinha = 1;
let erros = [];

module.exports = (app, db, upload, csv) => {

  app.group("/admin", (app) => {
    app.get('/download-modelo', function (req, res) {
      const file = `${__dirname}/../../files/modelo-importacao.csv`;
      res.download(file); // Set disposition and send it.
    });

    app.post('/import-dados', upload.single('dados-covid'), function (req, res) {
      const fileRows = [];

      // open uploaded file
      csv.parseFile(req.file.path)
        .on("data", function (data) {
          fileRows.push(data); // push each row
        })
        .on("end", async function () {
          fs.unlinkSync(req.file.path);   // remove temp file
          //process "fileRows" and respond
          if (fileRows[0][0] !== 'quantidade;bairro;tipo;data') {
            res.status(400)
            res.json([{ erro: 'formato da planilha impróprio', linha: 0 }]);
            return;
          }
          fileRows.shift();

          numeroLinha = 1
          erros = [];
          for (const row of fileRows) {
            let linhaAtual = row[0].split(';');
            await verificaLinha(linhaAtual, req.body.idUsuario);
          }

          if (erros.length > 0) {
            res.status(400);
            res.json(erros);
            return;
          }

          qtdLinhas = 0;
          for (const row of fileRows) {
            let linhaAtual = row[0].split(';');
            await adicionaLinha(linhaAtual, req.body.idUsuario);
          }

          res.status(200);
          res.json({ status: 'sucesso', linhasImportadas: qtdLinhas })
        });


      // res.json({foi : true})
    });
  })

  async function verificaLinha(linhaAtual) {
    const quantidade = linhaAtual[0];
    const nomeBairro = linhaAtual[1];
    const tipo = linhaAtual[2];
    const data = linhaAtual[3];

    if (tipo !== 'obitos' && tipo !== 'confirmados' && tipo !== 'suspeitos' && tipo !== 'recuperados') {
      erros.push({
        linha: numeroLinha,
        coluna: 'tipo_contagem',
        valor: tipo,
        erro: 'Tipo de contagem não existente. Use apenas (obitos, confirmados, suspeitos, recuperados).'
      })
    }

    if (quantidade > 5000 || quantidade <= 0) {
      erros.push({
        linha: numeroLinha,
        coluna: 'quantidade',
        valor: quantidade,
        erro: 'Quantidade da contagem fora dos limites aceitáveis (maior que 0 e menor que 5000).'
      })
    }

    const dataValida = moment(data, 'DD/MM/YYYY', true).isValid();
    if (!dataValida) {
      erros.push({
        linha: numeroLinha,
        coluna: 'data',
        valor: dataValida,
        erro: 'Data em formato inválido (DD/MM/YYYY).'
      })
    }

    const res = await db.bairro.findAll({
      where: {
        nome: nomeBairro
      }
    })

    if (res.length == 0) {
      erros.push({
        linha: numeroLinha,
        coluna: 'bairro',
        valor: nomeBairro,
        erro: 'Bairro não encontrado.'
      })
    }

    numeroLinha++;
  }

  async function adicionaLinha(linhaAtual, idUsuario) {
    const quantidade = linhaAtual[0];
    const nomeBairro = linhaAtual[1];
    const tipo = linhaAtual[2];
    const data = linhaAtual[3];
    console.log(quantidade, nomeBairro, tipo, data);

    const res = await db.bairro.findAll({
      where: {
        nome: nomeBairro
      }
    })

    const idBairro = res[0].dataValues.id
    const dataFormatada = moment(data, 'DD/MM/YYYY').format('YYYY-MM-DD');

    // console.log('testar com um csv de verdade e passando o idUsuario na requisição')
    // console.log({
    //     quantidade:    quantidade,
    //     tipoContagem:  tipo,
    //     dataContagem:  dataFormatada,
    //     idBairro:      idBairro,
    //     idUsuario:     idUsuario
    //   })

    await db.estatistica.create({
      quantidade: quantidade,
      tipoContagem: tipo,
      dataContagem: dataFormatada,
      idBairro: idBairro,
      idUsuario: idUsuario
    })
    qtdLinhas++;
  }
}


