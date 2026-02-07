// Data for study materials
const materials = [
  {
    category: 'Books',
    title: 'Introduction to Algorithms',
    desc: 'Comprehensive guide to algorithms by Cormen, Leiserson, Rivest, and Stein.',
    url: '#',
    label: 'View',
    icon: 'fa-solid fa-book'
  },
  {
    category: 'Books',
    title: 'Clean Code',
    desc: 'A Handbook of Agile Software Craftsmanship by Robert C. Martin.',
    url: '#',
    label: 'View',
    icon: 'fa-solid fa-book'
  },
  {
    category: 'Videos',
    title: 'Khan Academy: Calculus',
    desc: 'A full playlist covering calculus concepts from basics to advanced.',
    url: '#',
    label: 'Watch',
    icon: 'fa-solid fa-video'
  },
  {
    category: 'Videos',
    title: 'Crash Course: World History',
    desc: 'Engaging video series on world history topics.',
    url: '#',
    label: 'Watch',
    icon: 'fa-solid fa-video'
  },
  {
    category: 'Notes',
    title: 'Linear Algebra Notes',
    desc: 'Personal notes and summaries on linear algebra topics.',
    url: '#',
    label: 'Open',
    icon: 'fa-solid fa-file-lines'
  },
  {
    category: 'Notes',
    title: 'Python Cheat Sheet',
    desc: 'Quick reference for Python syntax and common libraries.',
    url: '#',
    label: 'Open',
    icon: 'fa-solid fa-file-lines'
  },
  {
    category: 'Other',
    title: 'Project Euler',
    desc: 'Practice math and programming problems online.',
    url: 'https://projecteuler.net/',
    label: 'Visit',
    icon: 'fa-solid fa-globe'
  },
  {
    category: 'Other',
    title: 'Overleaf',
    desc: 'Collaborative LaTeX editor for writing and sharing documents.',
    url: 'https://www.overleaf.com/',
    label: 'Visit',
    icon: 'fa-solid fa-globe'
  }
];

const materialsContainer = document.getElementById('materials');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

if (materialsContainer && searchInput && categoryFilter) {
  // Fuzzy search with Fuse.js
  const fuse = new Fuse(materials, {
    keys: ['title', 'desc', 'category'],
    threshold: 0.3,
    ignoreLocation: true
  });

  // --- Starred Materials ---
  function getStarred() {
    try {
      return JSON.parse(localStorage.getItem('starredMaterials') || '[]');
    } catch {
      return [];
    }
  }
  function setStarred(arr) {
    localStorage.setItem('starredMaterials', JSON.stringify(arr));
  }
  function isStarred(title) {
    return getStarred().includes(title);
  }
  function toggleStar(title) {
    let starred = getStarred();
    if (starred.includes(title)) {
      starred = starred.filter(t => t !== title);
    } else {
      starred.push(title);
    }
    setStarred(starred);
    renderMaterials(searchInput.value, categoryFilter.value);
  }

  // --- Render Materials ---
  function renderMaterials(filter = '', category = '') {
    const cats = ['Books', 'Videos', 'Notes', 'Other'];
    let filteredMaterials = materials;
    if (filter) {
      filteredMaterials = fuse.search(filter).map(r => r.item);
    }
    if (category && category !== 'Starred') {
      filteredMaterials = filteredMaterials.filter(m => m.category === category);
    }
    if (category === 'Starred') {
      const starred = getStarred();
      filteredMaterials = filteredMaterials.filter(m => starred.includes(m.title));
    }
    let html = '';
    cats.forEach(cat => {
      const filtered = filteredMaterials.filter(m => m.category === cat);
      if (filtered.length) {
        html += `<section id="${cat.toLowerCase()}" class="mb-10"><h2 class="text-xl font-bold text-blue-900 dark:text-yellow-400 border-l-4 border-yellow-400 pl-2 mb-4">${cat}</h2><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">`;
        filtered.forEach(m => {
          const starred = isStarred(m.title);
          html += `<div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex flex-col min-h-[180px] transition hover:scale-105 hover:shadow-xl relative">
            <button class="star-btn absolute top-3 right-3 ${starred ? 'filled' : ''}" title="Star this material" onclick="toggleStar('${m.title.replace(/'/g, "\\'")}')">
              <i class="fa${starred ? 's' : 'r'} fa-star"></i>
            </button>
            <div class="flex items-center gap-2 mb-2">
              <i class="${m.icon} text-blue-700 dark:text-yellow-400 text-xl"></i>
              <span class="font-semibold text-lg">${m.title}</span>
            </div>
            <div class="text-gray-600 dark:text-gray-300 flex-1 mb-3">${m.desc}</div>
            <div class="text-right mt-auto">
              <a href="${m.url}" target="_blank" class="inline-block bg-yellow-400 text-blue-900 font-bold px-4 py-2 rounded-lg shadow hover:bg-blue-900 hover:text-yellow-400 transition">${m.label} <i class="fa-solid fa-arrow-up-right-from-square ml-1"></i></a>
            </div>
          </div>`;
        });
        html += '</div></section>';
      }
    });
    if (!filteredMaterials.length) {
      html = '<div class="text-center text-gray-500 dark:text-gray-400 py-10">No materials found.</div>';
    }
    materialsContainer.innerHTML = html;
  }

  // --- Category Filter ---
  categoryFilter.addEventListener('change', () => {
    localStorage.setItem('lastCategory', categoryFilter.value);
    renderMaterials(searchInput.value, categoryFilter.value);
  });

  // --- Restore last search and filter ---
  const lastSearch = localStorage.getItem('lastSearch') || '';
  const lastCategory = localStorage.getItem('lastCategory') || '';
  searchInput.value = lastSearch;
  categoryFilter.value = lastCategory;
  renderMaterials(lastSearch, lastCategory);

  // --- Search functionality ---
  searchInput.addEventListener('input', e => {
    const val = e.target.value.trim();
    localStorage.setItem('lastSearch', val);
    renderMaterials(val, categoryFilter.value);
  });
}

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  function setTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
    localStorage.setItem('theme', theme);
  }
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  });
  // Load theme
  (() => {
    const saved = localStorage.getItem('theme');
    setTheme(saved === 'dark' ? 'dark' : 'light');
  })();
}

// Scroll to top button
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
