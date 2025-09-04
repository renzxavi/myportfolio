/* Archivo script.js completo y consolidado */

document.addEventListener('DOMContentLoaded', () => {
  // --- Lógica del "proyector" de pantalla y música ---
  const heroImg = document.querySelector('.hero-img');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const progressBar = document.getElementById('progressBar');
  const mobileScreen = document.getElementById('mobileScreen');
  const body = document.body;
  const timeDisplay = document.querySelector('.phone-status-bar span');
  const backwardBtn = document.querySelector('.fa-backward');
  const forwardBtn = document.querySelector('.fa-forward');
  const songTitleDisplay = document.querySelector('.song-title');
  const artistNameDisplay = document.querySelector('.artist-name');
  const albumCoverImg = document.querySelector('.album-cover img');
  const navButtons = document.querySelectorAll('.nav-button');
  const lockScreenOverlay = document.getElementById('lockScreenOverlay');
  const audio = new Audio();
  let isMusicPlaying = false;

  const playlist = [
    { title: 'Something Just Like This', artist: 'Coldplay', src: 'assets/sound/audio.mp3', cover: 'assets/img/coldplay.png' },
    { title: 'Unstoppable', artist: 'Sia', src: 'assets/sound/audio2.mp3', cover: 'assets/img/sia.jpeg' },
    { title: 'The Sound Of Silence', artist: 'Disturbed', src: 'assets/sound/audio3.mp3', cover: 'assets/img/disturbed.jpg' },
    { title: 'Barbie Girl', artist: 'Aqua', src: 'assets/sound/audio4.mp3', cover: 'assets/img/agua.png' },
    { title: 'Red Hot Chili Peppers', artist: 'Scar Tissue', src: 'assets/sound/audio5.mp3', cover: 'assets/img/red.jpg' }
  ];
  let currentTrackIndex = 0;

  function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    timeDisplay.textContent = `${hours}:${minutes}`;
  }

  function loadTrack(trackIndex) {
    const track = playlist[trackIndex];
    audio.src = track.src;
    songTitleDisplay.textContent = track.title;
    artistNameDisplay.textContent = track.artist;
    albumCoverImg.src = track.cover;
    audio.load();
  }

  function playMusic() {
    audio.play().then(() => {
      isMusicPlaying = true;
      playPauseBtn.classList.remove('fa-play');
      playPauseBtn.classList.add('fa-pause');
    }).catch(error => {
      console.error("Autoplay failed:", error);
    });
  }

  function pauseMusic() {
    audio.pause();
    isMusicPlaying = false;
    playPauseBtn.classList.remove('fa-pause');
    playPauseBtn.classList.add('fa-play');
  }

  function forwardTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    playMusic();
  }

  function backwardTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    playMusic();
  }

  audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progress}%`;
  });

  audio.addEventListener('ended', () => {
    forwardTrack();
  });

  playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  });

  backwardBtn.addEventListener('click', () => {
    backwardTrack();
  });

  forwardBtn.addEventListener('click', () => {
    forwardTrack();
  });

  // --- Lógica general de modales ---
  function hideAllModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
      modal.classList.remove('visible');
      modal.style.display = 'none';
    });
  }

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;

      navButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      hideAllModals();

      if (target === 'gallery') {
        galleryModal.style.display = 'flex';
        galleryModal.classList.add('visible');
      } else if (target === 'contact') {
        contactModal.style.display = 'flex';
        contactModal.classList.add('visible');
      } else if (target === 'notifications') {
        notificationsModal.style.display = 'flex';
        notificationsModal.classList.add('visible');
      }
    });
  });

  // --- Lógica de la aplicación de notas ---
  const notesAppBtn = document.getElementById('notesAppBtn');
  const notesModal = document.getElementById('notesModal');
  const closeNotesModalBtns = notesModal.querySelectorAll('.close-modal-btn');
  const noteInput = document.getElementById('noteInput');
  const saveNoteBtn = document.getElementById('saveNoteBtn');
  const notesList = document.getElementById('notesList');

  function saveNotes(notes) {
    localStorage.setItem('my_notes', JSON.stringify(notes));
  }

  function loadNotes() {
    let notes = localStorage.getItem('my_notes');
    notes = notes ? JSON.parse(notes) : [];
    const defaultNotes = [
      'I can do it 💪💪💪',
      'Tomorrow’s plan: study English. Brain’s plan: nap 🚀🧠'
    ];
    defaultNotes.forEach(noteToAdd => {
      if (!notes.includes(noteToAdd)) {
        notes.push(noteToAdd);
      }
    });
    saveNotes(notes);
    return notes;
  }

  function renderNotes() {
    notesList.innerHTML = '';
    const notes = loadNotes();
    notes.forEach((note, index) => {
      const noteItem = document.createElement('div');
      noteItem.classList.add('note-item');
      noteItem.innerHTML = `<p>${note}</p><button class="delete-note-btn" data-index="${index}">&times;</button>`;
      notesList.prepend(noteItem);
    });
  }

  notesAppBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllModals();
    notesModal.style.display = 'flex';
    notesModal.classList.add('visible');
    renderNotes();
  });

  closeNotesModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      notesModal.classList.remove('visible');
      notesModal.style.display = 'none';
    });
  });

  saveNoteBtn.addEventListener('click', () => {
    const newNote = noteInput.value.trim();
    if (newNote) {
      const notes = loadNotes();
      notes.push(newNote);
      saveNotes(notes);
      noteInput.value = '';
      renderNotes();
    }
  });

  notesList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-note-btn')) {
      const index = e.target.dataset.index;
      const notes = loadNotes();
      notes.splice(index, 1);
      saveNotes(notes);
      renderNotes();
    }
  });

  notesModal.addEventListener('click', (e) => {
    if (e.target === notesModal) {
      notesModal.classList.remove('visible');
      notesModal.style.display = 'none';
    }
  });

  // --- Lógica de la aplicación de galería ---
  const galleryAppBtn = document.getElementById('galleryAppBtn');
  const galleryModal = document.getElementById('galleryModal');
  const closeGalleryModalBtn = galleryModal.querySelector('.close-modal-btn');

  galleryAppBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllModals();
    galleryModal.style.display = 'flex';
    galleryModal.classList.add('visible');
  });

  closeGalleryModalBtn.addEventListener('click', () => {
    galleryModal.classList.remove('visible');
    galleryModal.style.display = 'none';
  });

  galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) {
      galleryModal.classList.remove('visible');
      galleryModal.style.display = 'none';
    }
  });

  // --- Lógica del formulario de contacto ---
  const contactAppBtn = document.querySelector('.nav-button[data-target="contact"]');
  const contactModal = document.getElementById('contactModal');
  const closeContactModalBtn = contactModal.querySelector('.close-modal-btn');
  const contactForm = document.getElementById('contactForm');
  const statusMessage = document.getElementById('statusMessage');

  contactAppBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllModals();
    contactModal.style.display = 'flex';
    contactModal.classList.add('visible');
  });

  closeContactModalBtn.addEventListener('click', () => {
    contactModal.classList.remove('visible');
    contactModal.style.display = 'none';
  });

  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
      contactModal.classList.remove('visible');
      contactModal.style.display = 'none';
    }
  });

  function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `alert-message show ${type}`;
    setTimeout(() => {
      statusMessage.classList.remove('show');
      statusMessage.classList.add('hide');
    }, 3000);
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);

    fetch('save_contact.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        showStatusMessage('Successfully!', 'success');
        contactForm.reset();
      } else {
        showStatusMessage('Error!. 😢', 'error');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showStatusMessage('Error. 😢', 'error');
    });
  });

  // --- Lógica de la aplicación "About Me" ---
  const aboutMeBtn = document.getElementById('aboutMeBtn');
  const aboutMeModal = document.getElementById('aboutMeModal');
  const closeAboutMeModalBtn = aboutMeModal.querySelector('.close-modal-btn');

  aboutMeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllModals();
    aboutMeModal.style.display = 'flex';
    aboutMeModal.classList.add('visible');
  });

  closeAboutMeModalBtn.addEventListener('click', () => {
    aboutMeModal.classList.remove('visible');
    aboutMeModal.style.display = 'none';
  });

  aboutMeModal.addEventListener('click', (e) => {
    if (e.target === aboutMeModal) {
      aboutMeModal.classList.remove('visible');
      aboutMeModal.style.display = 'none';
    }
  });

  // --- Lógica de la aplicación "My study" ---
  const studyAppBtn = document.getElementById('studyAppBtn');
  const studyModal = document.getElementById('studyModal');
  const closeStudyModalBtn = studyModal.querySelector('.close-modal-btn');

  studyAppBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllModals();
    studyModal.style.display = 'flex';
    studyModal.classList.add('visible');
  });

  closeStudyModalBtn.addEventListener('click', () => {
    studyModal.classList.remove('visible');
    studyModal.style.display = 'none';
  });

  studyModal.addEventListener('click', (e) => {
    if (e.target === studyModal) {
      studyModal.classList.remove('visible');
      studyModal.style.display = 'none';
    }
  });

  // --- Lógica para los sub-modales de "My study" ---
  const mdnAppBtn = document.getElementById('mdnAppBtn');
  const freeCodeCampBtn = document.getElementById('freeCodeCampBtn');
  const w3schoolsAppBtn = document.getElementById('w3schoolsAppBtn');
  const mdnModal = document.getElementById('mdnModal');
  const freeCodeCampModal = document.getElementById('freeCodeCampModal');
  const w3schoolsModal = document.getElementById('w3schoolsModal');
  const closeMdnModalBtn = mdnModal.querySelector('.close-modal-btn');
  const closeFreeCodeCampModalBtn = freeCodeCampModal.querySelector('.close-modal-btn');
  const closeW3schoolsModalBtn = w3schoolsModal.querySelector('.close-modal-btn');

  function openSubModal(modal) {
    hideAllModals();
    modal.style.display = 'flex';
    modal.classList.add('visible');
  }

  mdnAppBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openSubModal(mdnModal);
  });

  freeCodeCampBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openSubModal(freeCodeCampModal);
  });

  w3schoolsAppBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openSubModal(w3schoolsModal);
  });

  closeMdnModalBtn.addEventListener('click', () => {
    mdnModal.classList.remove('visible');
    mdnModal.style.display = 'none';
    studyModal.style.display = 'flex';
    studyModal.classList.add('visible');
  });

  closeFreeCodeCampModalBtn.addEventListener('click', () => {
    freeCodeCampModal.classList.remove('visible');
    freeCodeCampModal.style.display = 'none';
    studyModal.style.display = 'flex';
    studyModal.classList.add('visible');
  });

  closeW3schoolsModalBtn.addEventListener('click', () => {
    w3schoolsModal.classList.remove('visible');
    w3schoolsModal.style.display = 'none';
    studyModal.style.display = 'flex';
    studyModal.classList.add('visible');
  });

  // --- Lógica de la aplicación "Notifications" ---
  const notificationsBtn = document.getElementById('notificationsBtn');
  const notificationsModal = document.getElementById('notificationsModal');
  const notificationsList = document.getElementById('notificationsList');
  const closeNotificationBtn = notificationsModal.querySelector('.close-modal-btn');
  const notificationDot = document.getElementById('notificationDot');

  // Función para mostrar una notificación y reproducir un sonido
  function showNotification(message) {
    audio.play().catch(error => console.log("Error al reproducir el sonido:", error));

    const notificationItem = document.createElement('div');
    notificationItem.classList.add('notification-item');
    notificationItem.innerHTML = `<p>${message}</p>`;
    notificationsList.prepend(notificationItem);
  }

  notificationsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllModals();
    notificationsModal.style.display = 'flex';
    notificationsModal.classList.add('visible');
  });

  closeNotificationBtn.addEventListener('click', () => {
    notificationsModal.classList.remove('visible');
    notificationsModal.style.display = 'none';
  });

  notificationsModal.addEventListener('click', (e) => {
    if (e.target === notificationsModal) {
      notificationsModal.classList.remove('visible');
      notificationsModal.style.display = 'none';
    }
  });

  notificationsBtn.addEventListener('click', () => {
    notificationDot.style.display = 'none';
  });

  // --- Lógica del "proyector" de pantalla y música ---
  if (lockScreenOverlay) {
    lockScreenOverlay.addEventListener('click', () => {
      lockScreenOverlay.classList.add('hidden');
      setTimeout(() => {
        lockScreenOverlay.style.display = 'none';
      }, 500);
      playMusic();
    });
  }

  // --- Lógica de inicialización ---
  function initializeMobileScreen() {
    if (window.innerWidth < 992) {
      mobileScreen.classList.remove('d-none');
      mobileScreen.classList.add('d-flex');
      body.classList.add('off');
      heroImg.style.filter = 'brightness(50%)';
    } else {
      mobileScreen.classList.add('d-none');
      body.classList.remove('off');
      heroImg.style.filter = 'brightness(100%)';
    }
  }

  initializeMobileScreen();
  window.addEventListener('resize', initializeMobileScreen);
  updateTime();
  setInterval(updateTime, 60000);
  loadTrack(currentTrackIndex);

  mobileScreen.addEventListener('mousedown', () => {
    mobileScreen.style.cursor = 'grabbing';
  });

  mobileScreen.addEventListener('mouseup', () => {
    mobileScreen.style.cursor = 'grab';
  });

  AOS.init({ once: true, duration: 1000 });

  // --- Lógica de las manchas de fondo (blobs) ---
  const backgroundBlobs = document.getElementById('background-blobs');
  const colors = ['#ff6347', '#ffb833', '#47c2ff', '#50ff60', '#ff509e', '#a363ff'];
  const numberOfBlobs = 10;

  for (let i = 0; i < numberOfBlobs; i++) {
    const blob = document.createElement('div');
    blob.className = 'blob';
    const size = Math.floor(Math.random() * 200) + 150;
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const color = colors[Math.floor(Math.random() * colors.length)];
    blob.style.width = `${size}px`;
    blob.style.height = `${size}px`;
    blob.style.top = `${top}vh`;
    blob.style.left = `${left}vw`;
    blob.style.backgroundColor = color;
    blob.style.animationDelay = `${Math.random() * 5}s`;
    backgroundBlobs.appendChild(blob);
  }

  // --- Lógica de la aplicación 'Elusive' ---
  const elusiveApp = document.getElementById('elusiveApp');

  if (elusiveApp) {
    const appText = elusiveApp.querySelector('p');

    const funnyNames = [
      "Made in Temu",
      "Shipping in 99 days",
      "Manual in Chinese",
    ];

    elusiveApp.addEventListener('click', (event) => {
      event.preventDefault();
      elusiveApp.classList.add('shake-animation');

      const randomIndex = Math.floor(Math.random() * funnyNames.length);
      appText.textContent = funnyNames[randomIndex];

      setTimeout(() => {
        elusiveApp.classList.remove('shake-animation');
      }, 1000);
    });
  }
});


document.addEventListener('DOMContentLoaded', () => {
    const bocetoElements = [
        document.querySelector('.nav-bar'),
        document.querySelector('.header'),
        document.querySelector('.content-row'),
        document.querySelector('.footer')
    ];

    let delay = 2000; // 2-second initial delay

    bocetoElements.forEach((element) => {
        setTimeout(() => {
            element.classList.add('draw-animation');
        }, delay);
        delay += 500; // Increment delay for a sequenced effect
    });
});