// --- Global Variables & PWA Service Worker Registration ---
// This enables offline capabilities and allows "Add to Home Screen"
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// --- DOM Element References ---
const registrationPage = document.getElementById('registration');
const registrationForm = document.getElementById('registrationForm');
const registrationMessage = document.getElementById('registrationMessage');
const mainAppContainer = document.querySelector('.main-app-container');

const hamburgerMenu = document.querySelector('.hamburger-menu');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const appIcons = document.querySelectorAll('.app-icon'); // For dashboard icons
const phoneTime = document.getElementById('phone-time');

// --- 1. Registration Page Logic ---
registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('email');
    const email = emailInput.value;

    if (email && email.includes('@') && email.includes('.')) {
        registrationMessage.textContent = 'Welcome, Demigod! Entering Camp Half-Blood...';
        registrationMessage.classList.remove('error');
        registrationMessage.classList.add('success');

        // Simulate a delay before transitioning
        setTimeout(() => {
            registrationPage.classList.add('hidden');
            mainAppContainer.classList.remove('hidden');
            showSection('dashboard'); // Go to the dashboard after registration
        }, 1500);
    } else {
        registrationMessage.textContent = 'Please enter a valid email address to proceed.';
        registrationMessage.classList.remove('success');
        registrationMessage.classList.add('error');
    }
});

// --- 2. Main App Navigation Logic ---
// Function to toggle mobile navigation
hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
    mainNav.classList.toggle('active');
});

// Function to show a specific section
function showSection(sectionId) {
    // Hide all sections
    contentSections.forEach(section => {
        section.classList.remove('active');
    });

    // Deactivate all nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        // Specific actions for sections
        if (sectionId === 'camphalfblood') {
            resetQuiz(); // Reset quiz when navigating to Camp Half-Blood
        } else if (sectionId === 'questboard') {
            loadQuests(); // Load quests when navigating to Quest Board
        } else if (sectionId === 'irismessage') {
            // No specific action needed, chat messages persist until refresh
        } else if (sectionId === 'campmap') {
            getGeolocation(); // Get location when navigating to Camp Map
        } else if (sectionId === 'arena') {
            startArenaChallenge(); // Start arena challenge
        }
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top of section
    }

    // Activate the corresponding nav link
    const activeNavLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
    if (activeNavLink) {
        activeNavLink.classList.add('active');
    }

    // Close mobile menu after selection
    if (mainNav.classList.contains('active')) {
        hamburgerMenu.classList.remove('active');
        mainNav.classList.remove('active');
    }
}

// Event listeners for navigation links (sidebar)
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        const sectionId = link.dataset.section;
        showSection(sectionId);
    });
});

// Event listeners for dashboard app icons
appIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        const sectionId = icon.dataset.action; // Use data-action to get target section
        showSection(sectionId);
    });
});

// Handle initial load (after registration, it will default to dashboard)
window.addEventListener('DOMContentLoaded', () => {
    // Initial state is registration page, so no section is active in main-app-container yet
    // The registration form submission will call showSection('dashboard')
});

// --- 3. Dashboard Phone Time Update ---
function updatePhoneTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    phoneTime.textContent = `${hours}:${minutes}`;
}
setInterval(updatePhoneTime, 1000); // Update every second
updatePhoneTime(); // Initial call

