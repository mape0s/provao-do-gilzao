let registros = [];

google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(iniciar);

function iniciar() {
    Data();
    Eventos();
    render();
}

function Data() {
    const hoje = new Date().toISOString().split("T")[0];
    document.getElementById('data').min = hoje;
}

function Eventos() {
    document.getElementById('btnSalvar').onclick = salvar;
    document.getElementById('filtroTipo').onchange = render;
    document.getElementById('chkPend').onchange = render;
    document.getElementById('chkDone').onchange = render;
}

function salvar() {
    let desc = document.getElementById('descricao').value;
    let tipo = document.getElementById('tipoTarefa').value;
    let data = document.getElementById('data').value;

    if (desc == '' || data == '') {
        alert('Preencha todos os campos.');
        return;
    }

    registros.push({ id: Date.now(), descricao: desc, tipo: tipo, data: data, feita: false });
    document.getElementById('descricao').value = '';
    document.getElementById('data').value = '';
    render();
}

function finalizar(id) {
    for (let i = 0; i < registros.length; i++) {
        if (registros[i].id == id) {
            registros[i].feita = !registros[i].feita;
        }
    }
    render();
}

function remover(id) {
    registros = registros.filter(function(r) {
        return r.id != id;
    });
    render();
}

function render() {
    let pendentes   = registros.reduce(function(acc, r) { return acc + (!r.feita ? 1 : 0); }, 0);
    let finalizadas = registros.reduce(function(acc, r) { return acc + (r.feita ? 1 : 0); }, 0);
    document.getElementById('pendente').textContent   = pendentes;
    document.getElementById('finalizado').textContent = finalizadas;
    document.getElementById('Total').textContent      = registros.length;

    let academica = 0, fisica = 0, domestica = 0, lazer = 0;
    for (let i = 0; i < registros.length; i++) {
        if (registros[i].tipo == 'Academica') academica++;
        if (registros[i].tipo == 'Fisica') fisica++;
        if (registros[i].tipo == 'Domestica') domestica++;
        if (registros[i].tipo == 'Lazer') lazer++;
    }

    let data = google.visualization.arrayToDataTable([
        ['Tipo', 'Quantidade'],
        ['Academica', academica],
        ['Fisica',    fisica],
        ['Domestica', domestica],
        ['Lazer',     lazer]
    ]);

    let chart = new google.visualization.ColumnChart(document.getElementById('columnchart_values'));
    chart.draw(data, {
        legend: { position: 'none' },
        vAxis: { minValue: 0, viewWindow: { min: 0 } },
        colors: ['#8a2be2']
    });

    let filtroTipo = document.getElementById('filtroTipo').value;
    let chkPend = document.getElementById('chkPend').checked;
    let chkDone = document.getElementById('chkDone').checked;

    let lista = registros.filter(function(r) {
        let tipoOk = (filtroTipo == 'Todos') || (r.tipo == filtroTipo);
        let statusOk = (r.feita && chkDone) || (!r.feita && chkPend);
        return tipoOk && statusOk;
    });

    let linhas = lista.map(function(r) {
        let partes = r.data.split('-');
        let dia  = partes[2];
        let mes  = partes[1];
        let ano  = partes[0];
        let dataFormatada = dia + '/' + mes + '/' + ano;

        let checked = '';
        if (r.feita == true) {
            checked = 'checked';
        }

        let estilo = '';
        if (r.feita == true) {
            estilo = 'style="text-decoration: line-through;"';
        }

        let linha = '<tr>';
        linha = linha + '<td ' + estilo + '>' + r.descricao + '</td>';
        linha = linha + '<td ' + estilo + '>' + r.tipo + '</td>';
        linha = linha + '<td ' + estilo + '>' + dataFormatada + '</td>';
        linha = linha + '<td>';
        linha = linha + '<input type="checkbox" class="check-table" ' + checked + ' onchange="finalizar(' + r.id + ')" id = "abc">';
        linha = linha + '<button class="btn-lixeira" onclick="remover(' + r.id + ')"><i class="material-icons">delete</i></button>';
        linha = linha + '</td>';
        linha = linha + '</tr>';
        return linha;
    });

    document.getElementById('tabela-tipo').innerHTML = linhas.join('');
}