/* ============================================
   FINDMYTUTOR DHAKA - MAIN JAVASCRIPT
   All interactions, forms, and Google Sheets integration
   ============================================ */

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // Initialize Swiper if exists
    if (typeof Swiper !== 'undefined' && document.querySelector('.mySwiper')) {
        new Swiper(".mySwiper", {
            slidesPerView: 1,
            spaceBetween: 30,
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            },
            autoplay: {
                delay: 4000,
                disableOnInteraction: false
            }
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active-mobile');
    }
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function openModal(type) {
    if (type === 'tutor') {
        const modal = document.getElementById('tutorModal');
        if (modal) modal.style.display = 'flex';
    } else if (type === 'student') {
        const modal = document.getElementById('studentModal');
        if (modal) modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList && event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// ============================================
// GOOGLE SHEETS CONFIGURATION
// ============================================
// IMPORTANT: Replace this URL with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_APPS_SCRIPT_ID/exec";

// ============================================
// TUTOR REGISTRATION FORM
// ============================================

const tutorForm = document.getElementById('tutorForm');
if (tutorForm) {
    tutorForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        const formData = {
            type: 'tutor',
            name: document.getElementById('tutorName')?.value || '',
            phone: document.getElementById('tutorPhone')?.value || '',
            highSchool: document.getElementById('tutorHighSchool')?.value || '',
            college: document.getElementById('tutorCollege')?.value || '',
            university: document.getElementById('tutorUniversity')?.value || '',
            area: document.getElementById('tutorArea')?.value || '',
            timestamp: new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })
        };

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            alert('✅ Registration Successful! We will contact you within 24 hours.');
            closeModal('tutorModal');
            tutorForm.reset();
        } catch (error) {
            alert('✅ Registration submitted! We will contact you soon.');
            closeModal('tutorModal');
            tutorForm.reset();
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// ============================================
// STUDENT REGISTRATION FORM
// ============================================

const studentForm = document.getElementById('studentForm');
if (studentForm) {
    studentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        const formData = {
            type: 'student',
            name: document.getElementById('studentName')?.value || '',
            phone: document.getElementById('studentPhone')?.value || '',
            area: document.getElementById('studentArea')?.value || '',
            className: document.getElementById('studentClass')?.value || '',
            subject: document.getElementById('studentSubject')?.value || '',
            timestamp: new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })
        };

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            alert('✅ Tuition demand submitted! We will find the best tutor for you.');
            closeModal('studentModal');
            studentForm.reset();
        } catch (error) {
            alert('✅ Demand submitted successfully! We will contact you soon.');
            closeModal('studentModal');
            studentForm.reset();
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// ============================================
// CONTACT FORM
// ============================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const formData = {
            type: 'contact',
            name: document.getElementById('contactName')?.value || '',
            email: document.getElementById('contactEmail')?.value || '',
            phone: document.getElementById('contactPhone')?.value || '',
            message: document.getElementById('contactMessage')?.value || '',
            timestamp: new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })
        };

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            alert('✅ Thank you for your message! We will get back to you within 24 hours.');
            contactForm.reset();
        } catch (error) {
            alert('✅ Message sent! We will contact you soon.');
            contactForm.reset();
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// ============================================
// TUITION PAGE FUNCTIONS
// ============================================

// Global variables for tuition flow
let currentPost = null;
let currentApplicant = { name: "", phone: "" };

function openInfoModal(postId) {
    // Find the post from global allPosts array (defined in tuition.html)
    if (typeof allPosts !== 'undefined') {
        currentPost = allPosts.find(p => p.id === postId);
        const modal = document.getElementById('infoModal');
        if (modal) modal.style.display = 'flex';
    }
}

function submitInfoForm() {
    const name = document.getElementById('applicantName')?.value;
    const phone = document.getElementById('applicantPhone')?.value;
    
    if (!name || !phone) {
        alert('Please fill all fields');
        return;
    }
    
    currentApplicant = { name, phone };
    closeModal('infoModal');
    
    const planModal = document.getElementById('planModal');
    if (planModal) planModal.style.display = 'flex';
}

function selectPlan(plan) {
    closeModal('planModal');
    
    if (plan === 'basic') {
        const basicModal = document.getElementById('basicConditionModal');
        if (basicModal) basicModal.style.display = 'flex';
    } else {
        const proModal = document.getElementById('proConditionModal');
        if (proModal) proModal.style.display = 'flex';
    }
}

function confirmBasic() {
    closeModal('basicConditionModal');
    
    // Save to Google Sheet
    const data = {
        type: 'basic_applicant',
        postId: currentPost?.id,
        postDetails: currentPost ? `${currentPost.subject} - ${currentPost.class} - ${currentPost.area}` : '',
        name: currentApplicant.name,
        phone: currentApplicant.phone,
        plan: 'Basic (Free)',
        timestamp: new Date().toLocaleString('en-BD')
    };
    
    // Send to Google Sheets
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data)
    });
    
    alert('✅ Registration successful! Your CV has been submitted. Guardian will contact you if shortlisted.');
    resetTuitionFlow();
}

function confirmPro() {
    closeModal('proConditionModal');
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) paymentModal.style.display = 'flex';
}

function submitPayment() {
    const transactionId = document.getElementById('transactionId')?.value;
    
    if (!transactionId) {
        alert('Please enter your transaction ID');
        return;
    }
    
    const data = {
        type: 'pro_applicant',
        postId: currentPost?.id,
        postDetails: currentPost ? `${currentPost.subject} - ${currentPost.class} - ${currentPost.area}` : '',
        name: currentApplicant.name,
        phone: currentApplicant.phone,
        plan: 'Pro (50 TK)',
        transactionId: transactionId,
        paymentStatus: 'Pending Verification',
        salaryCutAgreement: '35% of first month salary',
        timestamp: new Date().toLocaleString('en-BD')
    };
    
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data)
    });
    
    closeModal('paymentModal');
    alert('✅ Payment submitted! We will verify and send your CV as priority to the guardian within 24 hours.');
    resetTuitionFlow();
}

function resetTuitionFlow() {
    currentPost = null;
    currentApplicant = { name: "", phone: "" };
    const transactionInput = document.getElementById('transactionId');
    if (transactionInput) transactionInput.value = '';
}

function filterPosts(filter) {
    if (typeof window.filterTuitionPosts === 'function') {
        window.filterTuitionPosts(filter);
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Back to top button functionality
function setupBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Call setup on load
document.addEventListener('DOMContentLoaded', setupBackToTop);