// --- 4. Camp Half-Blood: Godly Parent Quiz Logic ---
const quizQuestions = [
    {
        question: "When faced with a challenge, your first instinct is to...",
        options: [
            { text: "Formulate a detailed plan and strategy.", parent: "Athena" },
            { text: "Charge in headfirst, relying on strength and courage.", parent: "Ares" },
            { text: "Find the quickest and most efficient route around it.", parent: "Hermes" },
            { text: "Look for natural elements (water, earth) to assist you.", parent: "Poseidon" },
            { text: "Inspire others with your presence and leadership.", parent: "Zeus" }
        ]
    },
    {
        question: "What kind of talent comes most naturally to you?",
        options: [
            { text: "Athletics, combat, or physical prowess.", parent: "Ares" },
            { text: "Art, music, healing, or prophecy.", parent: "Apollo" },
            { text: "Strategy, invention, or learning new things.", parent: "Athena" },
            { text: "Diplomacy, charm, or making others feel good.", parent: "Aphrodite" },
            { text: "Building, crafting, or working with your hands.", parent: "Hephaestus" }
        ]
    },
    {
        question: "Which environment do you feel most at home in?",
        options: [
            { text: "The vastness of the sea or a quiet beach.", parent: "Poseidon" },
            { text: "A bustling city, full of opportunities.", parent: "Hermes" },
            { text: "A quiet library or a busy workshop.", parent: "Athena" },
            { text: "Deep underground, caves, or ancient places.", parent: "Hades" },
            { text: "The wilderness, forests, or open fields.", parent: "Artemis" }
        ]
    },
    {
        question: "Your ideal weapon would be:",
        options: [
            { text: "A powerful sword or spear.", parent: "Ares" },
            { text: "A bow and arrow, or a musical instrument.", parent: "Apollo" },
            { text: "A shield that can transform, or a cunning device.", parent: "Athena" },
            { text: "Anything that can control water or summon sea creatures.", parent: "Poseidon" },
            { text: "A simple dagger, easily concealed.", parent: "Hermes" }
        ]
    },
    {
        question: "What do you value most in a relationship?",
        options: [
            { text: "Passion and intense emotion.", parent: "Aphrodite" },
            { text: "Unwavering loyalty and protection.", parent: "Hera" },
            { text: "Shared wisdom and intellectual connection.", parent: "Athena" },
            { text: "Freedom and mutual understanding.", parent: "Artemis" },
            { text: "A grand adventure together.", parent: "Zeus" }
        ]
    }
];

