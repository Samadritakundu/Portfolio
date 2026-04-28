// Simple fade-in effect for cards as you scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.querySelectorAll('.glass-box').forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "all 0.6s ease-out";
    observer.observe(card);
});
const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');

// 1. Initial full-screen canvas setup
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// 2. Space elements definitions
const stars = [];
const orbits = [];
const centralStar = { x: width / 2, y: height / 2, radius: 50, color: 'rgba(255, 255, 255, 0.15)' }; // Central nebula/star effect
const centerTwinkleGlow = { radius: 100, color: 'rgba(0, 255, 255, 0.05)' }; // Center glow

// 3. Populate space with random twinkling stars
for (let i = 0; i < 400; i++) {
    stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5,
        baseAlpha: Math.random() * 0.8 + 0.2, // Base brightness
        twinkleSpeed: Math.random() * 0.05 + 0.01 // How fast it twinkles
    });
}

// 4. Populate space with orbiting bodies
// Arguments: centralX, centralY, orbitRadiusX, orbitRadiusY, orbitAngleSpeed, color, startAngleOffset
orbits.push(createOrbiter(width / 2, height / 2, 200, 100, 0.005, '#0ff', 0));     // Cyan inner oval
orbits.push(createOrbiter(width / 2, height / 2, 350, 180, -0.003, '#f0f', 1.5));  // Pink oval, reverse direction
orbits.push(createOrbiter(width / 2, height / 2, 500, 250, 0.001, '#fff', 3.0));   // White wide oval
orbits.push(createOrbiter(width / 2, height / 2, 650, 300, 0.002, '#0ff', 4.5));   // Cyan outer oval

// Orbit constructor helper function
function createOrbiter(cX, cY, rX, rY, speed, color, startAngle) {
    return {
        centerX: cX,
        centerY: cY,
        radiusX: rX,
        radiusY: rY,
        speed: speed,
        color: color,
        angle: startAngle,
        drawPath: function() {
            // Draws the faint path lines (optional)
            ctx.beginPath();
            ctx.ellipse(this.centerX, this.centerY, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
            ctx.lineWidth = 1;
            ctx.stroke();
        },
        update: function() {
            // Update the orbiter's position
            this.angle += this.speed;
            const x = this.centerX + Math.cos(this.angle) * this.radiusX;
            const y = this.centerY + Math.sin(this.angle) * this.radiusY;

            // Draw the orbiter particle
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow for next element
        }
    };
}

// 5. Live Animation Loop
function animateSpace() {
    // A. Clear canvas each frame
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // B. Draw Static Elements (Background stars)
    for (let star of stars) {
        // Calculate dynamic twinkle alpha (transparency)
        star.baseAlpha += Math.random() > 0.9 ? -star.twinkleSpeed : star.twinkleSpeed; // Simple random fluctuation
        if (star.baseAlpha > 1 || star.baseAlpha < 0) star.twinkleSpeed *= -1; // Bounce alpha between 0 and 1

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.baseAlpha})`;
        ctx.fill();
    }

    // C. Draw the fixed Center Nebula (like a large galaxy hub)
    ctx.beginPath();
    ctx.arc(centralStar.x, centralStar.y, centralStar.radius, 0, Math.PI * 2);
    ctx.fillStyle = centralStar.color;
    ctx.shadowColor = 'cyan';
    ctx.shadowBlur = 40;
    ctx.fill();

    // D. Draw and Update Orbiting Bodies
    for (let orbit of orbits) {
        orbit.drawPath(); // Faint path line
        orbit.update();   // Animated particle
    }

    // E. Keep animation running
    requestAnimationFrame(animateSpace);
}

// 6. Handle window resize to keep canvas full-screen
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    // Recalculate positions based on new screen size
    centralStar.x = width / 2;
    centralStar.y = height / 2;
    for (let orbit of orbits) {
        orbit.centerX = width / 2;
        orbit.centerY = height / 2;
    }
});

// 7. Start the animation
animateSpace();