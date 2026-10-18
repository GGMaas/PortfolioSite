const create_blog = (title, description, date, dateLabel, isFuture = false) => ({
  title,
  description,
  date,
  dateLabel,
  isFuture
});

const blogs = [

  create_blog(
    "More Logs Coming Soon...",
    "New articles and project reflections will be posted here as I progress through my Software Engineering course.",
    "2028-10-01",
    "Future Update",
    true
  ),
  create_blog(
    "Improved my portfolio site",
    "Added lazy loading to the images for better performance, also made my site a bit more interactive with JavaScript.",
    "2026-09-30",
    "End-September 2026"
  ),
  create_blog(
    "Building My Portfolio Website",
    "Designing and implementing a modern black & orange themed portfolio for WPFW using HTML, CSS, and JS.",
    "2026-09-01",
    "Begin-September 2026"
  )
];

function sortBlogs(blogList, sortBy) {
  const sorted = [...blogList];

  if (sortBy === 'date-asc') {
    return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderBlogs(blogList) {
  const blogTimeline = document.getElementById('blog-timeline');
  if (!blogTimeline) return;

  blogTimeline.innerHTML = blogList
    .map(
      (blog) => `
        <article class="blog-card ${blog.isFuture ? 'future-post' : ''}">
          <span class="blog-date">${blog.dateLabel}</span>
          <h3>${blog.title}</h3>
          <p>${blog.description}</p>
        </article>
      `
    )
    .join('');
}

function updateBlogs(sortMethod) {
  const sortedBlogs = sortBlogs(blogs, sortMethod);
  renderBlogs(sortedBlogs);
}

function initializeBlogs() {
  const sortSelect = document.getElementById('blog-sort-select');
  const initialSort = sortSelect ? sortSelect.value : 'date-desc';

  updateBlogs(initialSort);

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      updateBlogs(sortSelect.value);
    });
  }

}

initializeBlogs();
