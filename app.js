// cria o objeto despesa

class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	//Este bloco valida os campos verificando se a algum sem o preenhimento correto.
	// o uso de [] na variavel "i" faz com que tenha o retorni dos atributos do objeto.

	validarDados() {
		for (let i in this) {
			if (this[i] == undefined || this[i] == '' || this == null) {
				return false
			}
		}
		return true
	}

}


// Classe responsavel por gravar o id no localStorage e criar um proximo

class Bd {

	constructor() {

		let id = localStorage.getItem('id')

		if (id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(d) {


		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)

	}


	recuperarTodosRegistros() {
		//Array de despesas
		let despesas = Array()

		let id = localStorage.getItem('id')

		for (let i = 1; i <= id; i++) {

			// Recupera a despesa
			let despesa = JSON.parse(localStorage.getItem(i))

			// Existe a possibilidade de haver indices que foram pulados/removidos
			// Nestes casos nós vamos pular esses indices
			if (despesa === null) {
				continue
			}

			despesa.id = i
			despesas.push(despesa)


		}
		return despesas
	}

	pesquisar(despesa) {

		let despesasFiltradas = Array()

		despesasFiltradas = this.recuperarTodosRegistros()

		console.log(despesasFiltradas)
		console.log(despesa)

		// Filtro ano

		if (despesa.ano != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}

		// Filtro mes

		if (despesa.mes != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}

		// Filtro dia

		if (despesa.dia != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}

		// Filtro tipo

		if (despesa.tipo != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}

		// Filtro descricao

		if (despesa.descricao != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}

		// Filtro valor

		if (despesa.valor != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}

		return despesasFiltradas
	}

	remover(id) {
		localStorage.removeItem(id)
	}


}

// Captura os dados dos campos da minha form

let bd = new Bd()

function cadastrarDespesa() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value,
		mes.value,
		dia.value,
		tipo.value,
		descricao.value,
		valor.value
	)

	// Neste bloco verificamos se a reposta será true ou false sendo que o retorno de
	// "despesa.validarDados()" significa que a resposta foi "true".
	//tambem exibimos o model para cada caso mudando suas informações dinamicamente.

	if (despesa.validarDados()) {

		//console.log('dados validos')
		bd.gravar(despesa)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Prosseguir'
		document.getElementById('modal_btn').className = 'btn btn-success'

		$('#modalRegistraDespesa').modal('show')

		// Limpa os campos após a validação

		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''


	} else {

		document.getElementById('modal_titulo').innerHTML = 'Erro na gravação'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos.'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir o erro'
		document.getElementById('modal_btn').className = 'btn btn-danger'

		$('#modalRegistraDespesa').modal('show')
	}

}

// Iniciamos despesas como array por default 
// Usamos filtro para caso não haja busca válida retorne o resultado em branco
function carregarListaDespesas(despesas = Array(), filtro = false) {

// Verifica se despesas é vazio e se assim for ele carrega todos os dados
// caso ele tenha valor sera recuperado o resultado no array da busca
// Verificamos tambem se o filtro é false indicando que não e uma "busca" retornando todos os dados

	if (despesas.length == 0 && filtro == false) {
		despesas = bd.recuperarTodosRegistros()
	}

	// Selecionando o elemento tbody da tabela
	let listaDespesas = document.getElementById('listaDespesas')

	// Iniciamos listaDespesa com valor em branco para que somente o
	// resultadoo da busca seja apresentado
	listaDespesas.innerHTML = ''


	// Percorrer o array despesas, listando cada despesa de forma dinamica
	despesas.forEach(function (d) {
		//console.log(d)

		let linha = listaDespesas.insertRow()

		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

		// Ajustar o tipo pois o valor recebido é numerico então fazemos o tratamento
		switch (d.tipo) {
			case '1': d.tipo = 'Alimentação'
				break
			case '2': d.tipo = 'Educação'
				break
			case '3': d.tipo = 'Lazer'
				break
			case '4': d.tipo = 'Saúde'
				break
			case '5': d.tipo = 'Transporte'
				break
		}

		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		// Criar botão de exclusão
		let btn = document.createElement("button")
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class = "fas fa-times"></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function() {
			//remover a despesa

			let id = this.id.replace('id_despesa_', '')

			//alert(id)
			
			bd.remover(id)

			window.location.reload()
		}
		linha.insertCell(4).append(btn)

	})

}

// Pesquisa as informações cadastradas

function pesquisarDespesa() {

	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	let despesas = bd.pesquisar(despesa)

	carregarListaDespesas(despesas, true)

}


