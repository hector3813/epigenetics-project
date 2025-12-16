document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const bodyParts = document.querySelectorAll('.body-part');
    const nav = document.getElementById('section-nav');
    bodyParts.forEach(part => {
        part.addEventListener('click', () => {
            const id = part.getAttribute('data-section');
            document.getElementById(id).scrollIntoView({behavior: 'smooth'});
            nav.style.display = 'flex';
        });
    });

    // Initialize logic
    initBrain();
    initMeta();
    initImmune();
    initSkin();
    initAging();
});

function scrollToBody() {
    document.getElementById('body-map').scrollIntoView({behavior:'smooth'});
}

// BRAIN SECTION FIX
function initBrain() {
    const sleepIn = document.getElementById('sleep');
    const stressIn = document.getElementById('stress-level');
    const mindIn = document.getElementById('mindfulness');
    const meter = document.getElementById('stress-meter');
    const result = document.getElementById('stress-result');

    function update() {
        const sleep = parseFloat(sleepIn.value);
        const stress = parseInt(stressIn.value);
        const mind = parseInt(mindIn.value);

        document.getElementById('sleep-value').textContent = sleep + 'h';
        document.getElementById('stress-value').textContent = stress + '%';
        document.getElementById('mindfulness-value').textContent = mind + 'm';

        // Math: Start with stress level. 
        // Subtract for good sleep (up to 20 pts). 
        // Subtract for mindfulness (up to 30 pts).
        let score = stress;
        
        // Sleep factor
        if (sleep > 7) score -= (sleep - 7) * 10;
        
        // Mindfulness factor (0.5 weight)
        score -= (mind * 0.5);

        // Clamp 0-100
        score = Math.max(0, Math.min(100, score));

        // Visual update
        meter.style.width = score + '%';

        if(score < 30) {
            result.textContent = "✓ Low Stress Impact. Excellent regulation.";
            result.style.borderLeftColor = "#22c55e";
        } else if(score < 60) {
            result.textContent = "⚠ Moderate Impact. Try more mindfulness.";
            result.style.borderLeftColor = "#f59e0b";
        } else {
            result.textContent = "✗ High Impact. Chronic stress risk.";
            result.style.borderLeftColor = "#ef4444";
        }
    }

    [sleepIn, stressIn, mindIn].forEach(el => el.addEventListener('input', update));
    update();
}

// METABOLISM
function initMeta() {
    const exIn = document.getElementById('exercise');
    const dietIn = document.getElementById('diet');
    const schIn = document.getElementById('circadian');
    const needle = document.getElementById('metabolism-needle');
    const result = document.getElementById('metabolism-result');

    function update() {
        const ex = parseInt(exIn.value);
        const diet = parseInt(dietIn.value);
        
        document.getElementById('exercise-value').textContent = ex + 'h';
        document.getElementById('diet-value').textContent = diet + '%';

        let score = ((ex/14)*50) + ((diet/100)*50);
        if(schIn.value === 'irregular') score -= 15;
        if(schIn.value === 'shift') score -= 30;

        score = Math.max(0, Math.min(100, score));
        const rot = (score/100)*180 - 90;
        needle.style.transform = `translateX(-50%) rotate(${rot}deg)`;

        if(score > 70) result.textContent = "✓ Optimal Metabolic Health";
        else if(score > 40) result.textContent = "⚠ Moderate Health";
        else result.textContent = "✗ Poor Metabolic Health";
    }

    [exIn, dietIn, schIn].forEach(el => el.addEventListener('input', update));
    update();
}

// IMMUNE
function initImmune() {
    const inputs = document.querySelectorAll('#immune input');
    const bar = document.getElementById('immune-gauge');
    const result = document.getElementById('immune-result');

    function update() {
        let bad = 0;
        let good = 0;
        inputs.forEach(i => {
            if(i.checked) {
                if(i.classList.contains('immune-factor-positive')) good++;
                else bad++;
            }
        });

        // Net score: Bad minus Good. Min 0.
        let net = Math.max(0, bad - good);
        let pct = (net / 4) * 100; // Max 4 bad factors
        
        bar.style.width = Math.min(100, pct) + '%';

        if(net === 0) {
            result.textContent = "✓ Low Inflammation";
            result.style.borderLeftColor = "#22c55e";
        } else if(net <= 2) {
            result.textContent = "⚠ Moderate Inflammation";
            result.style.borderLeftColor = "#f59e0b";
        } else {
            result.textContent = "✗ High Inflammation";
            result.style.borderLeftColor = "#ef4444";
        }
    }

    inputs.forEach(el => el.addEventListener('change', update));
    update();
}

// SKIN
function initSkin() {
    const uvIn = document.getElementById('uv');
    const sleepIn = document.getElementById('skin-sleep');
    const visual = document.getElementById('current-skin');
    
    function update() {
        let score = 0;
        if(uvIn.value === 'high') score += 3;
        if(uvIn.value === 'moderate') score += 1;
        if(sleepIn.value === 'poor') score += 2;
        
        // 0 = fresh, 5 = aged
        const r = 240 - (score * 10);
        const g = 192 - (score * 20);
        const b = 160 - (score * 20);
        visual.style.background = `rgb(${r},${g},${b})`;
        
        document.querySelector('#current-age span').textContent = (20 + (score * 2)) + ' yrs';
    }

    [uvIn, sleepIn].forEach(el => el.addEventListener('change', update));
    update();
}

// AGING
function initAging() {
    const inputs = document.querySelectorAll('.aging-factor');
    const ageIn = document.getElementById('chrono-age');
    const bioHand = document.getElementById('bio-clock-hand');
    const result = document.getElementById('aging-result');

    function update() {
        const vals = Array.from(inputs).map(i => parseInt(i.value));
        const avg = vals.reduce((a,b)=>a+b,0) / 3;
        
        // Update badges
        document.getElementById('sleep-reg-value').textContent = vals[0]+'%';
        document.getElementById('training-value').textContent = vals[1]+'%';
        document.getElementById('stress-mgmt-value').textContent = vals[2]+'%';

        const chrono = parseInt(ageIn.value);
        let diff = 0;
        if(avg > 70) diff = -5;
        else if(avg < 40) diff = 5;

        const bio = chrono + diff;
        document.getElementById('bio-age-display').textContent = bio;
        document.getElementById('age-difference').textContent = (diff > 0 ? "+" : "") + diff + " yrs";
        
        const rot = (bio / 100) * 360;
        bioHand.style.transform = `translateX(-50%) rotate(${rot}deg)`;
        
        if(diff < 0) result.textContent = "✓ Aging slower than chrono age";
        else if(diff > 0) result.textContent = "✗ Aging faster than chrono age";
        else result.textContent = "→ Normal aging rate";
    }

    [...inputs, ageIn].forEach(el => el.addEventListener('input', update));
    update();
}