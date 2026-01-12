// script.js – logjika për autentikimin dhe faqet dinamike të Antokton

// -----------------------------
// Firebase konfigurimi
// Plotësoni me kredencialet e projektit tuaj nga Firebase Console
// Referojeni README.md për më shumë detaje.
// Konfigurimi real për projektin antokton‑pune.
// Këto vlera u kopjuan nga Firebase Console gjatë
// konfigurimit të aplikacionit “antokton‑web”.
// Përditësuar me konfigurimin real të projektit (shih firebase_config_snippet.js)
const firebaseConfig = {
  apiKey: "AIzaSyBEab_Fq7Wf64uv-hBF0gD0MI5XeDZh9O4",
  authDomain: "antokton-pune.firebaseapp.com",
  projectId: "antokton-pune",
  storageBucket: "antokton-pune.appspot.com",
  messagingSenderId: "270145360967",
  appId: "1:270145360967:web:1a8f33b3e0f61a9fbc4f1a"
};

// Inicializimi i Firebase vetëm nëse nuk është inicializuar më parë
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();
const functions = firebase.functions ? firebase.functions() : null;

// Variabla globale për përdoruesin aktual dhe të dhënat e tij
let currentUser = null;
let currentUserData = null;
let currentRole = null;

// Funksioni kryesor që thirret pasi DOM të ngarkohet
function initApp() {
  // lidh butonat e login/out
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  if (loginBtn) loginBtn.addEventListener('click', signInWithFacebook);
  if (logoutBtn) logoutBtn.addEventListener('click', () => auth.signOut());

  // Monitoro gjendjen e autentikimit
  auth.onAuthStateChanged(async (user) => {
    currentUser = user;
    if (user) {
      // Shfaq butonin e logout
      if (loginBtn) loginBtn.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'inline-block';
      // Merr ose krijo dokumentin e përdoruesit
      await loadUserProfile(user.uid);
      // Nëse përdoruesi është moderator ose admin, shfaq lidhjen e panelit
      const adminLink = document.getElementById('admin-panel-link');
      if (adminLink) {
        if (currentRole === 'moderator' || currentRole === 'admin') {
          adminLink.style.display = 'inline-block';
        } else {
          adminLink.style.display = 'none';
        }
      }
    } else {
      // Nuk ka përdorues të kyçur
      if (loginBtn) loginBtn.style.display = 'inline-block';
      if (logoutBtn) logoutBtn.style.display = 'none';
      currentUserData = null;
      currentRole = null;
      // Fshih lidhjen e panelit kur nuk ka përdorues
      const adminLink = document.getElementById('admin-panel-link');
      if (adminLink) adminLink.style.display = 'none';
    }
    // Pasi të përcaktohet përdoruesi, inicializo faqen specifike
    initPage();
  });
}

// Krijon ose lexon dokumentin e përdoruesit nga koleksioni `users`
async function loadUserProfile(uid) {
  try {
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      // krijo një dokument të ri
      await userRef.set({
        role: 'jobSeeker',
        postsCount: 0,
        lastPost: null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      currentUserData = { role: 'jobSeeker', postsCount: 0, lastPost: null };
      currentRole = 'jobSeeker';
    } else {
      currentUserData = doc.data();
      currentRole = currentUserData.role;
    }
  } catch (e) {
    console.error('Gabim në leximin e profilit të përdoruesit:', e);
  }
}

// Hyrja me Facebook
function signInWithFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope('email');
  auth.signInWithPopup(provider)
    .then((result) => {
      // Përdoruesi është i kyçur
      // Nuk ka veprime të tjera të nevojshme këtu sepse onAuthStateChanged do të thirret
    })
    .catch((error) => {
      console.error('Gabim gjatë kyçjes:', error.message);
      alert('Ndodhi një gabim gjatë kyçjes. Ju lutemi provoni përsëri.');
    });
}

// Inicializon faqen e duhur bazuar në atribute të body-së
function initPage() {
  const page = document.body.getAttribute('data-page');
  if (page === 'pune') {
    initJobsPage();
  } else if (page === 'admin') {
    initAdminPage();
  } else {
    // faqet tjera nuk kanë logjikë specifike për momentin
  }
}

// -----------------------------
// Funksionaliteti për panelin administrativ

