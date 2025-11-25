// Brands carousel auto-slide
const brandsCarousel = document.querySelector('.brands-carousel');
const brandsTrack = document.querySelector('.brands-track');
const brandsSlides = document.querySelectorAll('.brands-slide');
const prevBrandButton = document.getElementById('prev-brand');
const nextBrandButton = document.getElementById('next-brand');

let brandCurrentSlide = 0;
let brandInterval;

const setupBrandsCarousel = () => {
    // Clone slides for infinite effect
    brandsSlides.forEach(slide => {
        const clone = slide.cloneNode(true);
        brandsTrack.appendChild(clone);
    });

    const allBrandSlides = document.querySelectorAll('.brands-slide');
    const brandSlideCount = allBrandSlides.length;

    let slidesToShow = 2;
    if (window.innerWidth >= 640) slidesToShow = 3;
    if (window.innerWidth >= 768) slidesToShow = 5;

    function updateBrandsCarousel() {
        const translateX = - (brandCurrentSlide * (100 / slidesToShow));
        brandsTrack.style.transition = 'transform 0.5s ease-in-out';
        brandsTrack.style.transform = `translateX(${translateX}%)`;

        if (brandCurrentSlide >= brandsSlides.length) {
            setTimeout(() => {
                brandsTrack.style.transition = 'none';
                brandCurrentSlide = 0;
                brandsTrack.style.transform = `translateX(0%)`;
            }, 500);
        }
    }

    function nextBrandSlide() {
        brandCurrentSlide++;
        updateBrandsCarousel();
    }

    function prevBrandSlide() {
        if (brandCurrentSlide === 0) {
            brandCurrentSlide = brandsSlides.length;
            const translateX = - (brandCurrentSlide * (100 / slidesToShow));
            brandsTrack.style.transition = 'none';
            brandsTrack.style.transform = `translateX(${translateX}%)`;
            setTimeout(() => {
                brandCurrentSlide--;
                brandsTrack.style.transition = 'transform 0.5s ease-in-out';
                updateBrandsCarousel();
            }, 50);
        } else {
            brandCurrentSlide--;
            updateBrandsCarousel();
        }
    }

    function startBrandAutoSlide() {
        brandInterval = setInterval(nextBrandSlide, 3000);
    }

    function stopBrandAutoSlide() {
        clearInterval(brandInterval);
    }

    // Event Listeners
    nextBrandButton.addEventListener('click', () => {
        stopBrandAutoSlide();
        nextBrandSlide();
        startBrandAutoSlide();
    });

    prevBrandButton.addEventListener('click', () => {
        stopBrandAutoSlide();
        prevBrandSlide();
        startBrandAutoSlide();
    });

    brandsCarousel.addEventListener('mouseenter', stopBrandAutoSlide);
    brandsCarousel.addEventListener('mouseleave', startBrandAutoSlide);

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 640) slidesToShow = 3;
        if (window.innerWidth >= 768) slidesToShow = 5;
        updateBrandsCarousel();
    });

    startBrandAutoSlide();
    updateBrandsCarousel();
};

setupBrandsCarousel();

// Initialize Lucide icons
lucide.createIcons();

// --- Dark Mode Toggle ---
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const sunIcon = document.getElementById('theme-icon-sun');
const moonIcon = document.getElementById('theme-icon-moon');
const sunIconMobile = document.getElementById('theme-icon-sun-mobile');
const moonIconMobile = document.getElementById('theme-icon-moon-mobile');
const html = document.documentElement;

// Function to set theme
function setTheme(isDark) {
    if (isDark) {
        html.classList.add('dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
        sunIconMobile.classList.remove('hidden');
        moonIconMobile.classList.add('hidden');
        localStorage.setItem('theme', 'dark');
    } else {
        html.classList.remove('dark');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
        sunIconMobile.classList.add('hidden');
        moonIconMobile.classList.remove('hidden');
        localStorage.setItem('theme', 'light');
    }
    // Re-initialize icons after class changes
    lucide.createIcons();
}

// Check for saved theme
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Set initial theme
const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark;
setTheme(initialDark);

// Toggle listener
const toggleHandler = () => {
    setTheme(!html.classList.contains('dark'));
};
themeToggle.addEventListener('click', toggleHandler);
themeToggleMobile.addEventListener('click', toggleHandler);


// --- Mobile Menu Toggle ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// --- Scroll to Top Button ---
const scrollToTopButton = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopButton.classList.remove('hidden');
    } else {
        scrollToTopButton.classList.add('hidden');
    }
});

scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// --- Set current year in footer ---
document.getElementById('current-year').textContent = new Date().getFullYear();

// --- Project Gallery Filter ---
const filterButtons = document.querySelectorAll('#filter-buttons .filter-btn');
const galleryItems = document.querySelectorAll('#project-gallery .gallery-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Set active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.dataset.filter;

        // Show/hide gallery items
        galleryItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// --- Contact Form ---
const contactForm = document.getElementById('contact-form');
const formSuccessMessage = document.getElementById('form-success');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Here you would typically send the form data to a server
    // For this demo, we'll just show a success message
    formSuccessMessage.classList.remove('hidden');
    contactForm.reset();

    // Hide the message after 3 seconds
    setTimeout(() => {
        formSuccessMessage.classList.add('hidden');
    }, 3000);
});

// --- Lazy Loading Animations ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // If it's a progress bar, animate it
            if (entry.target.classList.contains('progress-bar-inner')) {
                const width = entry.target.getAttribute('data-width');
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 300);
            }
            
            // If it's a stagger item, add delay based on index
            if (entry.target.classList.contains('stagger-item')) {
                const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
        }
    });
}, observerOptions);

// Observe all elements with animation classes
document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .stagger-item, .progress-bar-inner').forEach(el => {
    observer.observe(el);
});

// Animate skill bars when skills section is in view
const skillsSection = document.getElementById('skills');
const skillBars = document.querySelectorAll('.progress-bar-inner');

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width;
                }, 300);
            });
        }
    });
}, { threshold: 0.3 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// --- Testimonial Carousel ---
const testimonialTrack = document.querySelector('.testimonial-track');
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.carousel-dot');
const prevButton = document.getElementById('prev-testimonial');
const nextButton = document.getElementById('next-testimonial');

let currentSlide = 0;
let slideInterval;
const slideCount = testimonialSlides.length;

// Clone slides for infinite effect
testimonialSlides.forEach(slide => {
    const clone = slide.cloneNode(true);
    testimonialTrack.appendChild(clone);
});

// Function to update carousel position
function updateCarousel() {
    const allSlides = document.querySelectorAll('.testimonial-slide');
    const allSlidesCount = allSlides.length;
    let slidesToShow = 1;
    if (window.innerWidth >= 768) slidesToShow = 2;
    if (window.innerWidth >= 1024) slidesToShow = 3;

    const translateX = -(currentSlide * (100 / slidesToShow));
    testimonialTrack.style.transition = 'transform 0.5s ease-in-out';
    testimonialTrack.style.transform = `translateX(${translateX}%)`;

    // Update active dot
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === (currentSlide % slideCount));
    });

    if (currentSlide >= slideCount) {
        setTimeout(() => {
            testimonialTrack.style.transition = 'none';
            currentSlide = 0;
            testimonialTrack.style.transform = `translateX(0%)`;
        }, 500);
    }
}

// Function to go to a specific slide
function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
}

// Function to go to next slide
function nextSlide() {
    currentSlide++;
    updateCarousel();
}

// Function to start auto sliding
function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

// Function to stop auto sliding
function stopAutoSlide() {
    clearInterval(slideInterval);
}

// Initialize carousel
updateCarousel();
startAutoSlide();

// Event listeners for navigation
prevButton.addEventListener('click', () => {
    stopAutoSlide();
    if (currentSlide === 0) {
        currentSlide = slideCount;
        testimonialTrack.style.transition = 'none';
        const translateX = -(currentSlide * (100 / (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1)));
        testimonialTrack.style.transform = `translateX(${translateX}%)`;
        setTimeout(() => {
            currentSlide--;
            updateCarousel();
        }, 50);
    } else {
        currentSlide--;
        updateCarousel();
    }
    startAutoSlide();
});

nextButton.addEventListener('click', () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
});

// Event listeners for dots
dots.forEach(dot => {
    dot.addEventListener('click', () => {
        stopAutoSlide();
        const slideIndex = parseInt(dot.getAttribute('data-slide'));
        goToSlide(slideIndex);
        startAutoSlide();
    });
});

// Pause auto sliding when hovering over carousel
testimonialTrack.addEventListener('mouseenter', stopAutoSlide);
testimonialTrack.addEventListener('mouseleave', startAutoSlide);

// Update carousel on window resize
window.addEventListener('resize', updateCarousel);
