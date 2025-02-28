// Elementos do DOM
const profilePhoto = document.getElementById('profilePhoto');
const photoInput = document.getElementById('photoInput');
const profileForm = document.getElementById('profileForm');
const editProfileBtn = document.getElementById('editProfileBtn');
const cancelEditBtn = document.getElementById('cancelEdit');
const notification = document.getElementById('notification');

// Estado do usuário
let userProfile = {
    name: 'Usuário',
    age: 25,
    weight: 70,
    height: 170,
    photo: null,
    goals: {
        weeklyWorkouts: {
            current: 4,
            target: 5
        },
        weeklyCalories: {
            current: 2450,
            target: 3000
        },
        targetWeight: {
            current: 72,
            target: 70
        }
    }
};

// Carregar dados do perfil
function loadProfile() {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        userProfile = JSON.parse(savedProfile);
        updateProfileDisplay();
        updateMetrics();
        updateGoals();
    }
}

// Salvar dados do perfil
function saveProfile() {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

// Atualizar display do perfil
function updateProfileDisplay() {
    // Foto
    if (userProfile.photo) {
        profilePhoto.src = userProfile.photo;
    }

    // Informações básicas
    document.getElementById('profileName').textContent = userProfile.name;
    document.getElementById('profileAge').textContent = userProfile.age;
    document.getElementById('profileWeight').textContent = `${userProfile.weight} kg`;
    document.getElementById('profileHeight').textContent = `${userProfile.height} cm`;

    // Formulário
    document.getElementById('userName').value = userProfile.name;
    document.getElementById('userAge').value = userProfile.age;
    document.getElementById('userWeight').value = userProfile.weight;
    document.getElementById('userHeight').value = userProfile.height;
}

// Atualizar métricas
function updateMetrics() {
    // Calcular IMC
    const bmi = calculateBMI(userProfile.weight, userProfile.height);
    const bmiCategory = getBMICategory(bmi);
    
    document.getElementById('bmiValue').textContent = bmi.toFixed(1);
    document.getElementById('bmiCategory').textContent = bmiCategory;
}

// Atualizar objetivos
function updateGoals() {
    // Treinos semanais
    updateGoalProgress('Treinos Semanais', 
        userProfile.goals.weeklyWorkouts.current,
        userProfile.goals.weeklyWorkouts.target);

    // Calorias
    updateGoalProgress('Calorias Queimadas',
        userProfile.goals.weeklyCalories.current,
        userProfile.goals.weeklyCalories.target);

    // Meta de peso
    updateGoalProgress('Meta de Peso',
        userProfile.goals.targetWeight.current,
        userProfile.goals.targetWeight.target);
}

// Atualizar progresso de um objetivo
function updateGoalProgress(goalName, current, target) {
    const cards = document.querySelectorAll('.goal-card');
    const card = Array.from(cards).find(card => 
        card.querySelector('h3').textContent === goalName);
    
    if (card) {
        const progress = Math.min(100, (current / target) * 100);
        const progressCircle = card.querySelector('.goal-progress');
        progressCircle.style.setProperty('--progress', progress);
        progressCircle.querySelector('.progress-value').textContent = `${Math.round(progress)}%`;
        card.querySelector('p').textContent = `${current} de ${target}`;
    }
}

// Calcular IMC
function calculateBMI(weight, height) {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
}

// Obter categoria do IMC
function getBMICategory(bmi) {
    if (bmi < 18.5) return 'Abaixo do peso';
    if (bmi < 25) return 'Peso normal';
    if (bmi < 30) return 'Sobrepeso';
    return 'Obesidade';
}

// Mostrar notificação
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.hidden = false;
    
    setTimeout(() => {
        notification.hidden = true;
    }, 3000);
}

// Event Listeners
photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            userProfile.photo = e.target.result;
            profilePhoto.src = e.target.result;
            saveProfile();
            showNotification('Foto atualizada com sucesso!');
        };
        reader.readAsDataURL(file);
    }
});

editProfileBtn.addEventListener('click', () => {
    profileForm.hidden = false;
});

cancelEditBtn.addEventListener('click', () => {
    profileForm.hidden = true;
    updateProfileDisplay();
});

profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    userProfile.name = document.getElementById('userName').value;
    userProfile.age = parseInt(document.getElementById('userAge').value);
    userProfile.weight = parseFloat(document.getElementById('userWeight').value);
    userProfile.height = parseInt(document.getElementById('userHeight').value);
    
    saveProfile();
    updateProfileDisplay();
    updateMetrics();
    
    profileForm.hidden = true;
    showNotification('Perfil atualizado com sucesso!');
});

// Inicialização
document.addEventListener('DOMContentLoaded', loadProfile);