async function initAdminPage() {
  // Shfaq panelin vetëm për moderatorët dhe administratorët
  if (!currentUser || !(currentRole === 'admin' || currentRole === 'moderator')) {
    const container = document.getElementById('user-list');
    if (container) {
      container.innerHTML = '<p>Nuk keni leje për të parë këtë faqe.</p>';
    }
    return;
  }
  const container = document.getElementById('user-list');
  if (!container) return;
  container.innerHTML = '<p>Duke u ngarkuar lista e përdoruesve...</p>';
  try {
    if (!functions) {
      container.innerHTML = '<p>Nuk është e mundur të thirret funksioni pa firebase-functions-compat.</p>';
      return;
    }
    const listUsers = functions.httpsCallable('listUsers');
    const result = await listUsers({ maxResults: 100 });
    renderUserList(result.data.users);
  } catch (e) {
    console.error('Gabim gjatë marrjes së përdoruesve:', e);
    container.innerHTML = '<p>Ndodhi një gabim gjatë ngarkimit të përdoruesve.</p>';
  }
}

function renderUserList(users) {
  const container = document.getElementById('user-list');
  if (!container) return;
  if (!users || users.length === 0) {
    container.innerHTML = '<p>Nuk ka përdorues të regjistruar.</p>';
    return;
  }
  const table = document.createElement('table');
  table.classList.add('user-table');
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['UID', 'Email', 'Emri', 'Roli', 'Ndrysho rolin'].forEach((col) => {
    const th = document.createElement('th');
    th.textContent = col;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  users.forEach((user) => {
    const row = document.createElement('tr');
    const uidTd = document.createElement('td');
    uidTd.textContent = user.uid;
    const emailTd = document.createElement('td');
    emailTd.textContent = user.email || '';
    const nameTd = document.createElement('td');
    nameTd.textContent = user.displayName || '';
    const roleTd = document.createElement('td');
    roleTd.textContent = user.role;
    const selectTd = document.createElement('td');
    const select = document.createElement('select');
    ['jobSeeker', 'employer', 'moderator', 'admin'].forEach((role) => {
      const opt = document.createElement('option');
      opt.value = role;
      opt.textContent = role;
      if (role === user.role) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener('change', async () => {
      const newRole = select.value;
      try {
        const setRole = functions.httpsCallable('setUserRole');
        await setRole({ uid: user.uid, role: newRole });
        roleTd.textContent = newRole;
        alert('Roli u përditësua me sukses.');
      } catch (e) {
        console.error('Gabim gjatë përditësimit të rolit:', e);
        alert('Ndodhi një gabim gjatë përditësimit të rolit.');
        // Rikthe zgjedhjen e mëparshme në select
        select.value = user.role;
      }
    });
    selectTd.appendChild(select);
    row.appendChild(uidTd);
    row.appendChild(emailTd);
    row.appendChild(nameTd);
    row.appendChild(roleTd);
    row.appendChild(selectTd);
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  container.innerHTML = '';
  container.appendChild(table);
}

// -----------------------------
// Funksionaliteti për faqen Punë në Europë

// Variabla filtrash për punët
let filterCountry = null;
let filterRegion = null;
let filterCategory = null;
let filterProfession = null;
let jobsUnsubscribe = null;
let moderationUnsubscribe = null;

// Kategoritë dhe profesionet (shembuj). Përdoruesit mund të shtojnë profesione të tjera sipas nevojës.
const professionMap = {
  'Ndërtim': ['Murator', 'Electricist', 'Hidraulik', 'Piktor', 'Instalues'],
  'Transport': ['Shofer kamioni', 'Shofer furgoni', 'Dispeçer', 'Mekanik'],
  'Hoteleri': ['Kamerier', 'Recepsionist', 'Guzhinier', 'Pastrim'],
  'Shëndet': ['Infermier', 'Mjek ndihmës', 'Kujdestar', 'Farmacist'],
  'Zyre': ['Asistent administrativ', 'Kontabilist', 'Sekretar', 'Operator'],
  'IT': ['Programues', 'Inxhinier rrjeti', 'Administrator sistemi', 'Dizajner web'],
  'Edukim': ['Mësues', 'Pedagog', 'Trajner', 'Përkthyes'],
  'Bujqësi': ['Agronom', 'Pezë', 'Bletar', 'Punonjës ferme'],
  'Artizanale': ['Riparues', 'Punues druri', 'Punues metali', 'Mirëmbajtje'],
  'Tregti': ['Shitës', 'Menaxher marketingu', 'Kasier', 'Agjent shitjesh'],
  'Sezonale': ['Pastrues plazhi', 'Punëtor vreshti', 'Kamerier sezonal', 'Hotelieri sezonal'],
  'Gra': ['Punë nga shtëpia', 'Punë këshilltare', 'Mësim online', 'Punë artizanale']
};

// Zona për Antokton
const antoktonRegions = {
  Shkoder: 'Shkodër & Malësi Veriperëndimore',
  Prishtine: 'Prishtinë & Luginë e Fusha Verilindore',
  Shkup: 'Shkup & Qendër Lindore',
  Cameri: 'Çamëri & Bregdet Jugor e Lindor',
  Tirane: 'Tiranë & Qendër Perëndimore'
};

// Inicializon elementët e faqes së punës
function initJobsPage() {
  // Vendos event listeners për filtrat
  const stateLinks = document.querySelectorAll('.state-link');
  const regionLinks = document.querySelectorAll('.region-link');
  const categoryLinks = document.querySelectorAll('.category-link');
  const professionList = document.getElementById('profession-list');
  const postJobBtn = document.getElementById('post-job-btn');
  const moderateBtn = document.getElementById('moderate-btn');

  stateLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const country = link.getAttribute('data-country');
      // Toggle subregion list for Antokton
      if (country === 'Antokton') {
        const sub = document.getElementById('regions-Antokton');
        if (sub) sub.style.display = sub.style.display === 'none' || sub.style.display === '' ? 'block' : 'none';
      }
      filterCountry = country;
      filterRegion = null;
      updateRegionSelect(country);
      loadJobs();
    });
  });
  regionLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const region = link.getAttribute('data-region');
      filterCountry = link.getAttribute('data-country');
      filterRegion = region;
      updateRegionSelect(filterCountry);
      loadJobs();
    });
  });
  categoryLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const category = link.getAttribute('data-category');
      filterCategory = category;
      filterProfession = null;
      // përditëso listën e profesioneve
      renderProfessions(category);
      loadJobs();
    });
  });
  professionList.addEventListener('click', (e) => {
    if (e.target && e.target.matches('a.profession-link')) {
      e.preventDefault();
      const profession = e.target.getAttribute('data-profession');
      filterProfession = profession;
      loadJobs();
    }
  });
  // Butoni i postimit të një njoftimi të ri
  if (postJobBtn) {
    postJobBtn.addEventListener('click', () => {
      if (!currentUser) {
        alert('Duhet të kyçeni për të shtuar njoftim.');
        return;
      }
      openJobModal();
    });
  }
  // Butoni i moderimit
  if (moderateBtn) {
    moderateBtn.addEventListener('click', () => {
      openModerationModal();
    });
  }
  // Shfaq butonin e moderimit vetëm nëse përdoruesi është moderator ose admin
  if (currentRole === 'moderator' || currentRole === 'admin') {
    if (moderateBtn) moderateBtn.style.display = 'inline-block';
  } else {
    if (moderateBtn) moderateBtn.style.display = 'none';
  }
  // Përditëso dropdown-et në formën e njoftimit
  setupJobFormSelects();
  // Fillimi i ngarkimit të njoftimeve
  loadJobs();
}