const godlyParentsInfo = {
    "Zeus": { description: "You command the skies and lead with authority. You are ambitious, powerful, and a natural leader, but be wary of your temper.", cabin: "Cabin 1", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Jupiter_and_Thetis_by_Jean_Auguste_Dominique_Ingres.jpg/330px-Jupiter_and_Thetis_by_Jean_Auguste_Dominique_Ingres.jpg" },
    "Hera": { description: "While Hera has no demigod children, you embody her spirit of loyalty, family, and regality. You are protective and possess great dignity.", cabin: "Cabin 2 (Hera's Cabin - Honorary)", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Hera_%28Persephone%29_by_Albrecht_D%C3%BCrer.png/330px-Hera_%28Persephone%29_by_Albrecht_D%C3%BCrer.png" },
    "Poseidon": { description: "You are the son/daughter of the Sea God! You are powerful, sometimes moody, but deeply loyal and resourceful. Water is your domain.", cabin: "Cabin 3", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Statue-Zeus-Poseidon.jpg/330px-Statue-Zeus-Poseidon.jpg" },
    "Demeter": { description: "You are connected to the earth and cycles of nature. You are nurturing, practical, and appreciate the simple beauty of growth and harvest.", cabin: "Cabin 4", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Goddess_Demeter_Roman_Era_Istanbul_Archaeological_Museums.jpg/330px-Goddess_Demeter_Roman_Era_Istanbul_Archaeological_Museums.jpg" },
    "Ares": { description: "Conflict and strength define you. You are brave, assertive, and excel in combat, never shying away from a fight.", cabin: "Cabin 5", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Ares_Borghese_Louvre_MR302.jpg/330px-Ares_Borghese_Louvre_Ma302.jpg" },
    "Athena": { description: "Wisdom, strategy, and justice guide you. You are a brilliant tactician, an inventor, and always seek knowledge.", cabin: "Cabin 6", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Pallas_Athena_%28Gustav_Klimt%29.jpg/330px-Pallas_Athena_%28Gustav_Klimt%29.jpg" },
    "Apollo": { description: "You shine with talent in music, poetry, archery, and healing. You are optimistic, creative, and bring light wherever you go.", cabin: "Cabin 7", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Apollo-sculpture_Musei_Vaticani.jpg/330px-Apollo_sculpture_Musei_Vaticani.jpg" },
    "Artemis": { description: "While Artemis has no demigod children, you embody her independent, strong-willed, and fierce spirit. You are a skilled hunter and protector of nature.", cabin: "Cabin 8 (Artemis's Cabin - Honorary)", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Artemis_Versailles_MR_218.jpg/330px-Artemis_Versailles_MR_218.jpg" },
    "Hephaestus": { description: "You possess a talent for crafting, building, and invention. You are resourceful, persistent, and can find beauty in the unconventional.", cabin: "Cabin 9", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Hephaestus_Louvre_Ma312.jpg/330px-Hephaestus_Louvre_Ma312.jpg" },
    "Aphrodite": { description: "Beauty, charm, and love are your greatest assets. You are charismatic, can influence emotions, and have an eye for aesthetics.", cabin: "Cabin 10", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Aphrodite_of_Knidos_Altemps.jpg/330px-Aphrodite_of_Knidos_Altemps.jpg" },
    "Hermes": { description: "You are quick-witted, resourceful, and excel in communication and travel. You might be a trickster, but you're also incredibly adaptable.", cabin: "Cabin 11", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Hermes_Belvedere_pushkin_museum.jpg/330px-Hermes_Belvedere_pushkin_museum.jpg" },
    "Dionysus": { description: "You embrace life with exuberance and can inspire strong emotions. You are charismatic, enjoy celebration, and might have a mischievous side.", cabin: "Cabin 12", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Dionysos_Liebieghaus_202.jpg/330px-Dionysos_Liebieghaus_202.jpg" },
    "Hades": { description: "You are often misunderstood, but possess immense power over wealth and the underworld. You are independent, intense, and deeply loyal to those you care for.", cabin: "Cabin 13", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Hades_Altemps.jpg/330px-Hades_Altemps.jpg" },
    "Mortal (or Minor God)": { description: "Your destiny is still unfolding, or perhaps your godly parent is a mystery, or you're a powerful mortal ally!", cabin: "Hermes Cabin (Temporary)", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Question_mark_symbol.png/1200px-Question_mark_symbol.png" }
};


let currentQuestionIndex = 0;
let parentScores = {}; // To tally scores for each parent

const quizStartScreen = document.getElementById('quizStartScreen');
const quizQuestionScreen = document.getElementById('quizQuestionScreen');
const quizResultScreen = document.getElementById('quizResultScreen');
const startQuizButton = document.getElementById('startQuizButton');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const nextQuestionButton = document.getElementById('nextQuestionButton');
const resultParent = document.getElementById('resultParent');
const resultDescription = document.getElementById('resultDescription');
const cabinNumber = document.getElementById('cabinNumber');
const resultImage = document.getElementById('resultImage');
const restartQuizButton = document.getElementById('restartQuizButton');

function startQuiz() {
    quizStartScreen.classList.add('hidden');
    quizQuestionScreen.classList.remove('hidden');
    currentQuestionIndex = 0;
    parentScores = {}; // Reset scores for a new quiz
    loadQuestion();
    nextQuestionButton.classList.add('hidden'); // Hide next button until option is selected
}

function loadQuestion() {
    const questionData = quizQuestions[currentQuestionIndex];
    questionText.textContent = questionData.question;
    optionsContainer.innerHTML = '';
    optionsContainer.setAttribute('data-selected-index', '-1'); // Reset selected option

    questionData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classList.add('option-button');
        button.textContent = option.text;
        button.dataset.parent = option.parent;
        button.dataset.index = index; // Store index for selection tracking
        button.addEventListener('click', () => selectOption(button, index));
        optionsContainer.appendChild(button);
    });
}

function selectOption(selectedButton, selectedIndex) {
    // Disable all options and highlight selected
    const allOptions = optionsContainer.querySelectorAll('.option-button');
    allOptions.forEach(button => {
        button.classList.remove('selected');
        button.disabled = true; // Disable all options after selection
    });
    selectedButton.classList.add('selected');
    optionsContainer.setAttribute('data-selected-index', selectedIndex); // Mark selected

    // Tally score
    const parent = selectedButton.dataset.parent;
    parentScores[parent] = (parentScores[parent] || 0) + 1;

    nextQuestionButton.classList.remove('hidden'); // Show next button
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        loadQuestion();
        nextQuestionButton.classList.add('hidden'); // Hide next button again
    } else {
        showQuizResult();
    }
}

function showQuizResult() {
    quizQuestionScreen.classList.add('hidden');
    quizResultScreen.classList.remove('hidden');

    let finalParent = "Mortal (or Minor God)"; // Default if no clear match
    let maxScore = 0;

    // Determine the parent with the highest score
    for (const parent in parentScores) {
        if (parentScores[parent] > maxScore) {
            maxScore = parentScores[parent];
            finalParent = parent;
        } else if (parentScores[parent] === maxScore && parent !== finalParent) {
             // Tie-breaking: Can add more complex logic, for simplicity, first highest wins
             // or could list multiple parents in case of a tie.
             // For now, let's keep it simple: the first one encountered with max score wins.
        }
    }
    
    // If no questions were answered (e.g., quiz skipped somehow), default to mortal
    if (Object.keys(parentScores).length === 0) {
        finalParent = "Mortal (or Minor God)";
    }

    const parentInfo = godlyParentsInfo[finalParent] || godlyParentsInfo["Mortal (or Minor God)"];

    resultParent.textContent = `Your Godly Parent: ${finalParent}!`;
    resultDescription.textContent = parentInfo.description;
    cabinNumber.textContent = `You belong to ${parentInfo.cabin}!`;
    resultImage.src = parentInfo.image;
    resultImage.alt = finalParent;
}

function resetQuiz() {
    quizResultScreen.classList.add('hidden');
    quizStartScreen.classList.remove('hidden');
    currentQuestionIndex = 0;
    parentScores = {};
    nextQuestionButton.classList.add('hidden');
}

startQuizButton.addEventListener('click', startQuiz);
nextQuestionButton.addEventListener('click', nextQuestion);
restartQuizButton.addEventListener('click', resetQuiz);

// --- 5. Quest Board Logic ---
const newQuestInput = document.getElementById('newQuestInput');
const addQuestButton = document.getElementById('addQuestButton');
const questList = document.getElementById('questList');
const noQuestsMessage = document.getElementById('noQuestsMessage');

let quests = JSON.parse(localStorage.getItem('percyJacksonQuests')) || []; // Load from local storage

function saveQuests() {
    localStorage.setItem('percyJacksonQuests', JSON.stringify(quests));
}

function loadQuests() {
    questList.innerHTML = '';
    if (quests.length === 0) {
        noQuestsMessage.classList.remove('hidden');
    } else {
        noQuestsMessage.classList.add('hidden');
        quests.forEach((quest, index) => {
            renderQuestItem(quest, index);
        });
    }
}

function renderQuestItem(quest, index) {
    const listItem = document.createElement('li');
    listItem.classList.add('quest-item');
    if (quest.completed) {
        listItem.classList.add('completed');
    }
    listItem.dataset.index = index; // Store index for easy manipulation

    listItem.innerHTML = `
        <span>${quest.text}</span>
        <div class="quest-actions">
            <button class="complete-quest-btn" title="Mark as Complete">
                <i class="${quest.completed ? 'fas fa-check-circle' : 'far fa-circle'}"></i>
            </button>
            <button class="delete-quest-btn" title="Delete Quest">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;

    questList.appendChild(listItem);

    // Add event listeners for the new buttons
    listItem.querySelector('.complete-quest-btn').addEventListener('click', toggleQuestComplete);
    listItem.querySelector('.delete-quest-btn').addEventListener('click', deleteQuest);
}

function addQuest() {
    const questText = newQuestInput.value.trim();
    if (questText) {
        quests.push({ text: questText, completed: false });
        newQuestInput.value = '';
        saveQuests();
        loadQuests(); // Reload all quests to show the new one
    }
}

function toggleQuestComplete(e) {
    const listItem = e.target.closest('.quest-item');
    const index = parseInt(listItem.dataset.index);
    quests[index].completed = !quests[index].completed;
    saveQuests();
    loadQuests(); // Reload to update visual state
}

function deleteQuest(e) {
    const listItem = e.target.closest('.quest-item');
    const index = parseInt(listItem.dataset.index);
    quests.splice(index, 1); // Remove from array
    saveQuests();
    loadQuests(); // Reload to update list
}

addQuestButton.addEventListener('click', addQuest);
newQuestInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addQuest();
    }
});

// --- 6. Iris Message (Chat) Logic ---
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendMessageButton = document.getElementById('sendMessageButton');

function addChatMessage(message, type) {
    const messageBubble = document.createElement('div');
    messageBubble.classList.add('message-bubble', type);
    messageBubble.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(messageBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
}

function sendChatMessage() {
    const message = chatInput.value.trim();
    if (message) {
        addChatMessage(message, 'sent');
        chatInput.value = '';

        // Simulate a simple Oracle/AI response
        setTimeout(() => {
            let response = "The mist is thick, demigod. Your message is received.";
            if (message.toLowerCase().includes("percy")) {
                response = "Ah, Percy Jackson! A hero of many quests. What about him?";
            } else if (message.toLowerCase().includes("quest")) {
                response = "Quests await! Check the Quest Board for your next assignment.";
            } else if (message.toLowerCase().includes("hello")) {
                response = "Greetings, demigod. How may I assist your communication?";
            }
            addChatMessage(response, 'received');
        }, 1000); // Simulate network delay
    }
}

sendMessageButton.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
});

// --- 7. Camp Map (Geolocation) Logic ---
const currentLocationDisplay = document.getElementById('currentLocation');
const distanceToClassDisplay = document.getElementById('distanceToClass');
const directionToClassDisplay = document.getElementById('directionToClass');
const refreshLocationButton = document.getElementById('refreshLocationButton');

// Simulated Camp Half-Blood locations (approximate coordinates, for demo)
const campLocations = {
    'Arena': { lat: 38.9072, lon: -77.0369 }, // Washington D.C. for demo
    'Big House': { lat: 38.9000, lon: -77.0300 },
    'Dining Pavilion': { lat: 38.9100, lon: -77.0400 }
};

// Haversine formula to calculate distance between two lat/lon points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d;
}

// Function to get direction (simplified)
function getDirection(lat1, lon1, lat2, lon2) {
    if (lat2 > lat1 && lon2 > lon1) return "North-East";
    if (lat2 > lat1 && lon2 < lon1) return "North-West";
    if (lat2 < lat1 && lon2 > lon1) return "South-East";
    if (lat2 < lat1 && lon2 < lon1) return "South-West";
    if (lat2 === lat1 && lon2 > lon1) return "East";
    if (lat2 === lat1 && lon2 < lon1) return "West";
    if (lat2 > lat1 && lon2 === lon1) return "North";
    if (lat2 < lat1 && lon2 === lon1) return "South";
    return "Right here!";
}

function getGeolocation() {
    currentLocationDisplay.textContent = 'Fetching location...';
    distanceToClassDisplay.textContent = 'Calculating distance...';
    directionToClassDisplay.textContent = '';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            currentLocationDisplay.textContent = `Lat: ${userLat.toFixed(4)}, Lon: ${userLon.toFixed(4)}`;

            // Calculate distance to Arena (next class)
            const arenaLat = campLocations['Arena'].lat;
            const arenaLon = campLocations['Arena'].lon;

            const distanceMeters = calculateDistance(userLat, userLon, arenaLat, arenaLon);
            const distanceKm = (distanceMeters / 1000).toFixed(2); // Convert to km

            distanceToClassDisplay.textContent = `Distance to Arena: ${distanceKm} km`;
            directionToClassDisplay.textContent = `Direction: ${getDirection(userLat, userLon, arenaLat, arenaLon)}`;

        }, (error) => {
            console.error('Geolocation error:', error);
            let errorMessage = "Unable to retrieve your location.";
            if (error.code === error.PERMISSION_DENIED) {
                errorMessage = "Location access denied. Please enable it in your browser settings.";
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                errorMessage = "Location information is unavailable.";
            } else if (error.code === error.TIMEOUT) {
                errorMessage = "The request to get user location timed out.";
            }
            currentLocationDisplay.textContent = errorMessage;
            distanceToClassDisplay.textContent = '';
            directionToClassDisplay.textContent = '';
        });
    } else {
        currentLocationDisplay.textContent = 'Geolocation is not supported by your browser.';
        distanceToClassDisplay.textContent = '';
        directionToClassDisplay.textContent = '';
    }
}

refreshLocationButton.addEventListener('click', getGeolocation);


// --- 8. Oracle Cave (AI Assistant) Logic ---
const oracleConversation = document.getElementById('oracleConversation');
const oracleInput = document.getElementById('oracleInput');
const askOracleButton = document.getElementById('askOracleButton');
const oracleLoading = document.getElementById('oracleLoading');

function addOracleMessage(message, type) {
    const messageBubble = document.createElement('div');
    messageBubble.classList.add('oracle-message', type);
    messageBubble.innerHTML = `<p>${message}</p>`;
    oracleConversation.appendChild(messageBubble);
    oracleConversation.scrollTop = oracleConversation.scrollHeight; // Scroll to bottom
}

async function askOracle() {
    const userQuestion = oracleInput.value.trim();
    if (!userQuestion) return;

    addOracleMessage(userQuestion, 'sent');
    oracleInput.value = '';
    oracleLoading.classList.remove('hidden'); // Show loading indicator
    askOracleButton.disabled = true;

    try {
        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: userQuestion }] });
        const payload = { contents: chatHistory };
        const apiKey = ""; // Canvas will provide this at runtime

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const oracleResponse = result.candidates[0].content.parts[0].text;
            addOracleMessage(oracleResponse, 'received');
        } else {
            addOracleMessage("The mist is too thick, demigod. I cannot perceive an answer at this moment.", 'received');
            console.error('Unexpected API response structure:', result);
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        addOracleMessage("A disturbance in the mortal realm prevents my vision. Try again later.", 'received');
    } finally {
        oracleLoading.classList.add('hidden'); // Hide loading indicator
        askOracleButton.disabled = false;
    }
}

askOracleButton.addEventListener('click', askOracle);
oracleInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        askOracle();
    }
});


// --- 9. Arena (Combat Training / Gamified Quiz) Logic ---
const arenaScoreDisplay = document.getElementById('arenaScore');
const arenaLevelDisplay = document.getElementById('arenaLevel');
const monsterImage = document.getElementById('monsterImage');
const arenaQuestion = document.getElementById('arenaQuestion');
const arenaOptionsContainer = document.getElementById('arenaOptions');
const nextArenaChallengeButton = document.getElementById('nextArenaChallenge');
const arenaFeedback = document.getElementById('arenaFeedback');

let arenaScore = 0;
let arenaLevel = 1;
let currentArenaChallenge = null;

const arenaChallenges = [
    {
        type: 'identify',
        monster: 'Minotaur',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Minotaur_by_George_Frederic_Watts.jpg/330px-Minotaur_by_George_Frederic_Watts.jpg',
        question: "Identify this monster, known for its labyrinth.",
        options: ["Hydra", "Minotaur", "Gorgon", "Cyclops"],
        correct: "Minotaur",
        points: 50
    },
    {
        type: 'identify',
        monster: 'Hydra',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Hydra_by_Gustave_Moreau.jpg/330px-Hydra_by_Gustave_Moreau.jpg',
        question: "What monster grows two heads for every one cut off?",
        options: ["Chimera", "Sphinx", "Hydra", "Cerberus"],
        correct: "Hydra",
        points: 75
    },
    {
        type: 'strategy',
        monster: 'Medusa',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Caravaggio_-_Medusa.jpg/330px-Caravaggio_-_Medusa.jpg',
        question: "How do you defeat Medusa without looking at her?",
        options: ["Use a reflective shield", "Close your eyes and attack", "Blind her with sunlight", "Distract her with music"],
        correct: "Use a reflective shield",
        points: 100
    },
    {
        type: 'identify',
        monster: 'Cyclops',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Cyclops_by_Odilon_Redon.jpg/330px-Cyclops_by_Odilon_Redon.jpg',
        question: "This one-eyed giant is often a shepherd or blacksmith.",
        options: ["Centaur", "Satyr", "Cyclops", "Harpy"],
        correct: "Cyclops",
        points: 60
    }
];

// Labyrinth game state
const labyrinth = {
    progress: "Entrance",
    health: 100,
    inventory: [],
    scene: 0,
    scenes: [
        {
            title: "You stand at the entrance of the Labyrinth.",
            description: "Choose your path and prepare for adventure!",
            options: ["left", "right", "forward"],
            next: [1, 2, 3]
        },
        {
            title: "A fork in the path. The left tunnel is dark, the right glows faintly.",
            description: "Which way do you go?",
            options: ["left", "right"],
            next: ["monster", 4]
        },
        {
            title: "You find a locked door with a riddle inscribed.",
            description: "Solve the puzzle to proceed.",
            options: ["puzzle"],
            next: ["puzzle"]
        },
        {
            title: "A Minotaur blocks your way!",
            description: "Prepare for battle.",
            options: ["monster"],
            next: ["monster"]
        },
        {
            title: "You find a healing potion.",
            description: "You drink it and feel refreshed.",
            options: ["forward"],
            next: [5],
            effect: () => { labyrinth.health = Math.min(labyrinth.health + 30, 100); labyrinth.inventory.push("Healing Potion"); }
        },
        {
            title: "You see the exit! But a Sphinx asks you a final riddle.",
            description: "Solve it to escape.",
            options: ["puzzle"],
            next: ["victory"]
        }
    ],
    monsters: [
        {
            name: "Minotaur",
            image: "https://static.wikia.nocookie.net/greekmythology/images/7/7e/Minotaur.png",
            health: 40,
            attack: 20
        }
    ],
    puzzles: [
        // Maths
        {
            question: "Maths: What is the next number in the sequence? 2, 4, 8, 16, ...",
            answer: "32"
        },
        // Physics
        {
            question: "Physics: What is the SI unit of electric current?",
            answer: "ampere"
        },
        // Chemistry
        {
            question: "Chemistry: What is H2SO4 commonly known as?",
            answer: "sulfuric acid"
        },
        // English Literature
        {
            question: "English Literature: Who wrote 'To be, or not to be'?",
            answer: "shakespeare"
        },
        // AIML
        {
            question: "AIML: What does 'ML' stand for in AIML?",
            answer: "machine learning"
        },
        // DSA
        {
            question: "DSA: Which data structure uses FIFO order?",
            answer: "queue"
        },
        // Twisted Riddle
        {
            question: "Twisted: I am not alive, but I grow. I don't have lungs, but I need air. What am I?",
            answer: "fire"
        }
    ]
};

let currentMonster = null;
let currentPuzzle = null;

// DOM elements
const progressEl = document.getElementById("labyrinthProgress");
const healthEl = document.getElementById("labyrinthHealth");
const inventoryEl = document.getElementById("labyrinthInventory");
const sceneTitleEl = document.getElementById("sceneTitle");
const sceneDescEl = document.getElementById("sceneDescription");
const sceneOptionsEl = document.getElementById("sceneOptions");
const labyrinthSceneEl = document.getElementById("labyrinthScene");
const labyrinthPuzzleEl = document.getElementById("labyrinthPuzzle");
const puzzleQuestionEl = document.getElementById("puzzleQuestion");
const puzzleOptionsEl = document.getElementById("puzzleOptions");
const submitPuzzleBtn = document.getElementById("submitPuzzleAnswer");
const puzzleFeedbackEl = document.getElementById("puzzleFeedback");
const labyrinthBattleEl = document.getElementById("labyrinthBattle");
const monsterImageEl = document.getElementById("monsterImage");
const battleDescEl = document.getElementById("battleDescription");
const battleFeedbackEl = document.getElementById("battleFeedback");
const labyrinthVictoryEl = document.getElementById("labyrinthVictory");
const restartLabyrinthBtn = document.getElementById("restartLabyrinth");

// Utility functions
function updateDashboard() {
    progressEl.textContent = labyrinth.progress;
    healthEl.textContent = labyrinth.health;
    inventoryEl.textContent = labyrinth.inventory.length ? labyrinth.inventory.join(", ") : "None";
}

function showScene(index) {
    labyrinthSceneEl.classList.remove("hidden");
    labyrinthPuzzleEl.classList.add("hidden");
    labyrinthBattleEl.classList.add("hidden");
    labyrinthVictoryEl.classList.add("hidden");

    labyrinth.scene = index;
    const scene = labyrinth.scenes[index];
    sceneTitleEl.textContent = scene.title;
    sceneDescEl.textContent = scene.description;
    sceneOptionsEl.innerHTML = "";

    if (scene.effect) scene.effect();

    scene.options.forEach((opt, i) => {
        let btn = document.createElement("button");
        btn.className = "cta-button";
        btn.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
        btn.onclick = () => choosePath(opt);
        sceneOptionsEl.appendChild(btn);
    });

    updateDashboard();
}

function choosePath(option) {
    const scene = labyrinth.scenes[labyrinth.scene];
    const next = scene.next[scene.options.indexOf(option)];

    if (next === "monster") {
        startBattle(labyrinth.monsters[0]);
    } else if (next === "puzzle") {
        // Pick a random puzzle each time
        const randomPuzzle = labyrinth.puzzles[Math.floor(Math.random() * labyrinth.puzzles.length)];
        startPuzzle(randomPuzzle);
    } else if (next === "victory") {
        showVictory();
    } else if (typeof next === "number") {
        labyrinth.progress = `Room ${next + 1}`;
        showScene(next);
    }
}

function startBattle(monster) {
    labyrinthSceneEl.classList.add("hidden");
    labyrinthBattleEl.classList.remove("hidden");
    labyrinthPuzzleEl.classList.add("hidden");
    labyrinthVictoryEl.classList.add("hidden");

    currentMonster = { ...monster };
    monsterImageEl.src = monster.image;
    battleDescEl.textContent = `A wild ${monster.name} appears!`;
    battleFeedbackEl.textContent = "";
    updateDashboard();
}

window.fightMonster = function() {
    // Player attacks monster
    currentMonster.health -= 30;
    if (currentMonster.health <= 0) {
        battleFeedbackEl.textContent = `You defeated the ${currentMonster.name}!`;
        setTimeout(() => {
            labyrinth.progress = "After Battle";
            showScene(labyrinth.scene + 1);
        }, 1200);
    } else {
        // Monster attacks player
        labyrinth.health -= currentMonster.attack;
        battleFeedbackEl.textContent = `You hit the ${currentMonster.name}! It attacks back!`;
        updateDashboard();
        if (labyrinth.health <= 0) {
            battleFeedbackEl.textContent = "You have been defeated! Try again.";
            setTimeout(restartLabyrinth, 1500);
        }
    }
};

window.runAway = function() {
    battleFeedbackEl.textContent = "You escaped, but lost your way!";
    setTimeout(() => {
        restartLabyrinth();
    }, 1200);
};

function startPuzzle(puzzle) {
    labyrinthSceneEl.classList.add("hidden");
    labyrinthBattleEl.classList.add("hidden");
    labyrinthPuzzleEl.classList.remove("hidden");
    labyrinthVictoryEl.classList.add("hidden");

    currentPuzzle = puzzle;
    puzzleQuestionEl.textContent = puzzle.question;
    puzzleOptionsEl.innerHTML = `<input type="text" id="puzzleAnswerInput" placeholder="Your answer...">`;
    puzzleFeedbackEl.textContent = "";
    updateDashboard();
}

// When moving to a puzzle scene, pick a random puzzle:
function choosePath(option) {
    const scene = labyrinth.scenes[labyrinth.scene];
    const next = scene.next[scene.options.indexOf(option)];

    if (next === "monster") {
        startBattle(labyrinth.monsters[0]);
    } else if (next === "puzzle") {
        // Pick a random puzzle each time
        const randomPuzzle = labyrinth.puzzles[Math.floor(Math.random() * labyrinth.puzzles.length)];
        startPuzzle(randomPuzzle);
    } else if (next === "victory") {
        showVictory();
    } else if (typeof next === "number") {
        labyrinth.progress = `Room ${next + 1}`;
        showScene(next);
    }
}

function submitPuzzle() {
    const answerInput = document.getElementById("puzzleAnswerInput");
    if (!answerInput) return;
    const userAnswer = answerInput.value.trim().toLowerCase();
    if (userAnswer === currentPuzzle.answer) {
        puzzleFeedbackEl.textContent = "Correct! The door opens.";
        setTimeout(() => {
            labyrinth.progress = "Puzzle Solved";
            showScene(labyrinth.scene + 1);
        }, 1200);
    } else {
        puzzleFeedbackEl.textContent = "Incorrect. Try again!";
    }
}

function showVictory() {
    labyrinthSceneEl.classList.add("hidden");
    labyrinthBattleEl.classList.add("hidden");
    labyrinthPuzzleEl.classList.add("hidden");
    labyrinthVictoryEl.classList.remove("hidden");
    updateDashboard();
}

function restartLabyrinth() {
    labyrinth.progress = "Entrance";
    labyrinth.health = 100;
    labyrinth.inventory = [];
    labyrinth.scene = 0;
    showScene(0);
}

// Restart button
if (restartLabyrinthBtn) {
    restartLabyrinthBtn.onclick = restartLabyrinth;
}

// Initialize game on page load
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("arena")) {
        restartLabyrinth();
    }
});

// --- 10. Back to Top Button ---
const backToTopBtn = document.getElementById('backToTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) { // Show button after scrolling 300px
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Smooth scroll to top
    });
});

// --- Initial Load & Setup ---
document.addEventListener('DOMContentLoaded', () => {
    // Hide main app container initially, registration page is active
    mainAppContainer.classList.add('hidden');
    registrationPage.classList.remove('hidden'); // Ensure registration is visible

    updateArenaDashboard(); // Initialize arena dashboard
});
