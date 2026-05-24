// Claude Code Sidebar Navigation
// Dynamically generates a course-based sidebar for CC article pages.
(function () {
  var courses = [
    {
      name: '基礎コース',
      accent: '#00d4ff',
      articles: [
        { slug: 'claude-code-agents', title: 'エージェント入門' },
        { slug: 'claude-code-agents-part1', title: '完全入門【前編】' },
        { slug: 'claude-code-agents-part2', title: '完全入門【後編】' }
      ]
    },
    {
      name: '実践コース',
      accent: '#7c3aed',
      articles: [
        { slug: 'claude-code-skills', title: 'Skills入門' },
        { slug: 'claude-code-hooks', title: 'Hooks完全ガイド' },
        { slug: 'claude-code-auto-mode', title: 'Auto Mode完全ガイド' },
        { slug: 'claude-code-agent-view', title: 'Agent View & /goal' }
      ]
    },
    {
      name: 'MCP連携コース',
      accent: '#ff3cac',
      articles: [
        { slug: 'mcp-guide', title: 'MCP完全解説' },
        { slug: 'mcp-server-fastmcp', title: 'MCPサーバー自作' }
      ]
    },
    {
      name: 'プロンプト設計コース',
      accent: '#f59e0b',
      articles: [
        { slug: 'prompt-engineering-guide', title: 'プロンプトエンジニアリング入門' },
        { slug: 'harness-engineering', title: 'ハーネスエンジニアリング' }
      ]
    }
  ];

  // Detect current page slug from URL
  var path = window.location.pathname;
  var m = path.match(/articles\/([^\/]+?)(?:\.html)?$/);
  var currentSlug = m ? m[1] : '';

  // Read status from localStorage
  var readSlugs = [];
  try {
    readSlugs = JSON.parse(localStorage.getItem('veqtor-read-articles') || '[]');
  } catch (e) {}

  // Find which course the current article belongs to
  var currentCourseIdx = -1;
  courses.forEach(function (course, ci) {
    course.articles.forEach(function (a) {
      if (a.slug === currentSlug) currentCourseIdx = ci;
    });
  });

  // Build sidebar HTML
  var html = '';
  html += '<div class="cc-sidebar-header">';
  html += '<span class="cc-sidebar-label">Claude Code ロードマップ</span>';
  html += '<button class="cc-sidebar-close" aria-label="閉じる">&times;</button>';
  html += '</div>';
  html += '<nav class="cc-sidebar-nav">';

  courses.forEach(function (course, ci) {
    var isOpen = ci === currentCourseIdx;
    html += '<div class="cc-sidebar-course' + (isOpen ? ' is-open' : '') + '" style="--course-accent: ' + course.accent + ';">';
    html += '<button class="cc-sidebar-course-title">' + course.name + '</button>';
    html += '<ul class="cc-sidebar-list">';
    course.articles.forEach(function (a) {
      var isCurrent = a.slug === currentSlug;
      var isRead = readSlugs.indexOf(a.slug) !== -1;
      var cls = '';
      if (isCurrent) cls += ' is-current';
      if (isRead) cls += ' is-read';
      var href = a.slug + '.html';
      html += '<li' + (cls ? ' class="' + cls.trim() + '"' : '') + '>';
      html += '<a href="' + href + '">' + a.title + '</a>';
      html += '</li>';
    });
    html += '</ul>';
    html += '</div>';
  });

  html += '</nav>';

  // Roadmap link — detect path depth
  var roadmapHref = '../claude-code-roadmap.html';
  html += '<a href="' + roadmapHref + '" class="cc-sidebar-roadmap-link">全コース一覧 →</a>';

  // Create aside element
  var aside = document.createElement('aside');
  aside.className = 'cc-sidebar';
  aside.innerHTML = html;

  // Create overlay
  var overlay = document.createElement('div');
  overlay.className = 'cc-sidebar-overlay';

  // Create toggle button
  var toggle = document.createElement('button');
  toggle.className = 'cc-sidebar-toggle';
  toggle.setAttribute('aria-label', 'コース目次');
  toggle.innerHTML = '☰';

  // Insert into DOM
  document.body.appendChild(aside);
  document.body.appendChild(overlay);
  document.body.appendChild(toggle);

  // Toggle open/close for narrow screens
  function openSidebar() {
    aside.classList.add('is-visible');
    overlay.classList.add('is-visible');
  }
  function closeSidebar() {
    aside.classList.remove('is-visible');
    overlay.classList.remove('is-visible');
  }

  toggle.addEventListener('click', function () {
    if (aside.classList.contains('is-visible')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  aside.querySelector('.cc-sidebar-close').addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);

  // Course accordion toggle
  aside.querySelectorAll('.cc-sidebar-course-title').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var course = btn.parentElement;
      course.classList.toggle('is-open');
    });
  });
})();
