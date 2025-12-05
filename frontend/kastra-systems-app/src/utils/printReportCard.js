export const printReportCard = (reportData, selectedStudent, activeSection = 'overview') => {
  // Create a new window for print preview
  const printWindow = window.open('', '_blank', 'width=900,height=800,scrollbars=yes');

  if (!printWindow) {
    alert('Please allow pop-ups to print the report card.');
    return;
  }

  const printStyles = `
    <style>
      @media print {
        @page {
          margin: 0.5in;
          size: portrait;
        }
        body {
          margin: 0;
          padding: 0;
        }
        .print-button, .no-print {
          display: none !important;
        }
      }

      @media screen {
        body {
          padding: 20px;
          background: #f5f5f5;
        }
        .print-container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .print-button {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 12px 24px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          z-index: 1000;
          transition: background 0.2s;
        }
        .print-button:hover {
          background: #1d4ed8;
        }
      }

      * {
        box-sizing: border-box;
      }

      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
      }

      .header {
        text-align: center;
        border-bottom: 3px solid #2563eb;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }

      .header h1 {
        color: #1e40af;
        margin: 0;
        font-size: 32px;
        letter-spacing: 2px;
      }

      .header p {
        color: #6b7280;
        margin: 8px 0;
        font-size: 14px;
      }

      .student-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 30px;
        padding: 25px;
        background: #f8fafc;
        border-radius: 10px;
        border: 1px solid #e2e8f0;
      }

      .info-item {
        margin-bottom: 12px;
      }

      .info-label {
        font-weight: 600;
        color: #64748b;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .info-value {
        color: #0f172a;
        font-size: 15px;
        margin-top: 4px;
        font-weight: 500;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-bottom: 35px;
      }

      .stat-card {
        padding: 20px;
        text-align: center;
        border: 2px solid #e2e8f0;
        border-radius: 10px;
        background: white;
      }

      .stat-label {
        font-size: 11px;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
      }

      .stat-value {
        font-size: 36px;
        font-weight: 700;
        color: #2563eb;
        margin: 12px 0;
        line-height: 1;
      }

      .stat-note {
        font-size: 12px;
        color: #94a3b8;
      }

      .section {
        margin-bottom: 30px;
        page-break-inside: avoid;
      }

      .section-title {
        font-size: 20px;
        font-weight: 700;
        color: #1e40af;
        border-bottom: 2px solid #dbeafe;
        padding-bottom: 12px;
        margin-bottom: 20px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        background: white;
      }

      th, td {
        padding: 14px 12px;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
      }

      th {
        background: #f8fafc;
        font-weight: 600;
        color: #475569;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      td {
        font-size: 14px;
        color: #334155;
      }

      .grade-badge {
        display: inline-block;
        padding: 6px 14px;
        border-radius: 16px;
        font-weight: 600;
        font-size: 13px;
      }

      .grade-a { background: #d1fae5; color: #065f46; }
      .grade-b { background: #dbeafe; color: #1e40af; }
      .grade-c { background: #fef3c7; color: #92400e; }
      .grade-d, .grade-f { background: #fee2e2; color: #991b1b; }

      .remarks-section {
        margin-top: 30px;
        padding: 25px;
        background: #f8fafc;
        border-left: 5px solid #2563eb;
        border-radius: 6px;
        page-break-inside: avoid;
      }

      .remarks-section h4 {
        margin: 0 0 12px 0;
        color: #1e40af;
        font-size: 15px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .remarks-section p {
        margin: 0;
        color: #475569;
        font-size: 14px;
        line-height: 1.8;
      }

      .skills-section {
        margin-bottom: 30px;
      }

      .skills-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin-top: 15px;
      }

      .skill-item {
        padding: 15px;
        background: #f8fafc;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #e2e8f0;
      }

      .skill-name {
        font-weight: 600;
        color: #334155;
      }

      .skill-score {
        font-size: 20px;
        font-weight: bold;
        color: #2563eb;
      }

      .progress-note {
        padding: 20px;
        background: #eff6ff;
        border-left: 5px solid #2563eb;
        border-radius: 6px;
        color: #1e40af;
        margin: 15px 0;
      }

      .footer {
        margin-top: 50px;
        padding-top: 25px;
        border-top: 2px solid #e2e8f0;
        text-align: center;
        font-size: 11px;
        color: #94a3b8;
      }

      .signature-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        margin-top: 60px;
        page-break-inside: avoid;
      }

      .signature-box {
        text-align: center;
      }

      .signature-line {
        border-top: 2px solid #cbd5e1;
        margin: 40px 20px 10px;
      }

      .signature-label {
        font-size: 13px;
        color: #64748b;
        font-weight: 600;
      }
    </style>
  `;

  // Prepare content based on active section
  let sectionContent = '';

  if (activeSection === 'grades' || activeSection === 'overview') {
    const courseRows = reportData.courseAverages && reportData.courseAverages.length > 0
      ? reportData.courseAverages.map(course => `
          <tr>
            <td>${course.courseName}</td>
            <td>${course.credits}</td>
            <td><strong>${course.average}%</strong></td>
            <td><span class="grade-badge grade-${course.letter.toLowerCase()}">${course.letter}</span></td>
          </tr>
        `).join('')
      : '<tr><td colspan="4" style="text-align: center; color: #94a3b8;">No course data available</td></tr>';

    sectionContent += `
      <div class="section">
        <div class="section-title">Academic Performance</div>
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Credits</th>
              <th>Average</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            ${courseRows}
          </tbody>
        </table>
      </div>

      <div class="section">
        <div class="section-title">Conduct</div>
        <div style="padding: 15px; background: #f8fafc; border-radius: 8px;">
          <strong>Conduct Grade:</strong> <span class="grade-badge grade-${reportData.conductGrade?.toLowerCase() || 'a'}">${reportData.conductGrade || 'A'}</span>
        </div>
      </div>
    `;
  }

  if (activeSection === 'progress' || activeSection === 'overview') {
    sectionContent += `
      <div class="section progress-section">
        <div class="section-title">Progress Information</div>
        <div class="progress-note">
          <strong>GPA Trend:</strong> Shows consistent improvement throughout the academic year.
          Current GPA of ${reportData.gpa} reflects strong academic performance.
        </div>
        <div class="progress-note" style="margin-top: 15px;">
          <strong>Attendance Record:</strong> ${reportData.attendance}% attendance rate demonstrates
          ${reportData.attendance >= 95 ? 'excellent' : reportData.attendance >= 85 ? 'good' : 'needs improvement'} commitment to regular class participation.
        </div>
      </div>
    `;
  }

  if (activeSection === 'overview') {
    // Add skills section
    if (reportData.skills && reportData.skills.length > 0) {
      const skillsHTML = reportData.skills.map(skill => `
        <div class="skill-item">
          <span class="skill-name">${skill.name}</span>
          <span class="skill-score">${skill.score}/100</span>
        </div>
      `).join('');

      sectionContent += `
        <div class="section skills-section">
          <div class="section-title">Skills Assessment</div>
          <div class="skills-grid">
            ${skillsHTML}
          </div>
        </div>
      `;
    }
  }

  const studentInfo = `
    <div class="header">
      <h1>KASTRA SYSTEMS</h1>
      <p style="font-size: 16px; font-weight: 600;">Student Academic Report Card</p>
      <p>${reportData.academicYear} • ${reportData.currentTerm}</p>
    </div>

    <div class="student-info">
      <div class="info-item">
        <div class="info-label">Student Name</div>
        <div class="info-value">${selectedStudent?.user?.first_name || ''} ${selectedStudent?.user?.last_name || ''}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Student ID</div>
        <div class="info-value">${selectedStudent?.student_id || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Grade Level</div>
        <div class="info-value">Grade ${selectedStudent?.grade_level || 10}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Email</div>
        <div class="info-value">${selectedStudent?.user?.email || 'N/A'}</div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">GPA</div>
        <div class="stat-value">${reportData.gpa}</div>
        <div class="stat-note">Out of 4.0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Attendance</div>
        <div class="stat-value">${reportData.attendance}%</div>
        <div class="stat-note">This term</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Class Rank</div>
        <div class="stat-value">#${reportData.classRank}</div>
        <div class="stat-note">of ${reportData.totalStudents} students</div>
      </div>
    </div>

    ${sectionContent}

    <div class="remarks-section">
      <h4>Class Teacher's Remarks</h4>
      <p>${reportData.teacherRemarks || 'No remarks provided.'}</p>
    </div>

    <div class="remarks-section" style="margin-top: 20px;">
      <h4>Principal's Remarks</h4>
      <p>${reportData.principalRemarks || 'No remarks provided.'}</p>
    </div>

    <div class="signature-section">
      <div class="signature-box">
        <div class="signature-line"></div>
        <div class="signature-label">Class Teacher</div>
      </div>
      <div class="signature-box">
        <div class="signature-line"></div>
        <div class="signature-label">Principal</div>
      </div>
    </div>

    <div class="footer">
      <p style="font-weight: 600; color: #64748b;">This is an official document issued by Kastra Systems</p>
      <p>Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
  `;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Report Card - ${selectedStudent?.user?.first_name || ''} ${selectedStudent?.user?.last_name || ''}</title>
        ${printStyles}
      </head>
      <body>
        <button class="print-button no-print" onclick="window.print()">🖨️ Print Report Card</button>
        <div class="print-container">
          ${studentInfo}
        </div>
        <script>
          // Auto-focus on the window
          window.focus();

          // Optional: Auto-print after a delay (comment out if you want manual control)
          // setTimeout(() => window.print(), 1000);
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};
