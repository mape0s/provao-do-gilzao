google.charts.load("current", { packages: ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

const tipos = ['Academica', 'Domestica', 'Fisica', 'Lazer'];

// ✔️ carregar do localStorage (ou vazio)
let registros = JSON.parse(localStorage.getItem('atividade') || '[]');

// ✔️ se não tiver nada, cria exemplo inicial
if (registros.length === 0) {
    registros = [
        { descricao: 'Exemplo', tipo: 'Academica', data: '2024-01-01' },
    ];
    localStorage.setItem('atividade', JSON.stringify(registros));
}

// ✔️ conta quantos registros de cada tipo existem
function contarTipo(tipo) {
    return registros.reduce((soma, r) => {
        return r.tipo === tipo ? soma + 1 : soma;
    }, 0);
}

// ✔️ desenha o gráfico
function drawChart() {

    const linhas = tipos.map(t => [t, contarTipo(t)]);

    const data = google.visualization.arrayToDataTable([
        ["Tipo", "Quantidade"],
        ...linhas
    ]);

    const options = {
        width: 500,
        height: 300,
        bar: { groupWidth: "40%" },
        legend: { position: "none" },
        vAxis: { minValue: 0 }
    };

    const chart = new google.visualization.ColumnChart(
        document.getElementById("columnchart_values")
    );

    chart.draw(data, options);
}

// ✔️ botão salvar novo registro
document.getElementById("btnSalvar").onclick = () => {

    const select = document.querySelector("#menu select");
    const tipoSelecionado = select.value;

    registros.push({
        descricao: tipoSelecionado,
        tipo: tipoSelecionado,
        data: new Date().toISOString().split('T')[0]
    });

    // salva corretamente no localStorage
    localStorage.setItem('atividade', JSON.stringify(registros));

    // redesenha o gráfico
    drawChart();
};

// ✔️ limitar data mínima no input
const inputData = document.getElementById("data");

if (inputData) {
    const hoje = new Date().toISOString().split("T")[0];
    inputData.min = hoje;
}