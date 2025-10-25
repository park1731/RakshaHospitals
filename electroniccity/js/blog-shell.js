// Inject site header/footer and wrap legacy blog content with our layout
document.addEventListener('DOMContentLoaded', () => {
  const prefix = '../'; // blogs are one level deep

  const headerHtml = `
    <header class="header" data-app-header>
      <div class="container">
        <nav class="nav-container">
          <div class="logo">Raksha<span>Hospital</span></div>
          <ul class="nav-menu">
            <li><a href="${prefix}index.html" class="nav-link">Home</a></li>
            <li><a href="${prefix}doctors.html" class="nav-link">Doctors</a></li>
            <li><a href="${prefix}health-check.html" class="nav-link">Health Check</a></li>
            <li><a href="${prefix}blogs.html" class="nav-link active">Blogs</a></li>
            <li><a href="${prefix}appointment.html" class="nav-link">Appointment</a></li>
            <li><a href="${prefix}contact.html" class="nav-link">Contact</a></li>
          </ul>
          <div class="hamburger"><span></span><span></span><span></span></div>
        </nav>
      </div>
    </header>`;

  const footerHtml = `
    <footer class="footer" data-app-footer>
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>Raksha Hospital</h3>
            <p>Articles curated by our multi‑specialists for your health.</p>
          </div>
          <div class="footer-section">
            <h3>Quick Links</h3>
            <p><a href="${prefix}index.html">Home</a></p>
            <p><a href="${prefix}health-check.html">Health Check</a></p>
            <p><a href="${prefix}blogs.html">Blogs</a></p>
            <p><a href="${prefix}appointment.html">Appointment</a></p>
          </div>
          <div class="footer-section">
            <h3>Contact</h3>
            <p>📍 123 Medical Center Drive, Healthcare City</p>
            <p>📞 +1 (555) 123-4567</p>
            <p>📧 rakshahospital.electroniccity@gmail.com</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2024 Raksha Hospital. All rights reserved.</p>
        </div>
      </div>
    </footer>`;

  // Insert header at top
  document.body.insertAdjacentHTML('afterbegin', headerHtml);

  // Collect existing nodes except our new header
  const contentNodes = Array.from(document.body.children).filter(
    (el) => !el.hasAttribute('data-app-header') && !el.hasAttribute('data-app-footer')
  );

  // Remove legacy headers/footers/topbars if present
  contentNodes.forEach((el) => {
    if (el.matches('header, .topbar, .header-inner, .footer, .footer-area, .preloader')) {
      el.remove();
    }
  });

  // Create our content wrapper
  const section = document.createElement('section');
  section.className = 'section';
  const container = document.createElement('div');
  container.className = 'container';
  section.appendChild(container);

  // Move remaining nodes into our container
  const leftovers = Array.from(document.body.children).filter(
    (el) => !el.hasAttribute('data-app-header') && !el.hasAttribute('data-app-footer')
  );
  leftovers.forEach((el) => container.appendChild(el));

  // Append content section just after header
  const headerEl = document.querySelector('[data-app-header]');
  headerEl.insertAdjacentElement('afterend', section);

  // Append footer at the end
  document.body.insertAdjacentHTML('beforeend', footerHtml);

  // Enhance content: add animation classes to top-level headings
  container.querySelectorAll('h1, h2, h3, p, li').forEach((el) => {
    el.classList.add('fade-in');
  });
});

