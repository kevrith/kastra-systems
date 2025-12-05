export const printFeeStructure = (feeData, selectedStudent) => {
  // Create a new window for print preview
  const printWindow = window.open('', '_blank', 'width=900,height=800,scrollbars=yes');

  if (!printWindow) {
    alert('Please allow pop-ups to print the fee structure.');
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

      .amount {
        font-weight: 600;
        text-align: right;
      }

      .total-row {
        background: #f8fafc;
        font-weight: 700;
        font-size: 16px;
        color: #1e40af;
      }

      .summary-card {
        padding: 25px;
        background: #eff6ff;
        border-left: 5px solid #2563eb;
        border-radius: 6px;
        margin: 20px 0;
      }

      .summary-title {
        font-size: 14px;
        font-weight: 700;
        color: #1e40af;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 15px;
      }

      .summary-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #dbeafe;
      }

      .summary-item:last-child {
        border-bottom: none;
        font-size: 18px;
        font-weight: 700;
        color: #1e40af;
        margin-top: 10px;
        padding-top: 15px;
        border-top: 2px solid #2563eb;
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

      .note-box {
        padding: 20px;
        background: #fef3c7;
        border-left: 5px solid #f59e0b;
        border-radius: 6px;
        margin: 20px 0;
      }

      .note-box strong {
        color: #92400e;
      }

      .note-box p {
        margin: 5px 0 0 0;
        color: #78350f;
        font-size: 13px;
      }
    </style>
  `;

  const feeBreakdown = feeData.breakdown || [
    { item: 'Tuition Fee', amount: 50000 },
    { item: 'Library Fee', amount: 2500 },
    { item: 'Laboratory Fee', amount: 3500 },
    { item: 'Sports Fee', amount: 2000 },
    { item: 'Technology Fee', amount: 3000 },
    { item: 'Activity Fee', amount: 2000 },
  ];

  const totalFees = feeBreakdown.reduce((sum, fee) => sum + fee.amount, 0);
  const discountAmount = feeData.discount || 0;
  const discountPercent = feeData.discountPercent || 0;
  const netAmount = totalFees - discountAmount;

  const paymentSchedule = feeData.schedule || [
    { term: 'Term 1', dueDate: 'January 15, 2025', amount: netAmount / 3 },
    { term: 'Term 2', dueDate: 'May 15, 2025', amount: netAmount / 3 },
    { term: 'Term 3', dueDate: 'September 15, 2025', amount: netAmount / 3 },
  ];

  const feeRows = feeBreakdown.map(fee => `
    <tr>
      <td>${fee.item}</td>
      <td class="amount">KES ${fee.amount.toLocaleString()}</td>
    </tr>
  `).join('');

  const scheduleRows = paymentSchedule.map((payment, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${payment.term}</td>
      <td>${payment.dueDate}</td>
      <td class="amount">KES ${payment.amount.toLocaleString()}</td>
    </tr>
  `).join('');

  const content = `
    <div class="header">
      <h1>KASTRA SYSTEMS</h1>
      <p style="font-size: 16px; font-weight: 600;">Fee Structure Statement</p>
      <p>Academic Year ${new Date().getFullYear()}</p>
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
        <div class="info-label">Statement Date</div>
        <div class="info-value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Fee Breakdown</div>
      <table>
        <thead>
          <tr>
            <th>Fee Item</th>
            <th style="text-align: right;">Amount (KES)</th>
          </tr>
        </thead>
        <tbody>
          ${feeRows}
          <tr class="total-row">
            <td>Total Fees</td>
            <td class="amount">KES ${totalFees.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="summary-card">
      <div class="summary-title">Fee Summary</div>
      <div class="summary-item">
        <span>Total Fees</span>
        <span>KES ${totalFees.toLocaleString()}</span>
      </div>
      ${discountAmount > 0 ? `
        <div class="summary-item">
          <span>Discount (${discountPercent}%)</span>
          <span style="color: #059669;">- KES ${discountAmount.toLocaleString()}</span>
        </div>
      ` : ''}
      <div class="summary-item">
        <span>Net Amount Payable</span>
        <span>KES ${netAmount.toLocaleString()}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Payment Schedule</div>
      <table>
        <thead>
          <tr>
            <th style="width: 10%;">#</th>
            <th>Term</th>
            <th>Due Date</th>
            <th style="text-align: right;">Amount (KES)</th>
          </tr>
        </thead>
        <tbody>
          ${scheduleRows}
        </tbody>
      </table>
    </div>

    <div class="note-box">
      <strong>Important Notes:</strong>
      <p>• Fees must be paid on or before the due date to avoid late payment penalties.</p>
      <p>• A late fee of KES 2,000 will be charged for payments made after the due date.</p>
      <p>• All payments should be made via bank transfer, M-Pesa, or at the school accounts office.</p>
      <p>• Please quote the student ID on all payments for proper allocation.</p>
    </div>

    <div class="section">
      <div class="section-title">Payment Methods</div>
      <div style="padding: 20px; background: #f8fafc; border-radius: 8px;">
        <p><strong>Bank Transfer:</strong> Kastra Systems Bank - Account No: 1234567890</p>
        <p><strong>M-Pesa Paybill:</strong> Business No: 123456 - Account: Student ID</p>
        <p><strong>Office Payment:</strong> Accounts Office, Block A, Ground Floor</p>
      </div>
    </div>

    <div class="signature-section">
      <div class="signature-box">
        <div class="signature-line"></div>
        <div class="signature-label">Accounts Officer</div>
      </div>
      <div class="signature-box">
        <div class="signature-line"></div>
        <div class="signature-label">School Principal</div>
      </div>
    </div>

    <div class="footer">
      <p style="font-weight: 600; color: #64748b;">This is an official fee statement issued by Kastra Systems</p>
      <p>For inquiries, contact accounts@kastrasystems.com or call +254 700 123 456</p>
      <p>Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
  `;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Fee Structure - ${selectedStudent?.user?.first_name || ''} ${selectedStudent?.user?.last_name || ''}</title>
        ${printStyles}
      </head>
      <body>
        <button class="print-button no-print" onclick="window.print()">🖨️ Print Fee Structure</button>
        <div class="print-container">
          ${content}
        </div>
        <script>
          // Auto-focus on the window
          window.focus();
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};