// Përditëson dropdown-in e zonës në modal bazuar në shtetin e zgjedhur
function updateRegionSelect(country) {
  const regionSelect = document.getElementById('job-region');
  if (!regionSelect) return;
  // Fshi opsionet ekzistuese
  while (regionSelect.firstChild) {
    regionSelect.removeChild(regionSelect.firstChild);
  }
  if (country === 'Antokton') {
    Object.keys(antoktonRegions).forEach(key => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = antoktonRegions[key];
      regionSelect.appendChild(opt);
    });
  } else {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'Pa nënndarje';
    regionSelect.appendChild(opt);
  }
}

// Mbushe listën e profesioneve sipas kategorisë
function renderProfessions(category) {
  const professionList = document.getElementById('profession-list');
  if (!professionList) return;
  professionList.innerHTML = '';
  const professions = professionMap[category] || [];
  professions.forEach((prof) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = prof;
    a.setAttribute('data-profession', prof);
    a.classList.add('profession-link');
    li.appendChild(a);
    professionList.appendChild(li);
  });
}

// Inicilizo dropdown-et e formës për shtim njoftimi
function setupJobFormSelects() {
  const countrySelect = document.getElementById('job-country');
  const regionSelect = document.getElementById('job-region');
  const categorySelect = document.getElementById('job-category');
  const professionSelect = document.getElementById('job-profession');
  if (!countrySelect || !regionSelect || !categorySelect || !professionSelect) return;
  // Kur zgjedhet një shtet në formë, përditëso zonat
  countrySelect.addEventListener('change', () => {
    updateRegionSelect(countrySelect.value);
  });
  // Zbraz subregionet në fillim
  updateRegionSelect(countrySelect.value);
  // Kur zgjedhet një kategori, përditëso profesionet
  categorySelect.addEventListener('change', () => {
    populateProfessionSelect(professionSelect, categorySelect.value);
  });
  // Inicializo profesionet
  populateProfessionSelect(professionSelect, categorySelect.value);
  // Form submit
  const jobForm = document.getElementById('job-form');
  if (jobForm) {
    jobForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await submitJob(jobForm);
    });
  }
  // Mbyll modal
  const closeBtn = document.getElementById('job-modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeJobModal);
  }
}

