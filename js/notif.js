fetch('repos.php')
  .then(res => res.json())
  .then(repos => {
    const notifSpan = document.getElementById('notif-repo');
    const infoBox = document.getElementById('repo-extra-info');

    // Ambil repositori publik saja, urutkan dari yang paling sering diupdate
    const filtered = repos
      .filter(r => !r.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 10); // Ambil 10 repositori teratas saja

    let index = 0;

    function updateDisplay() {
      const repo = filtered[index];
      notifSpan.textContent = repo.name;

      infoBox.innerHTML = `
        ${repo.private ? '<i class="private"></i> Private' : '<i class="public"></i> Public'} &nbsp;|&nbsp;
        <i class="stars"></i> ${repo.stargazers_count} stars &nbsp;|&nbsp;<i class="code"></i>
        ${repo.language || '0 Language'}
      `;

      index = (index + 1) % filtered.length;
    }

    if (filtered.length > 0) {
      updateDisplay();
      setInterval(updateDisplay, 4000);
    } else {
      notifSpan.textContent = 'Tidak ada repositori.';
      infoBox.textContent = '';
    }
  })
  .catch(err => {
    console.error('Gagal mengambil repositori:', err);
    document.getElementById('notif-repo').textContent = 'Gagal memuat...';
  });
