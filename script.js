// Sleep quality slider for Brain & Stress section
const sleepSlider = document.getElementById('sleep');
const sleepValue = document.getElementById('sleep-value');
const stressMeter = document.getElementById('stress-meter');
const stressResult = document.getElementById('stress-result');

if (sleepSlider) {
    sleepSlider.addEventListener('input', function() {
        const value = this.value;
        sleepValue.textContent = value + '%';
        
        // Update stress meter (inverse relationship: more sleep = less stress)
        const stressLevel = 100 - value;
        stressMeter.style.width = stressLevel + '%';
        
        // Update result text
        if (value > 70) {
            stressResult.textContent = '✓ Great sleep! Lower stress response, better memory formation.';
            stressResult.style.background = '#d4edda';
        } else if (value > 40) {
            stressResult.textContent = '⚠ Moderate sleep. Some stress regulation impact.';
            stressResult.style.background = '#fff3cd';
        } else {
            stressResult.textContent = '✗ Poor sleep. Elevated cortisol, impaired stress recovery.';
            stressResult.style.background = '#f8d7da';
        }
    });
}