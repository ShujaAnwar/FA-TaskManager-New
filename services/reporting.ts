
import { Task, TaskStatus, User, AttendanceRecord, Priority, TaskCategory } from '../types';

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
    generatePDF: (
        user: User, 
        campusName: string, 
        allTasks: Task[], 
        type: 'Daily' | 'Monthly', 
        attendance?: AttendanceRecord[], 
        fromDateStr?: string, 
        tillDateStr?: string
    ) => {
        const { jsPDF } = (window as any).jspdf;
        const doc = new jsPDF();
        const now = new Date();
        const todayStr = new Date().toLocaleDateString('en-CA');

        // Parse date range
        const fromDate = fromDateStr ? new Date(fromDateStr) : null;
        if (fromDate) fromDate.setHours(0, 0, 0, 0);
        
        const tillDate = tillDateStr ? new Date(tillDateStr) : null;
        if (tillDate) tillDate.setHours(23, 59, 59, 999);

        // --- 1. STRICT FILTERING LOGIC ---
        // Rule: Reports show ONLY "Immediate Tasks" (Today category). 
        const immediateTasks = allTasks.filter(t => t.id.includes('-T-'));

        let reportTasks: Task[] = [];
        
        if (fromDate && tillDate) {
            // Rule: Filter by custom date range
            // Show ONLY Immediate Tasks that were assigned, in progress, or completed within the selected date range.
            reportTasks = immediateTasks.filter(t => {
                const createdTime = t.createdAt;
                const completedTime = t.completedAt;
                
                // Assigned within range
                const isAssignedInRange = createdTime >= fromDate.getTime() && createdTime <= tillDate.getTime();
                // Completed within range
                const isCompletedInRange = completedTime && (completedTime >= fromDate.getTime() && completedTime <= tillDate.getTime());
                // Assigned before but still pending during the range
                const isPendingDuringRange = createdTime <= tillDate.getTime() && (t.status !== TaskStatus.Completed || (completedTime && completedTime >= fromDate.getTime()));

                return isAssignedInRange || isCompletedInRange || isPendingDuringRange;
            });
            reportTasks.sort((a, b) => b.createdAt - a.createdAt);
        } else if (type === 'Daily') {
            // Fallback Daily Report Rule:
            // 1. Immediate tasks assigned today
            // 2. Immediate tasks from previous days that are still pending
            // 3. Immediate tasks completed today
            reportTasks = immediateTasks.filter(t => {
                const isAssignedToday = isSameDay(t.createdAt, now);
                const isCompletedToday = t.completedAt && isSameDay(t.completedAt, now);
                const isPastPending = t.createdAt < now.getTime() && t.status !== TaskStatus.Completed;
                
                return isAssignedToday || isCompletedToday || isPastPending;
            });
        } else {
            // Fallback Monthly Report Rule:
            reportTasks = immediateTasks.filter(t => {
                const createdInMonth = isSameMonth(t.createdAt, now);
                const completedInMonth = t.completedAt && isSameMonth(t.completedAt, now);
                return createdInMonth || completedInMonth;
            });
            reportTasks.sort((a, b) => b.createdAt - a.createdAt);
        }

        // --- 2. SUMMARY METRICS CALCULATION ---
        const total = reportTasks.length;
        const completedCount = reportTasks.filter(t => t.status === TaskStatus.Completed).length;
        const inProgressCount = reportTasks.filter(t => t.status === TaskStatus.InProgress).length;
        const pendingCount = reportTasks.filter(t => t.status === TaskStatus.Assigned || t.status === TaskStatus.Paused).length;
        const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

        // --- 3. PDF CONSTRUCTION ---
        doc.setFontSize(22);
        doc.setTextColor(44, 62, 80);
        const reportTitle = type === 'Daily' ? "DAILY OPERATIONS REPORT" : "PERFORMANCE HISTORY LOG";
        doc.text(`FIQH ACADEMY ${reportTitle}`, 105, 20, { align: "center" });
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        const periodText = fromDate && tillDate 
            ? `SCOPE: ${fromDate.toLocaleDateString()} TO ${tillDate.toLocaleDateString()}` 
            : `PERIOD: ${now.toLocaleString('default', { month: 'long', year: 'numeric' })}`;
        doc.text(`${campusName.toUpperCase()} CAMPUS | ${periodText}`, 105, 28, { align: "center" });

        // Metadata
        doc.setFontSize(9);
        doc.setTextColor(0);
        doc.text(`Lead Official: ${user.name}`, 14, 40);
        doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 45);
        
        if (attendance && type === 'Daily' && !fromDate) {
            const attendanceRecord = attendance.find(r => r.date === todayStr);
            if (attendanceRecord) {
                const ci = attendanceRecord.checkIn ? new Date(attendanceRecord.checkIn).toLocaleTimeString() : 'N/A';
                doc.text(`Attendance Log: Check-in at ${ci}`, 14, 50);
            }
        }

        // --- 4. MAIN DATA TABLE ---
        const tableData = reportTasks.map(t => [
            t.id,
            t.description,
            t.priority.toUpperCase(),
            new Date(t.createdAt).toLocaleDateString(),
            t.completedAt ? new Date(t.completedAt).toLocaleDateString() : 'N/A',
            t.status === TaskStatus.Assigned ? 'PENDING' : t.status.replace('_', ' ').toUpperCase()
        ]);

        (doc as any).autoTable({
            startY: 60,
            head: [['REF ID', 'TASK DESCRIPTION', 'PRIORITY', 'ASSIGNED', 'COMPLETED', 'STATUS']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [44, 62, 80], fontSize: 8, fontStyle: 'bold' },
            styles: { fontSize: 7.5, cellPadding: 2.5 },
            columnStyles: {
                0: { cellWidth: 22 },
                1: { cellWidth: 80 },
                2: { cellWidth: 18 },
                3: { cellWidth: 22 },
                4: { cellWidth: 22 },
                5: { cellWidth: 24 },
            }
        });

        // --- 5. SUMMARY TABLE (STRICTLY REQUIRED METRICS) ---
        const finalY = (doc as any).lastAutoTable.finalY || 60;
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(44, 62, 80);
        doc.text("EXECUTIVE PERFORMANCE SUMMARY", 14, finalY + 15);

        (doc as any).autoTable({
            startY: finalY + 20,
            head: [['METRIC', 'COUNT / VALUE']],
            body: [
                ['Total Tasks Tracked', total],
                ['Completed Tasks', completedCount],
                ['Pending Tasks', pendingCount],
                ['In-Progress Tasks', inProgressCount],
                ['Completion Percentage (%)', `${completionRate}%`]
            ],
            theme: 'grid',
            headStyles: { fillColor: [52, 73, 94], fontSize: 9 },
            styles: { fontSize: 8.5, cellPadding: 2.5 },
            columnStyles: {
                0: { fontStyle: 'bold', fillColor: [248, 249, 250], cellWidth: 70 },
                1: { halign: 'right', cellWidth: 30 }
            },
            margin: { left: 14 }
        });

        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(7);
            doc.setTextColor(160);
            doc.text(`Official Document - Fiqh Academy Management Protocol | Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
        }

        doc.save(`Fiqh_Academy_Report_${type}_${campusName}_${fromDateStr || todayStr}.pdf`);
    }
};
