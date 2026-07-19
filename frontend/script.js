document.getElementById("analyzeBtn").addEventListener("click", async () => {

    const file = document.getElementById("resume").files[0];
    const job = document.getElementById("job").value;

    if (!file) {
        alert("Please select a resume.");
        return;
    }

    if (job.trim() === "") {
        alert("Please enter a Job Description.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", job);

    document.getElementById("result").innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <h2>🤖 AI is analyzing your resume...</h2>
            <p>Please wait a few seconds.</p>
        </div>
    `;

    try {

        const response = await fetch(
            "https://ai-resume-reviewer-j4z1.onrender.com/analyze-resume",
            {
                method: "POST",
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error("Server Error");
        }

        const data = await response.json();

        const score = data.analysis.match_score;

        const matched =
            data.analysis.matched_skills.length
                ? data.analysis.matched_skills.join(", ")
                : "None";

        const missing =
            data.analysis.missing_skills.length
                ? data.analysis.missing_skills.join(", ")
                : "None";

        let color = "#ef4444";
        let status = "Poor Match";

        if (score >= 80) {
            color = "#22c55e";
            status = "Excellent Match";
        }
        else if (score >= 60) {
            color = "#f59e0b";
            status = "Good Match";
        }
        else if (score >= 40) {
            color = "#3b82f6";
            status = "Average Match";
        }

        let formattedFeedback = data.ai_feedback;

        formattedFeedback = formattedFeedback
            .replace(/^### (.*)$/gm, "<h3>$1</h3>")
            .replace(/^## (.*)$/gm, "<h2>$1</h2>")
            .replace(/^# (.*)$/gm, "<h1>$1</h1>")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n/g, "<br>");

        document.getElementById("result").innerHTML = `

            <div class="score-circle">

    <svg width="180" height="180">

        <circle
            class="bg"
            cx="90"
            cy="90"
            r="75"
        ></circle>

        <circle
            class="progress-circle"
            cx="90"
            cy="90"
            r="75"
            style="
                stroke:${color};
                stroke-dashoffset:${472 - (472 * score / 100)};
            "
        ></circle>

    </svg>

    <div class="score-text">

        <h1>${score}%</h1>

        <p>${status}</p>

    </div>

</div>

            <div class="progress-bar">

                <div
                    class="progress"
                    style="
                        width:${score}%;
                        background:${color};
                    "
                >

                    ${score}%

                </div>

            </div>

            <div class="section">

                <h2>✅ Matched Skills</h2>

                <p>${matched}</p>

            </div>

            <div class="section">

                <h2>❌ Missing Skills</h2>

                <p>${missing}</p>

            </div>

            <div class="section">

                <h2>🤖 AI Resume Analysis</h2>

                <div
                    id="feedback"
                    class="ai-feedback"
                >

                    ${formattedFeedback}

                </div>

            </div>
            <div class="section">

    <h2>💡 Resume Tips</h2>

    <ul class="tips">

        <li>Keep your resume to one page whenever possible.</li>

        <li>Use action verbs like Built, Developed, Optimized and Designed.</li>

        <li>Quantify achievements with numbers and percentages.</li>

        <li>Customize your resume for each job description.</li>

        <li>Highlight your best technical projects near the top.</li>

    </ul>

</div>

            <button id="copyBtn">

                📋 Copy AI Feedback

            </button>

            <button id="downloadBtn">

                📄 Download Report

            </button>
            <button id="clearBtn">

             🗑 Clear Form

</button>

        `;

        document.getElementById("downloadBtn").addEventListener("click", () => {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const today = new Date().toLocaleDateString();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("AI Resume Review Report", 20, 20);

    doc.setDrawColor(37, 99, 235);
    doc.line(20, 25, 190, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${today}`, 20, 35);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`ATS Score: ${score}%`, 20, 50);

    doc.setFontSize(16);
    doc.text("Matched Skills", 20, 70);

    doc.setFont("helvetica", "normal");

    const matchedText = doc.splitTextToSize(matched, 170);
    doc.text(matchedText, 20, 80);

    let y = 80 + matchedText.length * 8;

    doc.setFont("helvetica", "bold");
    doc.text("Missing Skills", 20, y);

    doc.setFont("helvetica", "normal");

    const missingText = doc.splitTextToSize(missing, 170);
    doc.text(missingText, 20, y + 10);

    y += missingText.length * 8 + 20;

    doc.setFont("helvetica", "bold");
    doc.text("AI Feedback", 20, y);

    doc.setFont("helvetica", "normal");

    const feedback = doc.splitTextToSize(
        document.getElementById("feedback").innerText,
        170
    );

    doc.text(feedback, 20, y + 10);

    doc.save("AI_Resume_Report.pdf");

});
document.getElementById("clearBtn").addEventListener("click", () => {

    document.getElementById("resume").value = "";

    document.getElementById("job").value = "";

    document.getElementById("result").innerHTML = "";

});

        document
            .getElementById("downloadBtn")
            .addEventListener("click", () => {

                const { jsPDF } = window.jspdf;

                const doc = new jsPDF();

                doc.setFontSize(22);
                doc.text("AI Resume Review Report", 20, 20);

                doc.setFontSize(16);

                doc.text(`ATS Score : ${score}%`, 20, 40);

                doc.text(`Match Status : ${status}`, 20, 52);

                doc.text("Matched Skills:", 20, 70);
                doc.text(matched, 20, 80);

                doc.text("Missing Skills:", 20, 100);
                doc.text(missing, 20, 110);

                doc.text("AI Feedback:", 20, 130);

                const feedback =
                    doc.splitTextToSize(
                        document.getElementById("feedback").innerText,
                        170
                    );

                doc.text(
                    feedback,
                    20,
                    140
                );

                doc.save("Resume_Report.pdf");

            });

    }

    catch (error) {

        document.getElementById("result").innerHTML = `

            <div
                style="
                    background:#fee2e2;
                    color:#b91c1c;
                    padding:20px;
                    border-radius:10px;
                "
            >

                <h2>❌ Something went wrong</h2>

                <p>${error}</p>

            </div>

        `;

    }

});