// Elementos do DOM
const activityForm = document.getElementById('activityForm');
const exerciseName = document.getElementById('exerciseName');
const reps = document.getElementById('reps');
const sets = document.getElementById('sets');
const totalReps = document.getElementById('totalReps');
const date = document.getElementById('date');
const activitiesTableBody = document.getElementById('activitiesTableBody');

// Array para armazenar os exercícios
// Exercise defaults with reps and sets
const exerciseDefaults = {
    'Polichinelo': { reps: 100, sets: 1 },
    'Flexão': { reps: 10, sets: 1 },
    'Agachamento': { reps: 20, sets: 1 },
    'Barra': { reps: 5, sets: 1 },
    'Abdominais': { reps: 30, sets: 1 },
    'Escaladas': { reps: 20, sets: 1 },
    'Ab. Remada': { reps: 20, sets: 1 },
    'Prancha': { reps: 30, sets: 1 },
    'Levantamento Lateral': { reps: 15, sets: 1 },
    'Levantamento Frontal': { reps: 15, sets: 1 },
    'Levantamento Superior': { reps: 15, sets: 1 },
    'Trapézio': { reps: 15, sets: 1 },
    'Alternado': { reps: 15, sets: 1 },
    '6 Steps': { reps: 5, sets: 1 },
    'CC': { reps: 5, sets: 1 },
    'Hulk': { reps: 5, sets: 1 },
    '3 Steps': { reps: 5, sets: 1 }
};

// Load saved exercises from localStorage
let exercises = JSON.parse(localStorage.getItem('exercises')) || [];

// Initialize when DOM is loaded
let customExercises = JSON.parse(localStorage.getItem('customExercises')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Setup predefined exercise delete buttons
    const predefinedExercises = document.querySelectorAll('.category:not(#categoryCustom) li');
    predefinedExercises.forEach(item => {
        const exerciseName = item.querySelector('.exercise-name');
        exerciseName.addEventListener('click', handleExerciseClick);
        
        const deleteBtn = item.querySelector('.btn-delete-exercise');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Tem certeza que deseja excluir este exercício?')) {
                    const exerciseName = item.querySelector('.exercise-name').textContent;
                    delete exerciseDefaults[exerciseName];
                    item.remove();
                }
            });
        }
    });

    // Setup custom exercises
    const addNewExerciseBtn = document.getElementById('addNewExercise');
    const newExerciseName = document.getElementById('newExerciseName');
    const newExerciseReps = document.getElementById('newExerciseReps');

    addNewExerciseBtn.addEventListener('click', () => {
        if (newExerciseName.value && newExerciseReps.value) {
            // Create new exercise
            const customExercise = {
                name: newExerciseName.value,
                reps: parseInt(newExerciseReps.value)
            };
            
            // Add to custom exercises
            customExercises.push(customExercise);
            localStorage.setItem('customExercises', JSON.stringify(customExercises));
            
            // Add to exercise defaults
            exerciseDefaults[customExercise.name] = {
                reps: customExercise.reps,
                sets: 1
            };

            // Update custom exercises list
            updateCustomExercisesList();

            // Clear inputs
            newExerciseName.value = '';
            newExerciseReps.value = '';
        }
    });

    // Load existing custom exercises
    updateCustomExercisesList();

    // Display saved exercises
    updateExerciseTable();
});

function updateCustomExercisesList() {
    const customExercisesList = document.getElementById('customExercisesList');
    if (!customExercisesList) return;

    customExercisesList.innerHTML = '';
    
    customExercises.forEach(exercise => {
        const li = document.createElement('li');
        li.dataset.exercise = exercise.name;
        li.innerHTML = `
            <span class="exercise-name">${exercise.name}</span>
            <button class="btn-delete-exercise">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        // Add click event for exercise selection
        li.querySelector('.exercise-name').addEventListener('click', handleExerciseClick);
        
        // Add click event for delete button
        li.querySelector('.btn-delete-exercise').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent exercise selection when clicking delete
            if (confirm('Tem certeza que deseja excluir este exercício personalizado?')) {
                // Remove from customExercises array
                customExercises = customExercises.filter(e => e.name !== exercise.name);
                localStorage.setItem('customExercises', JSON.stringify(customExercises));
                
                // Remove from exerciseDefaults
                delete exerciseDefaults[exercise.name];
                
                // Update the list
                updateCustomExercisesList();
            }
        });
        
        customExercisesList.appendChild(li);
    });
}

// Handle exercise click
function handleExerciseClick(e) {
    const exerciseName = e.target.textContent;
    const defaults = exerciseDefaults[exerciseName] || { reps: 10, sets: 1 }; // Default fallback also with sets: 1
    
    // Create new exercise entry
    const exercise = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        name: exerciseName,
        reps: defaults.reps,
        sets: defaults.sets,
        total: defaults.reps * defaults.sets
    };

    // Add to exercises array
    exercises.unshift(exercise);
    localStorage.setItem('exercises', JSON.stringify(exercises));
    
    // Update table
    updateExerciseTable();

    // Visual feedback
    e.target.style.backgroundColor = 'var(--primary-color)';
    e.target.style.color = 'white';
    setTimeout(() => {
        e.target.style.backgroundColor = '';
        e.target.style.color = '';
    }, 200);
}

// Update exercise table
function updateExerciseTable() {
    const tbody = document.getElementById('activitiesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    exercises.forEach(exercise => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(exercise.date)}</td>
            <td>${exercise.name}</td>
            <td>${exercise.reps}</td>
            <td>${exercise.sets}</td>
            <td>${exercise.total}</td>
            <td>
                <button onclick="deleteExercise(${exercise.id})" class="btn-delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Delete exercise
function deleteExercise(id) {
    if (confirm('Tem certeza que deseja excluir este exercício?')) {
        exercises = exercises.filter(exercise => exercise.id !== id);
        localStorage.setItem('exercises', JSON.stringify(exercises));
        updateExerciseTable();
    }
}

// Format date to Brazilian format
function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

// Calcula o total de repetições quando os valores mudam
function updateTotalReps() {
    const repsValue = parseInt(reps.value) || 0;
    const setsValue = parseInt(sets.value) || 0;
    totalReps.textContent = repsValue * setsValue;
}

// Adiciona os event listeners
reps.addEventListener('input', updateTotalReps);
sets.addEventListener('input', updateTotalReps);



// Manipula o envio do formulário
activityForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (exerciseName.value) {
        const exercise = {
            id: Date.now(),
            name: exerciseName.value,
            reps: parseInt(reps.value),
            sets: parseInt(sets.value),
            total: parseInt(reps.value) * parseInt(sets.value),
            date: date.value
        };
        
        exercises.push(exercise);
        localStorage.setItem('exercises', JSON.stringify(exercises));
        updateExerciseTable();
        
        // Reseta os campos mantendo o exercício e a data
        reps.value = exerciseDefaults[exerciseName.value]?.reps || '';
        sets.value = '1';
        totalReps.textContent = '0';
        date.valueAsDate = new Date();
        reps.focus();
        reps.select();
    }
});
