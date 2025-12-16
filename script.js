// Scroll to body map function
function scrollToBody() {
    document.getElementById('body-map').scrollIntoView({ behavior: 'smooth' });
}

// Body part click navigation
document.addEventListener('DOMContentLoaded', function() {
    const bodyParts = document.querySelectorAll('.body-part');
    const sectionNav = document.getElementById('section-nav');
    
    bodyParts.forEach(part => {
        part.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            
            // Show navigation after first click
            if (sectionNav) {
                sectionNav.style.display = 'flex';
            }
            
            // Scroll to section
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Initialize all interactive sections
    initBrainStress();
    initMetabolism();
    initImmune();
    initSkin();
    initAging();
});

// ===== BRAIN & STRESS SECTION (UPDATED) =====
function initBrainStress() {
    const sleepSlider = document.getElementById('sleep');
    const sleepValue = document.getElementById('sleep-value');
    const stressSlider = document.getElementById('stress-level');
    const stressValue = document.getElementById('stress-value');
    const mindSlider = document.getElementById('mindfulness'); // NEW
    const mindValue = document.getElementById('mindfulness-value'); // NEW
    const stressMeter = document.getElementById('stress-meter');
    const stressResult = document.getElementById('stress-result');
    
    if (!sleepSlider || !stressSlider) return;
    
    function updateStress() {
        const sleep = parseFloat(sleepSlider.value);
        const stressLevel = parseInt(stressSlider.value);
        const mindfulness = parseInt(mindSlider.value); // NEW
        
        // Calculate combined stress impact
        // Good sleep reduces stress impact, poor sleep amplifies it
        const sleepFactor = (10 - sleep) / 10; // 0-1, higher = worse sleep
        
        // NEW Logic: Mindfulness actively subtracts from the stress score
        // 30 mins of mindfulness can offset ~20% of stress impact
        const mindOffset = mindfulness * 0.8; 
        
        let combinedStress = (sleepFactor * 50) + (stressLevel * 0.5) - mindOffset;
        
        // Clamp result between 0 and 100
        combinedStress = Math.max(0, Math.min(100, combinedStress));
        
        // Update display values
        sleepValue.textContent = sleep + ' hours';
        stressValue.textContent = stressLevel + '%';
        mindValue.textContent = mindfulness + ' mins'; // NEW
        
        // Update meter
        stressMeter.style.width = combinedStress + '%';
        
        // Update result text and color
        if (combinedStress < 30) {
            stressResult.textContent = '✓ Excellent! Low cortisol and mindfulness practices support HPA axis regulation. You are likely reversing stress-induced methylation marks.';
            stressResult.style.background = '#d4edda';
            stressResult.style.borderLeftColor = '#4CAF50';
        } else if (combinedStress < 60) {
            stressResult.textContent = '⚠ Moderate stress impact. Your stress genes are under pressure. Try increasing sleep or adding 10 mins of mindfulness to lower this score.';
            stressResult.style.background = '#fff3cd';
            stressResult.style.borderLeftColor = '#FFC107';
        } else {
            stressResult.textContent = '✗ High stress burden. Chronic elevation is likely demethylating FKBP5, making your stress response harder to turn off. Prioritize recovery.';
            stressResult.style.background = '#f8d7da';
            stressResult.style.borderLeftColor = '#F44336';
        }
    }
    
    sleepSlider.addEventListener('input', updateStress);
    stressSlider.addEventListener('input', updateStress);
    mindSlider.addEventListener('input', updateStress); // NEW
    
    updateStress();
}

// ===== METABOLISM SECTION (UPDATED) =====
function initMetabolism() {
    const exerciseSlider = document.getElementById('exercise');
    const exerciseValue = document.getElementById('exercise-value');
    const dietSlider = document.getElementById('diet');
    const dietValue = document.getElementById('diet-value');
    const circadianSelect = document.getElementById('circadian'); // NEW
    const metabolismNeedle = document.getElementById('metabolism-needle');
    const metabolismResult = document.getElementById('metabolism-result');
    
    if (!exerciseSlider || !dietSlider) return;
    
    function updateMetabolism() {
        const exercise = parseInt(exerciseSlider.value);
        const diet = parseInt(dietSlider.value);
        const schedule = circadianSelect.value; // NEW
        
        // Calculate metabolic health score (0-100)
        let exerciseScore = (exercise / 14) * 50; 
        let dietScore = (diet / 100) * 50; 
        let totalScore = exerciseScore + dietScore;
        
        // NEW Logic: Penalize for poor circadian rhythm
        if (schedule === 'irregular') {
            totalScore -= 15; // Penalty for late eating
        } else if (schedule === 'shift') {
            totalScore -= 30; // Heavy penalty for shift work
        }
        
        // Clamp score
        totalScore = Math.max(0, Math.min(100, totalScore));

        // Update display values
        exerciseValue.textContent = exercise + ' hours';
        dietValue.textContent = diet + '%';
        
        // Update needle rotation
        const rotation = (totalScore / 100) * 180 - 90;
        metabolismNeedle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
        
        // Update result text
        if (totalScore < 30) {
            metabolismResult.textContent = '⚠ Poor metabolic profile. Circadian disruption or low activity is likely silencing protective genes like PPARGC1A.';
            metabolismResult.style.background = '#f8d7da';
            metabolismResult.style.borderLeftColor = '#F44336';
        } else if (totalScore < 60) {
            metabolismResult.textContent = '→ Moderate metabolic health. Improve your eating schedule or exercise consistency to optimize gene expression.';
            metabolismResult.style.background = '#fff3cd';
            metabolismResult.style.borderLeftColor = '#FFC107';
        } else {
            metabolismResult.textContent = '✓ Excellent! Regular activity and circadian sync (daytime eating) promote optimal methylation in metabolic pathways.';
            metabolismResult.style.background = '#d4edda';
            metabolismResult.style.borderLeftColor = '#4CAF50';
        }
    }
    
    exerciseSlider.addEventListener('input', updateMetabolism);
    dietSlider.addEventListener('input', updateMetabolism);
    circadianSelect.addEventListener('change', updateMetabolism); // NEW
    
    updateMetabolism();
}

// ===== IMMUNE & INFLAMMATION SECTION (UPDATED) =====
function initImmune() {
    // NEW: Select based on positive/negative classes
    const negFactors = document.querySelectorAll('.immune-factor-negative');
    const posFactors = document.querySelectorAll('.immune-factor-positive');
    const immuneGauge = document.getElementById('immune-gauge');
    const immuneResult = document.getElementById('immune-result');
    
    if (negFactors.length === 0) return;
    
    function updateImmune() {
        let negCount = 0;
        let posCount = 0;
        
        negFactors.forEach(factor => {
            if (factor.checked) negCount++;
        });

        posFactors.forEach(factor => {
            if (factor.checked) posCount++;
        });
        
        // Calculate score: Start with negatives, subtract positives (protection)
        // Max 4 negatives.
        let riskScore = negCount;
        if (posCount > 0) riskScore -= 1; // Nature "cancels out" one risk factor
        
        // Ensure strictly non-negative for display
        riskScore = Math.max(0, riskScore);
        
        // 0-4 scale converted to percentage
        const inflammationPercent = (riskScore / 4) * 100;
        
        // Update gauge
        immuneGauge.style.width = Math.min(100, inflammationPercent) + '%';
        
        // Update result text
        if (riskScore <= 0) {
            immuneResult.textContent = '✓ Low inflammation. Good environment or protective habits (nature exposure) are keeping your immune set-points regulated.';
            immuneResult.style.background = '#d4edda';
            immuneResult.style.borderLeftColor = '#4CAF50';
        } else if (riskScore <= 2) {
            immuneResult.textContent = `⚠ Moderate inflammation risk. You have some environmental stressors affecting your histone acetylation.`;
            immuneResult.style.background = '#fff3cd';
            immuneResult.style.borderLeftColor = '#FFC107';
        } else {
            immuneResult.textContent = `✗ High inflammation tendency. Multiple stressors are likely increasing baseline inflammatory gene expression (IL-6).`;
            immuneResult.style.background = '#f8d7da';
            immuneResult.style.borderLeftColor = '#F44336';
        }
    }
    
    negFactors.forEach(factor => factor.addEventListener('change', updateImmune));
    posFactors.forEach(factor => factor.addEventListener('change', updateImmune));
    
    updateImmune();
}

// ===== SKIN & HAIR SECTION (UNCHANGED) =====
function initSkin() {
    const uvSelect = document.getElementById('uv');
    const sleepSelect = document.getElementById('skin-sleep');
    const currentSkin = document.getElementById('current-skin');
    const currentAgeSpan = document.querySelector('#current-age span');
    const skinResult = document.getElementById('skin-result');
    
    if (!uvSelect || !sleepSelect) return;
    
    function updateSkin() {
        const uv = uvSelect.value;
        const sleep = sleepSelect.value;
        
        // Calculate skin aging score
        let agingScore = 0;
        
        // UV damage points
        if (uv === 'high') agingScore += 3;
        else if (uv === 'moderate') agingScore += 1.5;
        
        // Sleep quality points
        if (sleep === 'poor') agingScore += 2;
        else if (sleep === 'moderate') agingScore += 1;
        
        // Update skin visual
        const hue = 40 - (agingScore * 5); // Yellower/darker with more damage
        const saturation = 70 - (agingScore * 8);
        const lightness = 70 - (agingScore * 5);
        
        currentSkin.style.background = `linear-gradient(135deg, 
            hsl(${hue}, ${saturation}%, ${lightness}%), 
            hsl(${200 + agingScore * 10}, ${50 - agingScore * 5}%, ${50 - agingScore * 3}%))`;
        
        if (agingScore > 3) {
            currentSkin.style.boxShadow = 'inset 0 0 20px rgba(0,0,0,0.3)';
        } else {
            currentSkin.style.boxShadow = 'none';
        }
        
        // Estimate biological skin age (assume user is ~20)
        const baseAge = 20;
        const addedYears = Math.round(agingScore * 2);
        const bioAge = baseAge + addedYears;
        
        currentAgeSpan.textContent = bioAge + ' years';
        
        // Update result
        if (agingScore < 2) {
            skinResult.textContent = '✓ Great skin health! Your habits support healthy DNA methylation in skin barrier and collagen genes. Minimal accelerated aging.';
            skinResult.style.background = '#d4edda';
            skinResult.style.borderLeftColor = '#4CAF50';
        } else if (agingScore < 4) {
            skinResult.textContent = '⚠ Moderate skin aging factors. Some UV or stress-related epigenetic changes in pigmentation and repair genes.';
            skinResult.style.background = '#fff3cd';
            skinResult.style.borderLeftColor = '#FFC107';
        } else {
            skinResult.textContent = `✗ High skin aging risk. UV and poor sleep can alter methylation in genes controlling collagen production and melanin synthesis, accelerating visible aging by ~${addedYears} years.`;
            skinResult.style.background = '#f8d7da';
            skinResult.style.borderLeftColor = '#F44336';
        }
    }
    
    uvSelect.addEventListener('change', updateSkin);
    sleepSelect.addEventListener('change', updateSkin);
    
    // Initialize
    updateSkin();
}

// ===== BIOLOGICAL AGING SECTION (UNCHANGED) =====
function initAging() {
    const chronoAgeInput = document.getElementById('chrono-age');
    const sleepRegSlider = document.getElementById('sleep-regularity');
    const sleepRegValue = document.getElementById('sleep-reg-value');
    const trainingSlider = document.getElementById('training');
    const trainingValue = document.getElementById('training-value');
    const stressMgmtSlider = document.getElementById('stress-mgmt');
    const stressMgmtValue = document.getElementById('stress-mgmt-value');
    
    const bioClockHand = document.getElementById('bio-clock-hand');
    const chronoClockHand = document.getElementById('chrono-clock-hand');
    const bioAgeDisplay = document.getElementById('bio-age-display');
    const chronoAgeDisplay = document.getElementById('chrono-age-display');
    const ageDifference = document.getElementById('age-difference');
    const agingResult = document.getElementById('aging-result');
    
    if (!chronoAgeInput) return;
    
    function updateAging() {
        const chronoAge = parseInt(chronoAgeInput.value);
        const sleepReg = parseInt(sleepRegSlider.value);
        const training = parseInt(trainingSlider.value);
        const stressMgmt = parseInt(stressMgmtSlider.value);
        
        // Update display values
        sleepRegValue.textContent = sleepReg + '%';
        trainingValue.textContent = training + '%';
        stressMgmtValue.textContent = stressMgmt + '%';
        chronoAgeDisplay.textContent = chronoAge;
        
        // Calculate lifestyle score (0-100)
        const lifestyleScore = (sleepReg + training + stressMgmt) / 3;
        
        // Calculate biological age deviation
        let ageDelta;
        if (lifestyleScore > 70) {
            ageDelta = -((lifestyleScore - 70) / 30) * 5; // Up to -5 years
        } else if (lifestyleScore < 30) {
            ageDelta = ((30 - lifestyleScore) / 30) * 8; // Up to +8 years
        } else {
            ageDelta = ((50 - lifestyleScore) / 20) * 2; // -2 to +2 years
        }
        
        const bioAge = Math.round(chronoAge + ageDelta);
        bioAgeDisplay.textContent = bioAge;
        
        // Update clock hands
        const maxAge = 100;
        const chronoRotation = (chronoAge / maxAge) * 360;
        const bioRotation = (bioAge / maxAge) * 360;
        
        chronoClockHand.style.transform = `translateX(-50%) rotate(${chronoRotation}deg)`;
        bioClockHand.style.transform = `translateX(-50%) rotate(${bioRotation}deg)`;
        
        // Update age difference display
        const diff = bioAge - chronoAge;
        if (diff > 0) {
            ageDifference.textContent = `⚠ You're aging ${Math.abs(diff)} year${Math.abs(diff) !== 1 ? 's' : ''} faster than your chronological age`;
            ageDifference.style.background = '#f8d7da';
            ageDifference.style.color = '#721c24';
        } else if (diff < 0) {
            ageDifference.textContent = `✓ You're aging ${Math.abs(diff)} year${Math.abs(diff) !== 1 ? 's' : ''} slower than your chronological age!`;
            ageDifference.style.background = '#d4edda';
            ageDifference.style.color = '#155724';
        } else {
            ageDifference.textContent = '→ Your biological age matches your chronological age';
            ageDifference.style.background = '#fff3cd';
            ageDifference.style.color = '#856404';
        }
        
        // Update result text
        if (lifestyleScore > 70) {
            agingResult.textContent = `✓ Excellent lifestyle! Your consistent healthy habits promote favorable methylation patterns at key CpG sites. Your epigenetic clock is ticking ${Math.abs(diff)} year${Math.abs(diff) !== 1 ? 's' : ''} slower than expected.`;
            agingResult.style.background = '#d4edda';
            agingResult.style.borderLeftColor = '#4CAF50';
        } else if (lifestyleScore > 40) {
            agingResult.textContent = '→ Moderate lifestyle consistency. Some healthy habits, but inconsistency may prevent optimal epigenetic aging benefits. Room for improvement.';
            agingResult.style.background = '#fff3cd';
            agingResult.style.borderLeftColor = '#FFC107';
        } else {
            agingResult.textContent = `✗ Poor lifestyle patterns. Inconsistent sleep, low exercise, and high stress can accelerate methylation age by altering patterns at aging-related CpG sites. Your biological age may be ~${Math.abs(diff)} year${Math.abs(diff) !== 1 ? 's' : ''} older.`;
            agingResult.style.background = '#f8d7da';
            agingResult.style.borderLeftColor = '#F44336';
        }
    }
    
    chronoAgeInput.addEventListener('input', updateAging);
    sleepRegSlider.addEventListener('input', updateAging);
    trainingSlider.addEventListener('input', updateAging);
    stressMgmtSlider.addEventListener('input', updateAging);
    
    // Initialize
    updateAging();
}

// Smooth reveal animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});