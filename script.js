// Three.js Animation
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('animation-canvas'), alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Central sphere (black hole/planet)
const sphereRadius = 0.5;
const sphereParticlesCount = 2000;
const sphereGeometry = new THREE.BufferGeometry();
const spherePositions = new Float32Array(sphereParticlesCount * 3);

for (let i = 0; i < sphereParticlesCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
    const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
    const z = sphereRadius * Math.cos(phi);

    spherePositions[i * 3] = x;
    spherePositions[i * 3 + 1] = y;
    spherePositions[i * 3 + 2] = z;
}

sphereGeometry.setAttribute('position', new THREE.BufferAttribute(spherePositions, 3));
const sphereMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0xffffff,
    transparent: true,
    blending: THREE.AdditiveBlending,
});
const sphereMesh = new THREE.Points(sphereGeometry, sphereMaterial);
scene.add(sphereMesh);

// Rings
const ringGeometry = new THREE.RingGeometry(0.7, 0.8, 64);
const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2;
scene.add(ring);

// Particles (atoms)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 5;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0xffffff,
    transparent: true,
    blending: THREE.AdditiveBlending,
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Emitting particles
const emittingParticlesGeometry = new THREE.BufferGeometry();
const emittingParticlesCount = 200;
const emittingPosArray = new Float32Array(emittingParticlesCount * 3);
const emittingVelocityArray = new Float32Array(emittingParticlesCount * 3);

for(let i = 0; i < emittingParticlesCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const radius = sphereRadius + Math.random() * 0.1;

    emittingPosArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    emittingPosArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    emittingPosArray[i * 3 + 2] = radius * Math.cos(phi);

    emittingVelocityArray[i * 3] = (Math.random() - 0.5) * 0.01;
    emittingVelocityArray[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
    emittingVelocityArray[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
}

emittingParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(emittingPosArray, 3));
emittingParticlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(emittingVelocityArray, 3));

const emittingParticlesMaterial = new THREE.PointsMaterial({
    size: 0.01,
    color: 0xffffff,
    transparent: true,
    blending: THREE.AdditiveBlending,
});

const emittingParticlesMesh = new THREE.Points(emittingParticlesGeometry, emittingParticlesMaterial);
scene.add(emittingParticlesMesh);

camera.position.z = 2;

function animate() {
    requestAnimationFrame(animate);

    // Rotate sphere and ring
    sphereMesh.rotation.y += 0.005;
    ring.rotation.z += 0.002;

    // Rotate particle system
    particlesMesh.rotation.x += 0.0005;
    particlesMesh.rotation.y += 0.0005;

    // Animate emitting particles
    const positions = emittingParticlesMesh.geometry.attributes.position.array;
    const velocities = emittingParticlesMesh.geometry.attributes.velocity.array;

    for(let i = 0; i < emittingParticlesCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];

        // Reset particle if it goes too far
        if (Math.abs(positions[i * 3]) > 2 || Math.abs(positions[i * 3 + 1]) > 2 || Math.abs(positions[i * 3 + 2]) > 2) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const radius = sphereRadius + Math.random() * 0.1;

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
        }
    }

    emittingParticlesMesh.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

animate();

// Responsive design
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Navigation and scrolling
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const header = document.getElementById('header');
const heroContent = document.getElementById('hero-content');

function setActiveSection() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    sections.forEach((section) => {
        if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
            const sectionId = section.getAttribute('id');
            navLinks.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
            });
        }
    });

    // Show/hide hero content based on scroll position
    heroContent.classList.toggle('hero-visible', window.scrollY < window.innerHeight / 2);
}

window.addEventListener('scroll', setActiveSection);

function scrollToSection(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    window.scrollTo({
        top: targetSection.offsetTop - header.offsetHeight,
        behavior: 'smooth'
    });
    if (mobileMenu.classList.contains('show')) {
        toggleMobileMenu();
    }
}

navLinks.forEach(link => link.addEventListener('click', scrollToSection));
mobileNavLinks.forEach(link => link.addEventListener('click', scrollToSection));

function toggleMobileMenu() {
    mobileMenu.classList.toggle('show');
    menuToggle.classList.toggle('active');
}

menuToggle.addEventListener('click', toggleMobileMenu);

// Animate elements on scroll
const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
};

const scrollObserver = new IntersectionObserver(animateOnScroll, {
    root: null,
    threshold: 0.1
});

document.querySelectorAll('.feature-card, .about-content > *').forEach(el => {
    scrollObserver.observe(el);
});

// Initialize hero visibility
setActiveSection();

// Add this to your existing script.js file

// Create custom scrollbar elements
const customScrollbar = document.createElement('div');
customScrollbar.id = 'custom-scrollbar';
const customScrollbarThumb = document.createElement('div');
customScrollbarThumb.id = 'custom-scrollbar-thumb';
customScrollbar.appendChild(customScrollbarThumb);
document.body.appendChild(customScrollbar);

// Calculate and set the size of the scrollbar thumb
function setScrollbarHeight() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPercentage = windowHeight / documentHeight;
    const thumbHeight = windowHeight * scrollPercentage;
    customScrollbarThumb.style.height = `${thumbHeight}px`;
}

// Update scrollbar thumb position
function updateScrollbarPosition() {
    const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const thumbPosition = scrollPercentage * (window.innerHeight - customScrollbarThumb.offsetHeight);
    customScrollbarThumb.style.top = `${thumbPosition}px`;
}

// Initialize scrollbar
setScrollbarHeight();
updateScrollbarPosition();

// Update scrollbar on scroll and resize
window.addEventListener('scroll', updateScrollbarPosition);
window.addEventListener('resize', () => {
    setScrollbarHeight();
    updateScrollbarPosition();
});

// Make the scrollbar draggable
let isDragging = false;
let startY;
let startScrollY;

customScrollbarThumb.addEventListener('mousedown', (e) => {
    isDragging = true;
    startY = e.clientY - customScrollbarThumb.offsetTop;
    startScrollY = window.scrollY;
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const y = e.clientY - customScrollbar.getBoundingClientRect().top;
    const percentY = y / window.innerHeight;
    const newScrollY = percentY * (document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo(0, newScrollY);
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Automatically fade out hero content after a delay
function autoFadeOutHeroContent() {
    // Set a delay before starting the fade-out (e.g., 3 seconds)
    setTimeout(() => {
        heroContent.style.opacity = 0; // Fade out to full transparency
    }, 3000); // 3000ms = 3 seconds
}

// Smooth transition for the fade effect
heroContent.style.transition = 'opacity 1s ease'; // 1 second for the fade-out

// Call the auto fade-out function on page load
window.addEventListener('DOMContentLoaded', autoFadeOutHeroContent);

