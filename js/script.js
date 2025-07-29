// Ambil profil GitHub
    fetch('https://api.github.com/users/lonecipher')
      .then(res => res.json())
      .then(data => {
        const followInfo = document.getElementById('follow-info');
followInfo.innerHTML = `
  <div class="profile-detail">
    ${data.bio ? `<div class="bio">${data.bio}</div>` : ''}
    ${data.blog ? `<div class="website"><a href="${data.blog}" target="_blank">${data.blog}</a></div>` : ''}
  </div>
  <div class="follow-btn">
    <iframe src="https://ghbtns.com/github-btn.html?user=lonecipher&type=follow&count=true"
      scrolling="0" width="170" height="20" title="GitHub Follow Button"></iframe>
  </div>
  <div class="follow-stats">
    <a href="${data.html_url}?tab=followers" target="_blank">${data.followers} Followers</a>
    <span class="follow-dot">·</span>
    <a href="${data.html_url}?tab=following" target="_blank">${data.following} Following</a>
  </div>
`;

        const profile = document.getElementById('profile');
        profile.innerHTML = `
          <img src="${data.avatar_url}" alt="${data.login}">
          <div>
            <div class="profile-name">${data.login}</div>
          </div>
        `;
      });

    // Ambil daftar repositori
    fetch("https://api.github.com/users/lonecipher/repos?per_page=100")
      .then(res => res.json())
      .then(repos => {
        const count = document.getElementById('repo-count');
        const publicList = document.getElementById('public-list');
        const privateList = document.getElementById('private-list');
        const popularList = document.getElementById('popular-list');
        const latestList = document.getElementById('latest-list');

        publicList.innerHTML = '';
        privateList.innerHTML = '';
        popularList.innerHTML = '';

        if (!Array.isArray(repos)) {
          count.textContent = 'Gagal parsing data.';
          return;
        }

        const total = repos.length;
        const privates = repos.filter(r => r.private).length;
        const publics = total - privates;

        count.innerHTML = `<i class="repositories"></i> Repositories: ${total} (Publik: ${publics}, Private: ${privates})`;

        // Urutkan berdasarkan repositories terbaru ditampilkan di atas
        const sortedByLatest = [...repos].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
const sortedByStars = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);

const showLatestBtn = document.getElementById('show-latest-btn');
let isShowingAllLatest = false;

// Simpan semua latest post
const allLatestItems = sortedByLatest.map(r => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = r.html_url;
  a.innerHTML = `${r.name} ${r.private ? '<i class="token"></i>' : ''}`;
  a.className = 'repo';
  a.target = '_blank';
  li.appendChild(a);

  if (r.description) {
    const desc = document.createElement('div');
    desc.className = 'desc';
    desc.textContent = r.description;
    li.appendChild(desc);
  }

  return li;
});

// Tampilkan hanya 4 pertama
allLatestItems.slice(0, 4).forEach(li => latestList.appendChild(li));

// Tampilkan tombol jika ada lebih dari 4
if (allLatestItems.length > 4) {
  showLatestBtn.style.display = 'inline-block';

  showLatestBtn.addEventListener('click', () => {
    if (!isShowingAllLatest) {
      allLatestItems.slice(4).forEach(li => latestList.appendChild(li));
      showLatestBtn.textContent = 'Tampilkan Lebih Sedikit';
      isShowingAllLatest = true;
    } else {
      const items = latestList.querySelectorAll('li');
      items.forEach((li, i) => {
        if (i >= 4) li.remove();
      });
      showLatestBtn.textContent = 'Postingan Lainnya';
      isShowingAllLatest = false;
    }
  });
}

const showAllButton = document.getElementById('show-all-btn');
let isShowingAll = false;

// Simpan semua elemen LI dulu
const allPopularItems = sortedByStars.map((r, index) => {
  const li = document.createElement('li');
  const container = document.createElement('div');
  container.className = 'popular-item';

  const rank = document.createElement('span');
  rank.className = 'repo-rank';
  rank.textContent = index + 1;

  const a = document.createElement('a');
  a.href = r.html_url;
  a.innerHTML = `${r.name} ${r.private ? '<i class="token"></i>' : ''}`;
  a.className = 'repo';
  a.target = '_blank';

  container.appendChild(rank);
  container.appendChild(a);
  li.appendChild(container);

  if (r.description) {
    const desc = document.createElement('div');
    desc.className = 'desc';
    desc.textContent = r.description;
    li.appendChild(desc);
  }

  return li;
});

// Tampilkan hanya 3 pertama
allPopularItems.slice(0, 3).forEach(li => popularList.appendChild(li));

// Tampilkan tombol jika ada lebih dari 3 item
if (allPopularItems.length > 3) {
  showAllButton.style.display = 'inline-block';

  showAllButton.addEventListener('click', () => {
    if (!isShowingAll) {
      allPopularItems.slice(3).forEach(li => popularList.appendChild(li));
      showAllButton.textContent = 'Show Less';
      isShowingAll = true;
    } else {
      // Hilangkan yang di bawah indeks 3
      const items = popularList.querySelectorAll('li');
      items.forEach((li, i) => {
        if (i >= 3) li.remove();
      });
      showAllButton.textContent = 'Show All';
      isShowingAll = false;
    }
  });
}

        // Daftar publik dan privat biasa
        repos.forEach(r => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = r.html_url;
          a.innerHTML = `${r.name} ${r.private ? '<i class="token"></i>' : ''}`;
          a.className = 'repo';
          a.target = '_blank';
          li.appendChild(a);

          if (r.description) {
            const desc = document.createElement('div');
            desc.className = 'desc';
            desc.textContent = r.description;
            li.appendChild(desc);
          }

          if (r.private) {
            privateList.appendChild(li);
          } else {
            publicList.appendChild(li);
          }
        });
      })
      .catch(err => {
        document.getElementById('repo-count').textContent = '';
        document.getElementById('popular-list').textContent = 'Gagal memuat popular repos.';
        document.getElementById('public-list').textContent = 'Gagal memuat repositori.';
        document.getElementById('private-list').textContent = '';
      });