function populateProfessionSelect(selectEl, category) {
  selectEl.innerHTML = '';
  const professions = professionMap[category] || [];
  professions.forEach((prof) => {
    const opt = document.createElement('option');
    opt.value = prof;
    opt.textContent = prof;
    selectEl.appendChild(opt);
  });
}

// Ngarkon njoftimet e punës bazuar në filtrat aktual
function loadJobs() {
  const outputDiv = document.getElementById('jobs-output');
  if (!outputDiv) return;
  outputDiv.innerHTML = '<p>Duke u ngarkuar...</p>';
  // Anulo query-n e mëparshëm nëse ekziston
  if (jobsUnsubscribe) jobsUnsubscribe();
  let query = db.collection('jobs').where('status', '==', 'approved');
  if (filterCountry) {
    query = query.where('country', '==', filterCountry);
  }
  // Listen for real-time updates
  jobsUnsubscribe = query.onSnapshot((snapshot) => {
    const results = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Filtro sipas nënndarjes dhe kategorive
      if (filterRegion && data.region && data.region !== filterRegion) return;
      if (filterCategory && data.category && data.category !== filterCategory) return;
      if (filterProfession && data.profession && data.profession !== filterProfession) return;
      results.push({ id: doc.id, ...data });
    });
    renderJobList(results);
  });
}

// Shfaq njoftimet e filtruar
function renderJobList(jobs) {
  const outputDiv = document.getElementById('jobs-output');
  if (!outputDiv) return;
  outputDiv.innerHTML = '';
  if (!jobs || jobs.length === 0) {
    outputDiv.innerHTML = '<p>Nuk u gjet asnjë njoftim për kriteret e zgjedhura.</p>';
    return;
  }
  jobs.sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis());
  jobs.forEach((job) => {
    const card = document.createElement('div');
    card.classList.add('job-card');
    const title = document.createElement('h4');
    title.textContent = job.title;
    const meta = document.createElement('p');
    meta.classList.add('meta');
    const dateStr = job.timestamp && job.timestamp.toDate ? job.timestamp.toDate().toLocaleDateString() : '';
    meta.textContent = `${job.country}${job.region ? ' - ' + job.region : ''} | ${job.category} - ${job.profession} | ${dateStr}`;
    const desc = document.createElement('p');
    desc.textContent = job.description;
    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(desc);
    outputDiv.appendChild(card);
  });
}

// Funksioni për të hapur modalin e postimit
function openJobModal() {
  const modal = document.getElementById('job-modal');
  if (modal) modal.style.display = 'block';
}
function closeJobModal() {
  const modal = document.getElementById('job-modal');
  if (modal) modal.style.display = 'none';
}

// Shto njoftimin në Firestore
async function submitJob(form) {
  if (!currentUser) {
    alert('Duhet të kyçeni për të dërguar njoftim.');
    return;
  }
  // Verifiko nëse përdoruesi ka të drejtë të publikojë falas
  if (!canUserPost()) {
    alert('Ju e keni shfrytëzuar të drejtën e njoftimit falas. Ju lutemi kontaktoni administratën për pagesë.');
    return;
  }
  const data = {
    country: form.country.value,
    region: form.region.value || null,
    category: form.category.value,
    profession: form.profession.value,
    title: form.title.value,
    description: form.description.value,
    postedBy: currentUser.uid,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    approvedBy: [],
    approvedCount: 0,
    status: 'pending'
  };
  try {
    await db.collection('jobs').add(data);
    // Përditëso numrin e njoftimeve dhe kohën e fundit në dokumentin e përdoruesit
    await db.collection('users').doc(currentUser.uid).update({
      postsCount: (currentUserData.postsCount || 0) + 1,
      lastPost: firebase.firestore.FieldValue.serverTimestamp()
    });
    currentUserData.postsCount = (currentUserData.postsCount || 0) + 1;
    currentUserData.lastPost = new Date();
    alert('Njoftimi u dërgua për miratim. Do të publikohet pasi të miratohet.');
    closeJobModal();
    form.reset();
  } catch (e) {
    console.error('Gabim gjatë shtimit të njoftimit:', e);
    alert('Ndodhi një gabim gjatë ruajtjes së njoftimit.');
  }
}

