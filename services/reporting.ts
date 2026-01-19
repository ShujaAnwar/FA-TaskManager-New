
import { Task, TaskStatus, User, AttendanceRecord, Priority } from '../types';

const isSameDay = (d1: number, d2: Date) => {
    const date1 = new Date(d1);
    return date1.getFullYear() === d2.getFullYear() &&
           date1.getMonth() === d2.getMonth() &&
           date1.getDate() === d2.getDate();
};

const isSameMonth = (d1: number, d2: Date) => {
    const date1 = new Date(d1);
    return date1.getFullYear() === d2.getFullYear() &&
           date1.getMonth() === d2.getMonth();
};

export const reportingService = {
    generatePDF: (user: User, campusName: string, tasks: Task[], type: 'Daily' | 'Monthly', attendance?: AttendanceRecord[]) => {
        const { jsPDF } = (window as any).jspdf;
        const doc = new jsPDF();
        const now = new Date();
        const todayStr = new Date().toLocaleDateString('en-CA');

        // 1. Filter Tasks based on Strict Visibility Rules
        let filteredTasks: Task[] = [];
        if (type === 'Daily') {
            filteredTasks = tasks.filter(t => 
                isSameDay(t.createdAt, now) || 
                (t.startedAt && isSameDay(t.startedAt, now)) ||
                (t.completedAt && isSameDay(t.completedAt, now))
            );
        } else {
            filteredTasks = tasks.filter(t => t.completedAt && isSameMonth(t.completedAt, now));
        }

        // Attendance Info
        const attendanceRecord = attendance?.find(r => r.date === todayStr);

        // Header
        doc.setFontSize(22);
        doc.setTextColor(44, 62, 80);
        doc.text("FIQH ACADEMY TASK REPORT", 105, 20, { align: "center" });
        
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`${type} Report - ${campusName.toUpperCase()} CAMPUS`, 105, 30, { align: "center" });
        
        // Metadata
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(`Lead Official: ${user.name}`, 14, 45);
        doc.text(`Generation Date: ${new Date().toLocaleString()}`, 14, 50);
        if (attendanceRecord) {
            const ci = attendanceRecord.checkIn ? new Date(attendanceRecord.checkIn).toLocaleTimeString() : 'N/A';
            const co = attendanceRecord.checkOut ? new Date(attendanceRecord.checkOut).toLocaleTimeString() : 'Current Session';
            doc.text(`Official Attendance: ${ci} to ${co}`, 14, 55);
        }

        // Summary Calculations
        const totalVisible = filteredTasks.length;
        const completedCount = filteredTasks.filter(t => t.status === TaskStatus.Completed).length;
        const totalEst = filteredTasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
        const totalAct = filteredTasks.reduce((sum, t) => sum + (t.actualMinutes || 0), 0);
        
        const efficiencySum = filteredTasks
            .filter(t => t.status === TaskStatus.Completed && t.estimatedMinutes > 0 && t.actualMinutes > 0)
            .reduce((sum, t) => sum + (t.estimatedMinutes / t.actualMinutes), 0);
        const avgEff = completedCount > 0 ? Math.round((efficiencySum / completedCount) * 100) : 0;

        // Draw High-Level Summary Box
        doc.setDrawColor(44, 62, 80);
        doc.setFillColor(245, 241, 230);
        doc.rect(14, 65, 182, 35, 'F');
        
        doc.setFontSize(10);
        doc.setTextColor(44, 62, 80);
        doc.setFont("helvetica", "bold");
        doc.text(`METRIC OVERVIEW`, 20, 72);
        doc.setFont("helvetica", "normal");
        doc.text(`Total Volume: ${totalVisible}`, 20, 78);
        doc.text(`Completed Scope: ${completedCount}`, 20, 83);
        doc.text(`Urgent Priority Tasks: ${filteredTasks.filter(t => t.priority === Priority.Urgent).length}`, 20, 88);
        
        doc.text(`Cumulative Est: ${totalEst} min`, 80, 78);
        doc.text(`Cumulative Act: ${totalAct} min`, 80, 83);
        
        doc.setFontSize(16);
        doc.setTextColor(39, 174, 96);
        doc.text(`${avgEff}% Efficiency`, 140, 85);

        // Table Construction
        const tableData = filteredTasks.map(t => [
            t.description,
            t.priority.toUpperCase(),
            new Date(t.createdAt).toLocaleDateString(),
            t.completedAt ? new Date(t.completedAt).toLocaleDateString() : 'Awaiting',
            `${t.estimatedMinutes}m`,
            `${t.actualMinutes}m`,
            t.status.replace('_', ' ').toUpperCase(),
            t.status === TaskStatus.Completed && t.estimatedMinutes > 0 
                ? `${Math.round((t.estimatedMinutes / Math.max(1, t.actualMinutes)) * 100)}%` 
                : '-'
        ]);

        (doc as any).autoTable({
            startY: 110,
            head: [['Description', 'Priority', 'Assigned', 'Done', 'Est', 'Act', 'Status', 'Eff %']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [44, 62, 80], fontSize: 8, fontStyle: 'bold' },
            styles: { fontSize: 7, cellPadding: 2 },
            columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 15 },
                2: { cellWidth: 15 },
                3: { cellWidth: 15 },
                4: { cellWidth: 12 },
                5: { cellWidth: 12 },
                6: { cellWidth: 18 },
                7: { cellWidth: 12 },
            }
        });

        // Add Grand Totals Row or Section
        const finalY = (doc as any).lastAutoTable.finalY || 110;
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("GRAND TOTALS:", 14, finalY + 10);
        doc.setFont("helvetica", "normal");
        doc.text(`Est: ${totalEst}m | Act: ${totalAct}m | Time Variance: ${totalAct - totalEst}m`, 50, finalY + 10);

        // Management Summary Section
        const summaryY = finalY + 25;
        doc.setDrawColor(200);
        doc.line(14, summaryY - 5, 196, summaryY - 5);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("EXECUTIVE SUMMARY", 14, summaryY);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        const performanceNote = avgEff >= 100 
            ? "Operating above capacity. Efficiency targets achieved." 
            : avgEff >= 80 ? "Stable performance. Within acceptable variance range." 
            : "Performance shortfall detected. Potential resource bottleneck.";
        
        const summaryText = `During this reporting period for ${campusName}, a total of ${totalVisible} objectives were tracked. ` +
            `${completedCount} objectives were successfully fulfilled. The average operational efficiency was recorded at ${avgEff}%. ` +
            `Attendance records show ${attendanceRecord ? 'consistent' : 'partial'} presence. ${performanceNote}`;

        const splitSummary = doc.splitTextToSize(summaryText, 180);
        doc.text(splitSummary, 14, summaryY + 7);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Official Document of Fiqh Academy Management System - Verified via Lead Official ${user.name}`, 105, 285, { align: 'center' });

        doc.save(`Fiqh_Academy_${type}_Report_${campusName}_${new Date().toISOString().split('T')[0]}.pdf`);
    }
};
