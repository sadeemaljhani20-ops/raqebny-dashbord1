const ctx = document.getElementById('predictionChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5'],
        datasets: [{
            label: 'System Confidence',
            data: [75, 82, 91, 85, 95],
            borderColor: '#58a6ff',
            backgroundColor: 'rgba(88, 166, 255, 0.1)',
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#c9d1d9' } } },
        scales: {
            y: { grid: { color: '#30363d' }, ticks: { color: '#8b949e' } },
            x: { grid: { display: false }, ticks: { color: '#8b949e' } }
        }
    }
});


async function runInference() {
    const status = document.getElementById('statusIndicator');
    const alertMsg = document.getElementById('alertMessage');
    const deviceCount = 15; 
    
    status.innerText = "⏳";
    status.style.borderColor = "#f1e05a";
    alertMsg.innerText = "Scanning 15 connected devices...";

    try {
        let risksFound = 0;
        let highTemp = 0;

        
        for (let i = 1; i <= deviceCount; i++) {
            const randomTemp = (Math.random() * (80 - 20) + 20).toFixed(1);
            
            const response = await fetch('http://127.0.0.1:8000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    temperature: parseFloat(randomTemp),
                    pressure: 101.3,
                    humidity: 35.0,
                    vibration: 0.02,
                    battery: 88,
                    cpu_usage: 50.0,
                    network_usage: 100,
                    hardware_error: 0
                })
            });

            const data = await response.json();
            if (data.prediction === 1) {
                risksFound++;
                highTemp = randomTemp; 
            }
        }

        
        if (risksFound > 0) {
            status.innerText = "RISK";
            status.style.borderColor = "#f85149";
            status.style.color = "#f85149";
            alertMsg.innerText = `⚠️ ALERT: ${risksFound} devices out of 15 detected with High Risk!`;
            alertMsg.className = "alert-box alert-danger";
        } else {
            status.innerText = "OK";
            status.style.borderColor = "#3fb950";
            status.style.color = "#3fb950";
            alertMsg.innerText = "✅ SYSTEM SECURE: All 15 devices are operating normally.";
            alertMsg.className = "alert-box alert-success";
        }

    } catch (error) {
        status.innerText = "ERR";
        alertMsg.innerText = "❌ Backend Connection Failed";
        alertMsg.className = "alert-box alert-danger";
    }
}