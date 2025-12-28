// ===== NAVIGATION FUNCTIONALITY =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

// Sticky navigation on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Active navigation link based on scroll position
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});

// ===== HERO STATS COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-number');
let hasAnimated = false;

const animateCounters = () => {
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    });
};

// Trigger counter animation when hero section is visible
const heroSection = document.querySelector('.hero');
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
            animateCounters();
            hasAnimated = true;
        }
    });
}, { threshold: 0.5 });

heroObserver.observe(heroSection);

// ===== TIMELINE FUNCTIONALITY =====
function toggleDetails(button) {
    const details = button.nextElementSibling;
    const isActive = details.classList.contains('active');
    
    // Close all other details
    document.querySelectorAll('.timeline-details').forEach(detail => {
        detail.classList.remove('active');
    });
    
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.textContent = 'View Details';
    });
    
    // Toggle current details
    if (!isActive) {
        details.classList.add('active');
        button.textContent = 'Hide Details';
    }
}

// Animate timeline items on scroll
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
        }
    });
}, { threshold: 0.1 });

timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-50px)';
    item.style.transition = 'all 0.6s ease-out';
    timelineObserver.observe(item);
});

// ===== STATS SECTION =====
// Animate stat bars on scroll
const statBars = document.querySelectorAll('.stat-bar-fill');
const statsSection = document.querySelector('.stats-section');
let statsBarsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsBarsAnimated) {
            statBars.forEach(bar => {
                const percent = bar.getAttribute('data-percent');
                bar.style.width = percent + '%';
            });
            statsBarsAnimated = true;
        }
    });
}, { threshold: 0.3 });

statsObserver.observe(statsSection);

// Century Chart using Canvas
const centuryChart = document.getElementById('centuryChart');
if (centuryChart) {
    const ctx = centuryChart.getContext('2d');
    const data = [
        { label: 'Tests', value: 29, color: '#00d4ff' },
        { label: 'ODIs', value: 50, color: '#ff006e' },
        { label: 'T20Is', value: 1, color: '#ffbe0b' }
    ];
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -Math.PI / 2;
    
    centuryChart.width = 300;
    centuryChart.height = 250;
    
    const centerX = 150;
    const centerY = 125;
    const radius = 80;
    
    data.forEach(item => {
        const sliceAngle = (item.value / total) * 2 * Math.PI;
        
        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();
        
        // Draw label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.value, labelX, labelY);
        
        currentAngle += sliceAngle;
    });
}

// Stats table filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const tableRows = document.querySelectorAll('#statsTable tbody tr');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-format');
        
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        tableRows.forEach(row => {
            const rowFormat = row.getAttribute('data-format');
            if (filter === 'all' || rowFormat === filter) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
});

// ===== GALLERY SECTION =====
const galleryData = [
    {
        src: '5.jpg',
        title: '100th Test Match',
        category: 'centuries',
        caption: 'Virat Kohli celebrating his milestone 100th Test match'
    },
    {
        src: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
        title: 'World Cup Glory',
        category: 'celebrations',
        caption: '2011 World Cup victory celebration'
    },
    {
        src: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?w=800',
        title: 'Champions Trophy',
        category: 'awards',
        caption: 'ICC Champions Trophy 2013 winner'
    },
    {
        src: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800',
        title: 'Captain Leading',
        category: 'captaincy',
        caption: 'Leading India to historic Test victories'
    },
    {
        src: '3.jpeg',
        title: '50th ODI Century',
        category: 'centuries',
        caption: 'Record-breaking 50th ODI century'
    },
    {
        src: '4.jpg',
        title: 'T20 World Cup',
        category: 'celebrations',
        caption: '2024 T20 World Cup champion'
    },
    {
        src: '6.jpeg',
        title: 'ICC Award',
        category: 'awards',
        caption: 'ICC Cricketer of the Year'
    },
    {
        src: '7.webp',
        title: 'Test Captain',
        category: 'captaincy',
        caption: 'Most successful Indian Test captain'
    },
    {
        src: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
        title: 'Double Century',
        category: 'centuries',
        caption: 'One of many Test double hundreds'
    },
    {
        src: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?w=800',
        title: 'Victory Lap',
        category: 'celebrations',
        caption: 'Celebrating with teammates'
    },
    {
        src: '9.jpg',
        title: 'Padma Shri',
        category: 'awards',
        caption: 'Receiving Padma Shri honor'
    },
    {
        src: '8.jpg',
        title: 'Strategic Leader',
        category: 'captaincy',
        caption: 'Known for aggressive captaincy'
    }
];