// Kontrollon nëse përdoruesi ka të drejtë të publikojë njoftim falas
function canUserPost() {
  if (!currentUserData) return false;
  if (currentRole === 'employer') return true;
  // punëkërkuesit kanë një njoftim falas brenda 10 ditëve
  const last = currentUserData.lastPost;
  const postsCount = currentUserData.postsCount || 0;
  if (!last) return true;
  const lastDate = last.toDate ? last.toDate() : last;
  const now = new Date();
  const diffMs = now - lastDate;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays > 10) {
    return true;
  }
  // nëse është brenda 10 ditësh dhe ka postuar së paku 1 njoftim, duhet pagesë
  return postsCount < 1;
}

// Modal për moderim
function openModerationModal() {
  const modal = document.getElementById('moderation-modal');
  if (modal) modal.style.display = 'block';
  // Mbyll butonin
  const closeBtn = document.getElementById('moderation-modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModerationModal);
  }
  loadPendingJobs();
}
function closeModerationModal() {
  const modal = document.getElementById('moderation-modal');
  if (modal) modal.style.display = 'none';
  if (moderationUnsubscribe) moderationUnsubscribe();
}

// Ngarkon njoftimet në pritje për moderim
function loadPendingJobs() {
  const listDiv = document.getElementById('moderation-list');
  if (!listDiv) return;
  listDiv.innerHTML = '<p>Duke u ngarkuar...</p>';
  // Anulo subskribimin e mëparshëm
  if (moderationUnsubscribe) moderationUnsubscribe();
  let query = db.collection('jobs').where('status', '==', 'pending');
  moderationUnsubscribe = query.onSnapshot((snapshot) => {
    const pending = [];
    snapshot.forEach((doc) => {
      pending.push({ id: doc.id, ...doc.data() });
    });
    renderPendingJobs(pending);
  });
}

function renderPendingJobs(jobs) {
  const listDiv = document.getElementById('moderation-list');
  if (!listDiv) return;
  listDiv.innerHTML = '';
  if (!jobs || jobs.length === 0) {
    listDiv.innerHTML = '<p>Nuk ka njoftime në pritje.</p>';
    return;
  }
  jobs.forEach((job) => {
    const card = document.createElement('div');
    card.classList.add('job-card');
    const title = document.createElement('h4');
    title.textContent = job.title;
    const meta = document.createElement('p');
    meta.classList.add('meta');
    meta.textContent = `${job.country}${job.region ? ' - ' + job.region : ''} | ${job.category} - ${job.profession}`;
    const desc = document.createElement('p');
    desc.textContent = job.description;
    const actions = document.createElement('div');
    // Buton approve
    const approveBtn = document.createElement('button');
    approveBtn.textContent = 'Mirato';
    approveBtn.addEventListener('click', () => approveJob(job));
    // Buton delete
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Fshi';
    deleteBtn.addEventListener('click', () => deleteJob(job.id));
    actions.appendChild(approveBtn);
    actions.appendChild(deleteBtn);
    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(desc);
    card.appendChild(actions);
    listDiv.appendChild(card);
  });
}

async function approveJob(job) {
  if (!currentUser) return;
  // Kontrollo rolin
  if (!(currentRole === 'moderator' || currentRole === 'admin')) {
    alert('Nuk keni të drejtë të miratoni njoftime.');
    return;
  }
  const jobRef = db.collection('jobs').doc(job.id);
  try {
    const updates = {
      approvedBy: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
      approvedCount: firebase.firestore.FieldValue.increment(1)
    };
    // Nëse ky është miratimi i dytë ose përdoruesi është admin, e kalon në statusin "approved"
    const newCount = (job.approvedCount || 0) + 1;
    if (newCount >= 2 || currentRole === 'admin') {
      updates.status = 'approved';
    }
    await jobRef.update(updates);
    alert('Njoftimi u miratua.');
  } catch (e) {
    console.error('Gabim gjatë miratimit:', e);
    alert('Ndodhi një gabim gjatë miratimit të njoftimit.');
  }
}

async function deleteJob(id) {
  if (!currentUser) return;
  if (!(currentRole === 'moderator' || currentRole === 'admin')) {
    alert('Nuk keni të drejtë të fshini njoftime.');
    return;
  }
  if (!confirm('Jeni i sigurt që dëshironi të fshini këtë njoftim?')) return;
  try {
    await db.collection('jobs').doc(id).delete();
    alert('Njoftimi u fshi.');
  } catch (e) {
    console.error('Gabim gjatë fshirjes së njoftimit:', e);
    alert('Ndodhi një gabim gjatë fshirjes së njoftimit.');
  }
}

// Inicializo aplikacionin kur DOM të jetë gati
document.addEventListener('DOMContentLoaded', initApp);