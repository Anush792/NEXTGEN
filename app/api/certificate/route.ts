import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jsPDF from 'jspdf';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const courseName = searchParams.get('courseName');

    if (!studentId || !courseName) {
      return NextResponse.json({ error: 'Student ID and course name are required' }, { status: 400 });
    }

    // Fetch student and course details
    const { data: submissions, error } = await supabase
      .from('order_submissions')
      .select('user_email, created_at, status')
      .eq('user_id_value', studentId)
      .eq('course_name', courseName)
      .eq('status', 'graduated')
      .single();

    if (error || !submissions) {
      return NextResponse.json({ error: 'Student not found or not graduated for this course' }, { status: 404 });
    }

    const studentName = submissions.user_email?.split('@')[0] || studentId;
    const completionDate = new Date(submissions.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Generate PDF certificate
    const doc = new jsPDF();

    // Set background color
    doc.setFillColor(240, 248, 255);
    doc.rect(0, 0, 210, 297, 'F');

    // Add border
    doc.setDrawColor(0, 123, 255);
    doc.setLineWidth(2);
    doc.rect(10, 10, 190, 277);

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(0, 123, 255);
    doc.text('CERTIFICATE OF COMPLETION', 105, 40, { align: 'center' });

    // Subtitle
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('This is to certify that', 105, 60, { align: 'center' });

    // Student name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text(studentName, 105, 80, { align: 'center' });

    // Completion text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('has successfully completed the course', 105, 100, { align: 'center' });

    // Course name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0, 123, 255);
    doc.text(courseName, 105, 120, { align: 'center' });

    // Completion date
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Completed on: ${completionDate}`, 105, 150, { align: 'center' });

    // Signature line
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(60, 180, 150, 180);

    // Signature text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Authorized Signature', 105, 190, { align: 'center' });

    // Footer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('NextGen Coders - Programming Courses Platform', 105, 270, { align: 'center' });

    // Generate filename
    const filename = `Certificate_${studentName.replace(/\s+/g, '_')}_${courseName.replace(/\s+/g, '_')}.pdf`;

    // Get PDF as buffer
    const pdfBuffer = doc.output('arraybuffer');

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 });
  }
}