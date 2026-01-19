
import { Task, TaskStatus, User, AttendanceRecord } from '../types';

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
        const todayStr = now.toISOString().split('T')[0];

        // 1. Filter Tasks based on Strict Visibility Rules
        let filteredTasks: Task[] = [];
        if (type === 'Daily') {
            filteredTasks = tasks.filter(t => 
                isSameDay(t.createdAt, now) || 
                (t.startedAt && isSameDay(t.startedAt, now)) ||
                (t.completedAt && isSameDay(t.completedAt, now))
            );
        } else {
            // Monthly strictly shows completed tasks in target month
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
        doc.text(`User: ${user.name}`, 14, 45);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 50);
        if (attendanceRecord) {
            const ci = attendanceRecord.checkIn ? new Date(attendanceRecord.checkIn).toLocaleTimeString() : 'N/A';
            const co = attendanceRecord.checkOut ? new Date(attendanceRecord.checkOut).toLocaleTimeString() : 'In Office';
            doc.text(`Attendance Today: Check-In: ${ci} | Check-Out: ${co}`, 14, 55);
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

        // Draw Summary Box
        doc.setDrawColor(200);
        doc.setFillColor(245, 241, 230);
        doc.rect(14, 65, 182, 35, 'F');
        
        doc.setFontSize(10);
        doc.text(`Total Tasks ${type === 'Daily' ? 'Today' : 'Completed'}: ${totalVisible}`, 20, 75);
        doc.text(`Tasks Completed: ${completedCount}`, 20, 80);
        doc.text(`Tasks Created Today: ${filteredTasks.filter(t => isSameDay(t.createdAt, now)).length}`, 20, 85);
        
        doc.text(`Total Estimated: ${totalEst}m`, 80, 75);
        doc.text(`Total Actual: ${totalAct}m`, 80, 80);
        
        doc.setFontSize(14);
        doc.text(`Efficiency: ${avgEff}%`, 140, 85);

        // Table
        const tableData = filteredTasks.map(t => [
            t.description,
            new Date(t.createdAt).toLocaleDateString(),
            t.startedAt ? new Date(t.startedAt).toLocaleDateString() : '-',
            t.completedAt ? new Date(t.completedAt).toLocaleDateString() : '-',
            `${t.estimatedMinutes}m`,
            `${t.actualMinutes}m`,
            t.status.replace('_', ' ').toUpperCase(),
            t.status === TaskStatus.Completed && t.estimatedMinutes > 0 
                ? `${Math.round((t.estimatedMinutes / Math.max(1, t.actualMinutes)) * 100)}%` 
                : '-'
        ]);

        (doc as any).autoTable({
            startY: 110,
            head: [['Task', 'Assigned', 'Started', 'Completed', 'Est', 'Act', 'Status', 'Eff %']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [44, 62, 80], fontSize: 8 },
            styles: { fontSize: 7, cellPadding: 2 }
        });

        // Footer
        doc.setFontSize(8);
        doc.text(`System Generated Report - Fiqh Academy Management`, 105, 285, { align: 'center' });

        doc.save(`Fiqh_Academy_${type}_Report_${campusName}_${todayStr}.pdf`);
    }
};
