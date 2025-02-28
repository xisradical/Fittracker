// Função para agrupar exercícios por data e nome
function groupExercises(exercises) {
    const groupedByDate = {};
    
    exercises.forEach(exercise => {
        if (!groupedByDate[exercise.date]) {
            groupedByDate[exercise.date] = {};
        }
        
        if (!groupedByDate[exercise.date][exercise.name]) {
            groupedByDate[exercise.date][exercise.name] = {
                series: 0,
                reps: exercise.reps,
                total: 0
            };
        }
        
        groupedByDate[exercise.date][exercise.name].series += exercise.sets;
        groupedByDate[exercise.date][exercise.name].total += exercise.total;
    });
    
    return groupedByDate;
}

// Função para formatar a data
function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

// Função para atualizar o relatório
function updateReport() {
    const dailyReports = document.getElementById('dailyReports');
    const exercises = JSON.parse(localStorage.getItem('exercises')) || [];
    const groupedExercises = groupExercises(exercises);
    
    // Ordena as datas em ordem decrescente
    const sortedDates = Object.keys(groupedExercises).sort((a, b) => 
        new Date(b) - new Date(a)
    );
    
    dailyReports.innerHTML = '';
    
    sortedDates.forEach(date => {
        const exercisesByDate = groupedExercises[date];
        const reportSection = document.createElement('section');
        reportSection.className = 'daily-report';
        
        const dateHeader = document.createElement('h2');
        dateHeader.innerHTML = `<i class="fas fa-calendar"></i> ${formatDate(date)}`;
        reportSection.appendChild(dateHeader);
        
        const exerciseList = document.createElement('ul');
        exerciseList.className = 'exercise-summary';
        
        Object.entries(exercisesByDate).forEach(([name, data]) => {
            const exerciseItem = document.createElement('li');
            exerciseItem.innerHTML = `
                <strong>${name}</strong> - 
                ${data.series} séries de ${data.reps} - 
                total <span class="total-highlight">${data.total}</span>
            `;
            exerciseList.appendChild(exerciseItem);
        });
        
        reportSection.appendChild(exerciseList);
        dailyReports.appendChild(reportSection);
    });
}

// Inicializa o relatório quando a página carregar
document.addEventListener('DOMContentLoaded', updateReport);
