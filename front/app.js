// Shared Nav Component - edit once, applies everywhere
const navLinks = [
    { href: 'index.html', label: 'Dashboard' },
    { href: 'user-profile.html', label: 'User Profile' },
    { href: 'settings.html', label: 'Settings' }
];

function initNav() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    const pathname = window.location.pathname || '';
    const base = pathname.indexOf('demo_user') !== -1 ? '../front/' : ''; //app.js should not care that it's 'demo_user' it only knows it's loading a user, 
    const currentPage = pathname.split('/').pop() || 'index.html';
    nav.innerHTML = `
        <a href="${base}index.html" class="logo">Dementia TV</a>
        ${navLinks.map(link =>
            `<a href="${base}${link.href}" ${link.href === currentPage ? 'class="active"' : ''}>${link.label}</a>`
        ).join('')}
    `;
    
    // Add pop animation to nav links
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            console.log('nav button was clicked');
            this.classList.add('pop');
            setTimeout(() => this.classList.remove('pop'), 1000);
        });
    });
}

// Data Service - LocalStorage wrapper (easy to swap to API later)
const DataService = {
    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
        localStorage.removeItem(key);
    }
};

// Initialize nav on page load
initNav();
