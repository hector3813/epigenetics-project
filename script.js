// Navigation helper
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', function() {
    initBrain();
    initMeta();
    initImmune();
    initSkin();
    initAging();
});

// BRAIN SECTION
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

        // Updated Math to prevent bar from hitting 0 too easily
        // Base score is the stress level (0-100)
        let score = stress;
        
        // Sleep benefit: if sleep > 6, reduce stress score slightly
        if (sleep > 6) {
            score -= (sleep - 6) * 5; 
        }
        
        // Mindfulness benefit: significant reduction
        // 30 mins removes 15 points of stress impact
        score -= (mind * 0.5);

        // Ensure score stays between 5 and 100 for visual consistency
        score = Math.max(5, Math.min(100, score));

        // Visual update
        meter.style.width = score + '%';

        // Feedback Logic
        if(score < 35) {
            result.textContent = "✓ Low Stress Impact. Your genes are well-regulated.";
            result.style.borderLeftColor = "#22c55e"; // Green
        } else if(score < 65) {
            result.textContent = "⚠ Moderate Impact. Try increasing mindfulness.";
            result.style.borderLeftColor = "#eab308"; // Yellow
        } else {
            result.textContent = "✗ High Impact. Chronic stress risk detected.";
            result.style.borderLeftColor = "#ef4444"; // Red
        }
    }

    [sleepIn, stressIn, mindIn].forEach(el => el.addEventListener('input', update));
    update();
}

// METABOLISM SECTION
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
        
        // Penalties for schedule
        if(schIn.value === 'irregular') score -= 15;
        if(schIn.value === 'shift') score -= 30;

        score = Math.max(0, Math.min(100, score));
        
        // Rotate needle: -90deg is Poor (0), 90deg is Optimal (100)
        const rot = (score/100)*180 - 90;
        needle.style.transform = `translateX(-50%) rotate(${rot}deg)`;

        if(score > 70) {
            result.textContent = "✓ Optimal Metabolic Health";
            result.style.borderLeftColor = "#22c55e";
        } else if(score > 40) {
            result.textContent = "⚠ Moderate Health";
            result.style.borderLeftColor = "#eab308";
        } else {
            result.textContent = "✗ Poor Metabolic Health";
            result.style.borderLeftColor = "#ef4444";
        }
    }

    [exIn, dietIn, schIn].forEach(el => {
        el.addEventListener('input', update);
        el.addEventListener('change', update);
    });
    update();
}

// IMMUNE SECTION
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

        // Calculate percentage (0 to 100)
        // Max likely negative factors is 4.
        let netScore = bad - good; 
        if (netScore < 0) netScore = 0; // Can't have negative inflammation
        
        let pct = (netScore / 4) * 100;
        pct = Math.min(100, pct);
        
        bar.style.width = pct + '%';

        if(netScore === 0) {
            result.textContent = "✓ Low Inflammation Tendency";
            result.style.borderLeftColor = "#22c55e";
        } else if(netScore <= 2) {
            result.textContent = "⚠ Moderate Inflammation Risk";
            result.style.borderLeftColor = "#eab308";
        } else {
            result.textContent = "✗ High Inflammation Risk";
            result.style.borderLeftColor = "#ef4444";
        }
    }

    inputs.forEach(el => el.addEventListener('change', update));
    update();
}

// SKIN SECTION
function initSkin() {
    const uvIn = document.getElementById('uv');
    const sleepIn = document.getElementById('skin-sleep');
    const visual = document.getElementById('current-skin');
    const result = document.getElementById('skin-result'); 
    
    function update() {
        let score = 0;
        if(uvIn.value === 'high') score += 3;
        if(uvIn.value === 'moderate') score += 1;
        if(sleepIn.value === 'poor') score += 2;
        if(sleepIn.value === 'moderate') score += 1;
        
        // Color calculation
        // R stays high (reddish), G and B drop as damage increases
        const r = 230;
        const g = 180 - (score * 25);
        const b = 150 - (score * 25);
        visual.style.background = `rgb(${r},${g},${b})`;
        
        // Age Text
        const age = 20 + Math.floor(score * 3); // Base age 20
        document.querySelector('#current-age span').textContent = age + ' yrs';

        // Result Text
        if(score < 2) {
            result.textContent = "✓ Skin is protected. Stable epigenetics.";
            result.style.borderLeftColor = "#22c55e";
        } else if(score < 4) {
            result.textContent = "⚠ Moderate signs of epigenetic aging.";
            result.style.borderLeftColor = "#eab308";
        } else {
            result.textContent = "✗ Accelerated aging detected.";
            result.style.borderLeftColor = "#ef4444";
        }
    }

    [uvIn, sleepIn].forEach(el => el.addEventListener('change', update));
    update();
}

// AGING SECTION
function initAging() {
    const inputs = document.querySelectorAll('.aging-factor');
    const ageIn = document.getElementById('chrono-age');
    const bioHand = document.getElementById('bio-clock-hand');
    const chronoHand = document.getElementById('chrono-clock-hand');
    const bioDisplay = document.getElementById('bio-age-display');
    const chronoDisplay = document.getElementById('chrono-age-display');
    const diffDisplay = document.getElementById('age-difference');
    const result = document.getElementById('aging-result');

    function update() {
        // Calculate average lifestyle score (0-100)
        const vals = Array.from(inputs).map(i => parseInt(i.value));
        const avg = vals.reduce((a,b)=>a+b,0) / 3;
        
        // Update badges (re-using the badge IDs)
        document.getElementById('sleep-reg-value').textContent = vals[0]+'%';
        document.getElementById('training-value').textContent = vals[1]+'%';
        document.getElementById('stress-mgmt-value').textContent = vals[2]+'%';

        const chrono = parseInt(ageIn.value);
        chronoDisplay.textContent = chrono;

        // Calculate Bio Age Diff
        let diff = 0;
        if(avg > 80) diff = -5;       // Very healthy = younger
        else if(avg > 60) diff = -2;
        else if(avg < 30) diff = 8;   // Unhealthy = older
        else if(avg < 50) diff = 4;
        
        const bio = chrono + diff;
        bioDisplay.textContent = bio;
        
        // Visual Rotation (0 to 100 years = 0 to 360 deg)
        const bioRot = (bio / 100) * 360;
        const chronoRot = (chrono / 100) * 360;
        
        bioHand.style.transform = `translateX(-50%) rotate(${bioRot}deg)`;
        chronoHand.style.transform = `translateX(-50%) rotate(${chronoRot}deg)`;
        
        // Diff Text
        if (diff > 0) {
            diffDisplay.textContent = `+${diff} years (Accelerated Aging)`;
            diffDisplay.style.color = "#ef4444";
            result.textContent = "✗ Your lifestyle is speeding up your epigenetic clock.";
            result.style.borderLeftColor = "#ef4444";
        } else if (diff < 0) {
            diffDisplay.textContent = `${diff} years (Decelerated Aging)`;
            diffDisplay.style.color = "#22c55e";
            result.textContent = "✓ Great job! You are aging slower than your calendar age.";
            result.style.borderLeftColor = "#22c55e";
        } else {
            diffDisplay.textContent = "0 years (Normal Aging)";
            diffDisplay.style.color = "#64748b";
            result.textContent = "→ Your biological age matches your chronological age.";
            result.style.borderLeftColor = "#cbd5e1";
        }
    }

    [...inputs, ageIn].forEach(el => el.addEventListener('input', update));
    update();
}