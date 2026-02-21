const body = document.body;
const hero = document.getElementById("hero");
const curtainOverlay = document.getElementById("curtainOverlay");
const openPrompt = document.getElementById("openPrompt");
const curtainLogoLeft = document.getElementById("curtainLogoLeft");
const curtainLogoRight = document.getElementById("curtainLogoRight");
const posterWrap = document.getElementById("posterWrap");
const invitePoster = document.getElementById("invitePoster");
const revealElements = document.querySelectorAll(".reveal");
const countdownEl = document.getElementById("countdown");
const weddingDate = new Date("2026-04-20T18:30:00");

let inviteOpened = false;

function updateCurtainPageVisibility() {
    if (!hero) {
        return;
    }

    const firstPageLimit = hero.offsetHeight - 24;
    const hasScrolledOnFirstPage = window.scrollY > 12;
    const isPastFirstPage = window.scrollY > firstPageLimit;

    body.classList.toggle("curtain-at-walls", inviteOpened && hasScrolledOnFirstPage && !isPastFirstPage);
    body.classList.toggle("curtain-out-of-page", inviteOpened && isPastFirstPage);
}

function openInvitation() {
    if (inviteOpened) {
        return;
    }

    inviteOpened = true;
    body.classList.add("invite-open");
    updateCurtainPageVisibility();
}

function closeInvitation() {
    if (!inviteOpened) {
        return;
    }

    inviteOpened = false;
    body.classList.remove("invite-open");
    body.classList.remove("curtain-at-walls");
    body.classList.remove("curtain-out-of-page");
}

if (curtainOverlay) {
    curtainOverlay.addEventListener("pointerdown", openInvitation, { passive: true });
}

if (openPrompt) {
    openPrompt.addEventListener("click", openInvitation);
    openPrompt.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openInvitation();
        }
    });
}

function bindCurtainLogo(logoButton) {
    if (!logoButton) {
        return;
    }

    logoButton.addEventListener("pointerdown", (event) => {
        event.stopPropagation();
    });

    logoButton.addEventListener("click", (event) => {
        event.stopPropagation();

        if (inviteOpened) {
            closeInvitation();
            return;
        }

        openInvitation();
    });
}

bindCurtainLogo(curtainLogoLeft);
bindCurtainLogo(curtainLogoRight);

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (!canHover) {
    body.classList.add("touch-device");
} else if (invitePoster) {
    invitePoster.addEventListener("mousemove", (event) => {
        const rect = invitePoster.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 8;
        const rotateX = (0.5 - y) * 8;

        invitePoster.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    invitePoster.addEventListener("mouseleave", () => {
        invitePoster.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    });
}

function updateHeroScrollEffect() {
    if (!posterWrap) {
        return;
    }

    const progress = Math.min(window.scrollY / (window.innerHeight * 0.9), 1);
    const translateY = progress * -34;
    const scale = 1 - progress * 0.05;

    posterWrap.style.transform = `translateY(${translateY}px) scale(${scale})`;
}

window.addEventListener("scroll", () => {
    updateHeroScrollEffect();
    updateCurtainPageVisibility();
}, { passive: true });
window.addEventListener("resize", updateCurtainPageVisibility, { passive: true });
updateHeroScrollEffect();
updateCurtainPageVisibility();

if (revealElements.length) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    revealElements.forEach((item) => revealObserver.observe(item));
}

function updateCountdown() {
    if (!countdownEl) {
        return;
    }

    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
        countdownEl.textContent = "The celebration has begun!";
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    countdownEl.textContent = `${days} days, ${hours} hours, ${minutes} minutes left`;
}

updateCountdown();
setInterval(updateCountdown, 60000);
