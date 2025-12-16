// Scroll to body map
function scrollToBody() {
    document.getElementById('body-map').scrollIntoView({ behavior: 'smooth' });
}

// Body part navigation
document.addEventListener('DOMContentLoaded', function() {
    const bodyParts = document.querySelectorAll('.body-part');
    const sectionNav = document.getElementById('section-nav');
    
    bodyParts.forEach(part => {
        part.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            
            if (sectionNav) sectionNav.style.display = 'flex';
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Initialize all sections
    initBrainStress();
    initMetabolism();
    initImmune();
    initSkin();
    initAging();
});

// ===== BRAIN SECTION (FIXED) =====
function initBrainStress() {
    const sleepSlider = document.getElementById('sleep');
    const sleepValue = document.getElementById('sleep-value');
    const stressSlider = document.getElementById('stress-level');
    const stressValue = document.getElementById('stress-value');
    const mindSlider = document.getElementById('mindfulness');
    const mindValue = document.getElementById('mindfulness-value');
    
    const stressMeter = document.getElementById('stress-meter');
    const stressResult = document.getElementById('stress-result');
    
    // Safety check
    if (!sleepSlider || !stressSlider || !mindSlider) return;
    
    function updateStress() {
        const sleep = parseFloat(sleepSlider.value); // 0-10
        const stressLevel = parseInt(stressSlider.value); // 0-100
        const mindfulness = parseInt(mindSlider.value); // 0-60
        
        // Update the text numbers next to sliders
        sleepValue.textContent = sleep + ' hours';
        stressValue.textContent = stressLevel + '%';
        mindValue.textContent = mindfulness + ' mins';
        
        // --- LOGIC FIX ---
        // 1. Calculate Base Stress (0-100) based on perceived stress
        let score = stressLevel; 
        
        // 2. Sleep Impact: Good sleep (>7) reduces stress score significantly
        if (sleep >= 7) {
            score -= (sleep - 6) * 5; // e.g. 8 hours subtracts 10 points
        } else {
            score += (7 - sleep) * 5; // e.g. 5 hours adds 10 points
        }
        
        // 3. Mindfulness Impact (Stronger Effect)
        // Every 1 minute of mindfulness subtracts 0.8 points of stress
        // 60 mins = -48 points (huge reduction)
        const mindReduction = mindfulness * 0.8;
        score = score - mindReduction;
        
        // 4. Clamp score between 0 and 100
        score = Math.max(0, Math.min(100, score));
        
        // Update Meter Width
        stressMeter.style.width = score + '%';
        
        // Update Result Text
        if (score < 30) {
            stressResult.textContent = '✓ Excellent! Low cortisol & active mindfulness are protecting your brain. Your stress-response genes are likely well-regulated.';
            stressResult.style.borderLeftColor = '#10b981'; // Green
            stressResult.style.background = '#ecfdf5';
        } else if (score < 60) {
            stressResult.textContent = '⚠ Moderate stress load. Your FKBP5 gene is working hard. Try adding 10 more minutes of mindfulness to drop this score.';
            stressResult.style.borderLeftColor = '#f59e0b'; // Yellow
            stressResult.style.background = '#fffbeb';
        } else {
            stressResult.textContent = '✗ High Allostatic Load. Chronic stress is likely altering your neural plasticity. Prioritize sleep and meditation immediately.';
            stressResult.style.borderLeftColor = '#ef4444'; // Red
            stressResult.style.background = '#fef2f2';
        }
    }
    
    // Listen for changes
    sleepSlider.addEventListener('input', updateStress);
    stressSlider.addEventListener('input', updateStress);
    mindSlider.addEventListener('input', updateStress);
    
    // Run once on load
    updateStress();
}

// ===== METABOLISM SECTION =====
function initMetabolism() {
    const exerciseSlider = document.getElementById('exercise');
    const dietSlider = document.getElementById('diet');
    const circadianSelect = document.getElementById('circadian');
    const metabolismNeedle = document.getElementById('metabolism-needle');
    const metabolismResult = document.getElementById('metabolism-result');
    
    // Update value displays
    const exerciseValue = document.getElementById('exercise-value');
    const dietValue = document.getElementById('diet-value');
    
    if (!exerciseSlider) return;
    
    function updateMetabolism() {
        const exercise = parseInt(exerciseSlider.value);
        const diet = parseInt(dietSlider.value);
        const schedule = circadianSelect.value;
        
        exerciseValue.textContent = exercise + ' hours';
        dietValue.textContent = diet + '%';
        
        let score = ((exercise / 14) * 50) + ((diet / 100) * 50);
        
        // Circadian Penalties
        if (schedule === 'irregular') score -= 15;
        if (schedule === 'shift') score -= 30;
        
        score = Math.max(0, Math.min(100, score));
        
        // Rotate Needle (-90 to 90 deg)
        const rotation = (score / 100) * 180 - 90;
        metabolismNeedle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
        
        if (score < 40) {
            metabolismResult.textContent = '⚠ Poor metabolic signaling. Circadian mismatch and low activity may be silencing protective genes.';
            metabolismResult.style.borderLeftColor = '#ef4444';
        } else if (score < 75) {
            metabolismResult.textContent = '→ Moderate health. Improve consistency in diet or timing to optimize your metabolic clock.';
            metabolismResult.style.borderLeftColor = '#f59e0b';
        } else {
            metabolismResult.textContent = '✓ Optimal! Your lifestyle is sending strong signals to mitochondria-building genes.';
            metabolismResult.style.borderLeftColor = '#10b981';
        }
    }
    
    exerciseSlider.addEventListener('input', updateMetabolism);
    dietSlider.addEventListener('input', updateMetabolism);
    circadianSelect.addEventListener('change', updateMetabolism);
    
    updateMetabolism();
}

// ===== IMMUNE SECTION =====
function initImmune() {
    const factors = document.querySelectorAll('.checkbox-group input');
    const gaugeFill = document.getElementById('immune-gauge');
    const result = document.getElementById('immune-result');
    
    if (factors.length === 0) return;
    
    function updateImmune() {
        let riskScore = 0;
        
        factors.forEach(input => {
            if (input.checked) {
                if (input.classList.contains('immune-factor-negative')) {
                    riskScore += 1;
                } else if (input.classList.contains('immune-factor-positive')) {
                    riskScore -= 1; // Nature protects
                }
            }
        });
        
        // Normalize score (0 to 4 scale)
        riskScore = Math.max(0, riskScore);
        const percent = (riskScore / 4) * 100;
        
        gaugeFill.style.width = Math.min(100, percent) + '%';
        
        if (riskScore === 0) {
            result.textContent = '✓ Low inflammation. Your immune set-points are well-regulated.';
            result.style.borderLeftColor = '#10b981';
        } else if (riskScore <= 2) {
            result.textContent = '⚠ Moderate inflammation risk. Environmental stressors are present.';
            result.style.borderLeftColor = '#f59e0b';
        } else {
            result.textContent = '✗ High inflammation tendency. Multiple stressors are likely activating inflammatory genes.';
            result.style.borderLeftColor = '#ef4444';
        }
    }
    
    factors.forEach(f => f.addEventListener('change', updateImmune));
    updateImmune();
}

// ===== SKIN SECTION =====
function initSkin() {
    const uv = document.getElementById('uv');
    const sleep = document.getElementById('skin-sleep');
    const skinVisual = document.getElementById('current-skin');
    const ageSpan = document.querySelector('#current-age span');
    const result = document.getElementById('skin-result');
    
    if (!uv) return;
    
    function updateSkin() {
        let damage = 0;
        if (uv.value === 'high') damage += 3;
        if (uv.value === 'moderate') damage += 1.5;
        if (sleep.value === 'poor') damage += 2;
        if (sleep.value === 'moderate') damage += 1;
        
        // Visual Change (Darker/Redder = older)
        const hue = 35 - (damage * 5); 
        const light = 80 - (damage * 6);
        skinVisual.style.background = `hsl(${hue}, 70%, ${light}%)`;
        
        // Age Calc
        const bioAge = 20 + Math.round(damage * 2.5);
        ageSpan.textContent = bioAge + ' years';
        
        if (damage < 2) {
            result.textContent = '✓ Skin is protected. DNA methylation in collagen genes is stable.';
            result.style.borderLeftColor = '#10b981';
        } else {
            result.textContent = '✗ Accelerated aging detected. UV/Stress is altering skin cell epigenetics.';
            result.style.borderLeftColor = '#ef4444';
        }
    }
    
    uv.addEventListener('change', updateSkin);
    sleep.addEventListener('change', updateSkin);
    updateSkin();
}

// ===== AGING SECTION =====
function initAging() {
    const inputs = document.querySelectorAll('.aging-factor');
    const chronoInput = document.getElementById('chrono-age');
    const bioHand = document.getElementById('bio-clock-hand');
    const chronoHand = document.getElementById('chrono-clock-hand');
    const bioDisplay = document.getElementById('bio-age-display');
    const chronoDisplay = document.getElementById('chrono-age-display');
    const diffDisplay = document.getElementById('age-difference');
    const result = document.getElementById('aging-result');
    
    // Value labels
    const sVal = document.getElementById('sleep-reg-value');
    const tVal = document.getElementById('training-value');
    const mVal = document.getElementById('stress-mgmt-value');
    
    if (!chronoInput) return;
    
    function updateAging() {
        const chronoAge = parseInt(chronoInput.value) || 20;
        const sleep = parseInt(inputs[0].value);
        const train = parseInt(inputs[1].value);
        const stress = parseInt(inputs[2].value);
        
        // Update labels
        sVal.textContent = sleep + '%';
        tVal.textContent = train + '%';
        mVal.textContent = stress + '%';
        
        chronoDisplay.textContent = chronoAge;
        
        // Calculate Bio Age
        const avgLifestyle = (sleep + train + stress) / 3;
        let diff = 0;
        
        if (avgLifestyle > 70) diff = -5; // Younger
        else if (avgLifestyle < 40) diff = +8; // Older
        else diff = 0; // Same
        
        // Scale diff based on how extreme the lifestyle is
        if (avgLifestyle > 85) diff = -8;
        if (avgLifestyle < 20) diff = +12;
        
        const bioAge = chronoAge + diff;
        bioDisplay.textContent = bioAge;
        
        // Rotate Hands (0-100 age scale)
        chronoHand.style.transform = `translateX(-50%) rotate(${(chronoAge/100)*360}deg)`;
        bioHand.style.transform = `translateX(-50%) rotate(${(bioAge/100)*360}deg)`;
        
        // Result
        if (bioAge < chronoAge) {
            diffDisplay.textContent = `You are aging ${Math.abs(diff)} years slower!`;
            diffDisplay.style.color = '#10b981';
            result.textContent = '✓ Your epigenetic clock is ticking slowly. Great job!';
            result.style.borderLeftColor = '#10b981';
        } else if (bioAge > chronoAge) {
            diffDisplay.textContent = `You are aging ${Math.abs(diff)} years faster.`;
            diffDisplay.style.color = '#ef4444';
            result.textContent = '✗ Lifestyle factors are accelerating your methylation clock.';
            result.style.borderLeftColor = '#ef4444';
        } else {
            diffDisplay.textContent = 'Biological age matches Chronological age.';
            diffDisplay.style.color = '#f59e0b';
            result.textContent = '→ Average aging rate. Room for improvement.';
            result.style.borderLeftColor = '#f59e0b';
        }
    }
    
    inputs.forEach(i => i.addEventListener('input', updateAging));
    chronoInput.addEventListener('input', updateAging);
    updateAging();
}