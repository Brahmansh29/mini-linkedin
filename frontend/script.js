// Replace this with your backend URL
const BASE_URL = 'http://localhost:5000/api';

// SIGNUP
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Signup successful! Please login.');
      window.location.href = 'index.html';
    } else {
      alert(data.msg);
    }
  });
}

// LOGIN
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      alert('Login successful!');
      window.location.href = 'profile.html';
    } else {
      alert(data.msg);
    }
  });
}

const token = localStorage.getItem('token');
const authHeaders = {
  'Content-Type': 'application/json',
  Authorization: token
};

// PROFILE VIEW
async function loadProfile() {
  const res = await fetch(`${BASE_URL}/users/me`, { headers: authHeaders });
  const data = await res.json();

  if (res.ok) {
    document.getElementById('name').textContent = data.name;
    document.getElementById('email').textContent = data.email;
    document.getElementById('bio').textContent = data.bio || '-';
    document.getElementById('skills').textContent = data.skills?.join(', ') || '-';

    // Pre-fill update form
    document.getElementById('bioInput').value = data.bio || '';
    document.getElementById('skillsInput').value = data.skills?.join(', ') || '';
  } else {
    alert('Error loading profile');
  }
}

// UPDATE PROFILE
const updateForm = document.getElementById('updateForm');
if (updateForm) {
  updateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const bio = document.getElementById('bioInput').value;
    const skills = document.getElementById('skillsInput').value.split(',').map(s => s.trim());

    const res = await fetch(`${BASE_URL}/users/me`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ bio, skills })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Profile updated!');
      loadProfile();
    } else {
      alert(data.msg);
    }
  });
}

// CREATE POST
const postForm = document.getElementById('postForm');
if (postForm) {
  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = document.getElementById('postContent').value;

    const res = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ content })
    });

    if (res.ok) {
      document.getElementById('postContent').value = '';
      loadPosts();
    } else {
      const data = await res.json();
      alert(data.msg);
    }
  });
}

// LOAD POSTS
async function loadPosts() {
  const res = await fetch(`${BASE_URL}/posts/me`, { headers: authHeaders });
  const posts = await res.json();

  const postList = document.getElementById('postList');
  postList.innerHTML = '';
  posts.forEach(post => {
    const div = document.createElement('div');
    div.classList.add('post');
    div.innerHTML = `<p>${post.content}</p><small>${new Date(post.createdAt).toLocaleString()}</small><hr>`;
    postList.appendChild(div);
  });
}

// LOGOUT
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

// Init dashboard
if (window.location.pathname.includes('profile.html')) {
  if (!token) window.location.href = 'index.html';
  loadProfile();
  loadPosts();
}

async function searchUsers() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return alert('Enter a search term');
  
    const res = await fetch(`${BASE_URL}/users/search?q=${encodeURIComponent(query)}`, {
      headers: authHeaders
    });
  
    const users = await res.json();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
  
    if (users.length === 0) {
      resultsDiv.innerHTML = '<p>No users found.</p>';
      return;
    }
  
    users.forEach(u => {
      const div = document.createElement('div');
      div.innerHTML = `
        <h4>${u.name}</h4>
        <p>Email: ${u.email}</p>
        <p>Bio: ${u.bio || '-'}</p>
        <p>Skills: ${u.skills?.join(', ') || '-'}</p>
        <button onclick="viewProfile('${u._id}')">View Profile</button>
        <hr>
      `;
      resultsDiv.appendChild(div);
    });
  }
  
  function viewProfile(id) {
    localStorage.setItem('viewUserId', id);
    window.location.href = 'viewProfile.html';
  }
  
  async function loadViewedProfile() {
    const userId = localStorage.getItem('viewUserId');
    if (!userId) return;
  
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
      headers: authHeaders
    });
  
    const { user, posts } = await res.json();
  
    const profileInfo = document.getElementById('profileInfo');
    profileInfo.innerHTML = `
      <h3>${user.name}</h3>
      <p>Email: ${user.email}</p>
      <p>Bio: ${user.bio || '-'}</p>
      <p>Skills: ${user.skills?.join(', ') || '-'}</p>
      <hr>
    `;
  
    const postDiv = document.getElementById('userPosts');
    postDiv.innerHTML = '<h3>Posts</h3>';
    posts.forEach(post => {
      const div = document.createElement('div');
      div.innerHTML = `<p>${post.content}</p><small>${new Date(post.createdAt).toLocaleString()}</small><hr>`;
      postDiv.appendChild(div);
    });
  }
  
  if (window.location.pathname.includes('viewProfile.html')) {
    loadViewedProfile();
  }
  