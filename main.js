import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    setupCanvasAnimation();
    setupTiltEffect();
});

function setupCanvasAnimation() {
    const canvas = document.getElementById("bg-canvas");
    const context = canvas.getContext("2d");
    
    // Total number of extracted frames
    const frameCount = 220;
    const currentFrame = index => (
        `/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
    );

    const images = [];
    const scooter = {
        frame: 0
    };

    // Preload all images and init canvas metrics
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }

    images[0].onload = () => {
        // Match the canvas resolution to the image source native resolution
        canvas.width = images[0].width;
        canvas.height = images[0].height;
        render();
    };

    function render() {
        if (images[scooter.frame].complete) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(images[scooter.frame], 0, 0);
        }
    }

    // Scroll-bound scrubbing for the image sequence
    gsap.to(scooter, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
            trigger: ".story-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5 // Light smoothing for native buttery feel
        },
        onUpdate: render // Renders the canvas whenever the playhead moves
    });

    // Glass panel appearances
    const steps = gsap.utils.toArray(".step");
    steps.forEach((step, i) => {
        const panel = step.querySelector(".glass-panel");
        gsap.fromTo(panel, 
            { opacity: 0, y: 50 },
            {
                opacity: 1, 
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: step,
                    start: "top center+=20%",
                    end: "center center-=10%",
                    toggleActions: "play reverse play reverse",
                    scrub: false
                }
            }
        );
    });
}

function setupTiltEffect() {
    const panels = document.querySelectorAll(".glass-panel");
    panels.forEach(panel => {
        panel.addEventListener("mousemove", (e) => {
            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            panel.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        panel.addEventListener("mouseleave", () => {
            panel.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}
