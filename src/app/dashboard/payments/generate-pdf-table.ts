import { SelectAccount, SelectPayment } from '@/lib/db/schema'
import { formatValue } from '@/lib/utils'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function downloadTable(
  payments: SelectPayment[],
  account: SelectAccount,
) {
  const doc = new jsPDF()

  // Add title with account name and current date
  const title = `Payment Sheet for Account: ${account.name}`
  const date = `Date: ${new Date().toISOString().split('T')[0]}`
  doc.setFontSize(16)
  doc.text(title, 14, 20)
  doc.setFontSize(12)
  doc.text(date, 14, 30)

  // Define headers
  const headers = [['Create Date', 'Destination Name', 'Amount']]

  // Map payments to table rows
  const rows = payments.map((payment) => [
    payment.createDate.toISOString().split('T')[0], // Format createDate as YYYY-MM-DD
    payment.destinationName, // Destination Name
    formatValue(payment.amount, account.currency), // Format amount with currency
  ])

  // Generate table
  autoTable(doc, {
    startY: 40, // Start below the title
    head: headers,
    body: rows,
    theme: 'plain', // Minimalist black-and-white theme
    styles: {
      textColor: 0, // Black text
    },
    headStyles: {
      fillColor: [240, 240, 240], // Light gray background for headers
      textColor: 0, // Black text for headers
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: 0, // Black text for body
      fillColor: [245, 245, 245], // Very light gray background for rows
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255], // White background for alternate rows
    },
    tableLineWidth: 0, // Remove table borders
  })

  // Save the PDF
  doc.save() // Downloads to default location
}
