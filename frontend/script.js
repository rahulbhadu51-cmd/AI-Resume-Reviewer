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

    // Loading Animation
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

        const color =
            score >= 80
                ? "#22c55e"
                : score >= 60
                ? "#f59e0b"
                : "#ef4444";

        document.getElementById("result").innerHTML = `

            <div class="score">

                ATS Score : ${score}%

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

                <h2>🤖 AI Feedback</h2>

                <pre id="feedback">

${data.ai_feedback}

                </pre>

            </div>

            <button id="copyBtn">

                📋 Copy AI Feedback

            </button>

            <button id="downloadBtn">

                📄 Download Report

            </button>

        `;

        // Copy Button

        document
            .getElementById("copyBtn")
            .addEventListener("click", () => {

                navigator.clipboard.writeText(
                    document.getElementById("feedback").innerText
                );

                alert("AI Feedback Copied!");

            });

        // Download PDF

        document
            .getElementById("downloadBtn")
            .addEventListener("click", () => {

                const { jsPDF } = window.jspdf;

                const doc = new jsPDF();

                doc.setFontSize(20);
                doc.text("AI Resume Review Report", 20, 20);

                doc.setFontSize(14);

                doc.text(`ATS Score : ${score}%`, 20, 40);

                doc.text(
                    `Matched Skills : ${matched}`,
                    20,
                    60
                );

                doc.text(
                    `Missing Skills : ${missing}`,
                    20,
                    80
                );

                doc.text(
                    "AI Feedback:",
                    20,
                    100
                );

                const feedback =
                    doc.splitTextToSize(
                        data.ai_feedback,
                        170
                    );

                doc.text(
                    feedback,
                    20,
                    110
                );

                doc.save("Resume_Report.pdf");

            });

    }

    catch (error) {

        document.getElementById("result").innerHTML = `

            <h2 style="color:red">

                Something went wrong!

            </h2>

            <pre>

${error}

            </pre>

        `;

    }

});