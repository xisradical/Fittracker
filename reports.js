// Estado da aplicação
let exerciseData = {
    exercises: [],
    currentPeriod: 'week',
    currentChartType: 'reps'
};

// Elementos do DOM
const elements = {
    exerciseReport: document.getElementById('exerciseReport')
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadExercises();
    updateReport();
});

// Funções de Dados
function loadExercises() {
    const saved = localStorage.getItem('exercises');
    if (saved) {
        exerciseData.exercises = JSON.parse(saved);
    }
}

// Função para formatar a data
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
}

// Função para obter o ícone do exercício
function getExerciseIcon(name) {
    const icons = {
        'Polichinelo': 'fa-person-running',
        'Flexão': 'fa-child',
        'Agachamento': 'fa-dumbbell',
        'Barra': 'fa-arrow-up-from-bracket',
        'Abdominais': 'fa-person',
        'Escaladas': 'fa-mountain',
        'Ab. Remada': 'fa-person-swimming',
        'Prancha': 'fa-rectangle-horizontal',
        'Levantamento Lateral': 'fa-dumbbell',
        'Levantamento Frontal': 'fa-dumbbell',
        'Levantamento Superior': 'fa-dumbbell',
        'Trapézio': 'fa-dumbbell',
        'Alternado': 'fa-dumbbell'
    };
    return icons[name] || 'fa-dumbbell';
}

function updateReport() {
    const exerciseReport = document.getElementById('exerciseReport');
    if (!exerciseReport) return;

    // Carregar exercícios diretamente do localStorage
    const exercises = JSON.parse(localStorage.getItem('exercises')) || [];

    // Agrupar exercícios por data
    const exercisesByDate = {};
    exercises.forEach(exercise => {
        const date = exercise.date.split('T')[0];
        if (!exercisesByDate[date]) {
            exercisesByDate[date] = {};
        }
        if (!exercisesByDate[date][exercise.name]) {
            exercisesByDate[date][exercise.name] = {
                totalSets: 0,
                totalReps: 0
            };
        }
        exercisesByDate[date][exercise.name].totalSets += parseInt(exercise.sets);
        exercisesByDate[date][exercise.name].totalReps += parseInt(exercise.sets) * parseInt(exercise.reps);
    });

    // Limpar tabela atual
    exerciseReport.innerHTML = '';

    // Ordenar datas em ordem decrescente
    const sortedDates = Object.keys(exercisesByDate).sort((a, b) => new Date(b) - new Date(a));

    // Criar HTML para cada data
    sortedDates.forEach((date, index) => {
        const dateId = `date-${date.replace(/[^0-9]/g, '')}`;
        const isFirst = index === 0;

        // Calcular totais para esta data
        const dayTotals = Object.values(exercisesByDate[date]).reduce((acc, curr) => {
            acc.sets += curr.totalSets;
            acc.reps += curr.totalReps;
            return acc;
        }, { sets: 0, reps: 0 });

        // Criar cabeçalho da data
        const dateHeader = document.createElement('tr');
        dateHeader.className = 'date-header';
        dateHeader.innerHTML = `
            <td colspan="3" class="date-title">
                <button class="date-toggle ${isFirst ? 'expanded' : ''}" data-target="${dateId}">
                    <i class="fas fa-chevron-right toggle-icon"></i>
                    <i class="fas fa-calendar"></i>
                    ${formatDate(date)}
                    <span class="date-summary">
                        (${dayTotals.sets} séries, ${dayTotals.reps} repetições totais)
                    </span>
                </button>
            </td>
        `;
        exerciseReport.appendChild(dateHeader);

        // Criar container para os exercícios
        const exercisesContainer = document.createElement('tbody');
        exercisesContainer.id = dateId;
        exercisesContainer.className = 'exercise-group';
        if (!isFirst) {
            exercisesContainer.style.display = 'none';
        }

        // Adicionar exercícios da data
        Object.entries(exercisesByDate[date]).forEach(([exerciseName, stats]) => {
            const row = document.createElement('tr');
            row.className = 'exercise-row';
            row.innerHTML = `
                <td>
                    <i class="fas ${getExerciseIcon(exerciseName)}"></i>
                    ${exerciseName}
                </td>
                <td>${stats.totalSets} séries</td>
                <td>${stats.totalReps} repetições</td>
            `;
            exercisesContainer.appendChild(row);
        });

        exerciseReport.appendChild(exercisesContainer);
    });

    // Adicionar event listeners para os botões de toggle
    document.querySelectorAll('.date-toggle').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            const targetBody = document.getElementById(targetId);
            const isExpanded = this.classList.contains('expanded');
            
            if (isExpanded) {
                this.classList.remove('expanded');
                targetBody.style.display = 'none';
            } else {
                this.classList.add('expanded');
                targetBody.style.display = '';
            }
        });
    });
}
