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

    document.getElementById("result").innerHTML =
    `
        <div class="loading">
            🤖 AI is reviewing your resume...
        </div>
    `;

    try {

        const response = await fetch("http://127.0.0.1:8000/analyze-resume",{
            method:"POST",
            body:formData
        });

        const data = await response.json();

        document.getElementById("result").innerHTML =

        `
            <div class="score">
    ATS Score : ${data.analysis.match_score}%
</div>

<div class="progress"
style="
width:${data.analysis.match_score}%;
background:${
data.analysis.match_score>=80
?'#22c55e'
:data.analysis.match_score>=60
?'#f59e0b'
:'#ef4444'
}">
${data.analysis.match_score}%
</div>
            <div class="section">
                <h2>✅ Matched Skills</h2>
                <p>
                    ${data.analysis.matched_skills.length
                        ? data.analysis.matched_skills.join(", ")
                        : "None"}
                </p>
            </div>

            <div class="section">
                <h2>❌ Missing Skills</h2>
                <p>
                    ${data.analysis.missing_skills.length
                        ? data.analysis.missing_skills.join(", ")
                        : "None"}
                </p>
            </div>

            <div class="section">
                <h2>🤖 AI Feedback</h2>

                <pre>${data.ai_feedback}</pre>

            </div>
        `;

    }
    catch(error){

        document.getElementById("result").innerHTML=

        `
            <h2 style="color:red;">
                Something went wrong!
            </h2>

            <pre>${error}</pre>
        `;

    }

});