const galleryGrid = document.getElementById('galleryGrid');
const galleryFilters = document.querySelectorAll('.gallery-filter');

// Populate gallery
function populateGallery(filter = 'all') {
    galleryGrid.innerHTML = '';
    
    const filteredData = filter === 'all' 
        ? galleryData 
        : galleryData.filter(item => item.category === filter);
    
    filteredData.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-index', index);
        galleryItem.innerHTML = `
            <img src="${item.src}" alt="${item.title}">
            <div class="gallery-overlay">
                <h4>${item.title}</h4>
                <p>${item.category}</p>
            </div>
        `;
        galleryItem.addEventListener('click', () => openModal(item, index));
        galleryGrid.appendChild(galleryItem);
    });
}

populateGallery();

// Gallery filtering
galleryFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        galleryFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        
        const category = filter.getAttribute('data-filter');
        populateGallery(category);
    });
});

// Gallery modal
const modal = document.getElementById('galleryModal');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');
const closeModal = document.querySelector('.modal-close');
const prevBtn = document.querySelector('.modal-prev');
const nextBtn = document.querySelector('.modal-next');

let currentImageIndex = 0;
let currentGalleryData = galleryData;

function openModal(item, index) {
    modal.style.display = 'block';
    modalImg.src = item.src;
    modalCaption.textContent = item.caption;
    currentImageIndex = index;
    
    const activeFilter = document.querySelector('.gallery-filter.active').getAttribute('data-filter');
    currentGalleryData = activeFilter === 'all' 
        ? galleryData 
        : galleryData.filter(i => i.category === activeFilter);
}

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

prevBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + currentGalleryData.length) % currentGalleryData.length;
    const item = currentGalleryData[currentImageIndex];
    modalImg.src = item.src;
    modalCaption.textContent = item.caption;
});

nextBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % currentGalleryData.length;
    const item = currentGalleryData[currentImageIndex];
    modalImg.src = item.src;
    modalCaption.textContent = item.caption;
});

// Keyboard navigation for modal
document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
        if (e.key === 'Escape') modal.style.display = 'none';
    }
});

// ===== FAN FORM =====
const fanForm = document.getElementById('fanForm');
const formMessage = document.getElementById('formMessage');

fanForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate form submission
    formMessage.textContent = 'Thank you for your message! We appreciate your support for Virat Kohli.';
    formMessage.classList.add('success');
    
    fanForm.reset();
    
    setTimeout(() => {
        formMessage.style.display = 'none';
        formMessage.classList.remove('success');
    }, 5000);
});

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / 700);
    }
});

// ===== LAZY LOADING IMAGES =====
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ===== ANIMATION ON SCROLL =====
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.stat-card, .social-card, .award-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initialize elements for animation
document.querySelectorAll('.stat-card, .social-card, .award-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease-out';
});

window.addEventListener('scroll', animateOnScroll);
animateOnScroll();

// ===== MAP MARKERS ANIMATION =====
const mapMarkers = document.querySelectorAll('.map-marker');
mapMarkers.forEach((marker, index) => {
    setTimeout(() => {
        marker.style.opacity = '1';
        marker.style.transform = 'scale(1)';
    }, index * 200);
    
    marker.style.opacity = '0';
    marker.style.transform = 'scale(0)';
    marker.style.transition = 'all 0.5s ease-out';
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
window.addEventListener('scroll', debounce(() => {
    // Scroll-dependent functions already called above
}, 10));

// ===== INITIAL PAGE LOAD ANIMATIONS =====
window.addEventListener('load', () => {
    document.body.style.overflow = 'auto';
    
    // Fade in page content
    document.querySelectorAll('section').forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

console.log('Virat Kohli Portfolio - All systems operational! 🏏');