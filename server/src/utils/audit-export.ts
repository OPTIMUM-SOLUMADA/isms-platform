import type { AuditLogPayload } from '@/services/audit.service';
import ExcelJS from 'exceljs';

interface ExportOptions {
    filename?: string;
    includeHeaders?: boolean;
}

/**
 * Calculate row height based on content
 */
function calculateRowHeight(content: string, baseHeight: number = 20): number {
    if (!content) return baseHeight;

    const lineCount = (content.match(/\n/g) || []).length + 1;
    const estimatedHeight = baseHeight + lineCount * 15;

    // Set a reasonable maximum height
    return Math.min(estimatedHeight, 400);
}

/**
 * Calculate column width based on content
 */
function calculateColumnWidth(content: string, baseWidth: number = 10): number {
    if (!content) return baseWidth;

    // Split by newlines and find the longest line
    const lines = content.split('\n');
    const longestLine = lines.reduce((longest, line) => {
        return line.length > longest.length ? line : longest;
    }, '');

    // Calculate width based on character count (rough estimation)
    const calculatedWidth = Math.max(baseWidth, longestLine.length * 1.2);

    // Set reasonable min/max bounds
    return Math.min(Math.max(calculatedWidth, baseWidth), 100);
}

/**
 * Generates and exports Excel audit logs
 * @param auditLogs Array of audit log data
 * @param options Export options including filename and headers
 * @returns Promise that resolves when the Excel file is generated
 */
export async function generateAuditLogsExcel(
    auditLogs: AuditLogPayload[],
    options: ExportOptions = {},
): Promise<ExcelJS.Buffer> {
    const {
        filename = `audit-logs-${new Date().toISOString().split('T')[0]}.xlsx`,
        includeHeaders = true,
    } = options;

    console.log(filename);
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Audit System';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Add a worksheet
    const worksheet = workbook.addWorksheet('Audit Logs');

    // Define columns with initial widths (will be auto-adjusted later)
    worksheet.columns = [
        { header: 'Event ID', key: 'id', width: 30 },
        { header: 'Timestamp', key: 'timestamp', width: 25 },
        { header: 'Event Type', key: 'eventType', width: 20 },
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Performed By User ID', key: 'userId', width: 25 },
        { header: 'Performed By User Name', key: 'userName', width: 25 },
        { header: 'Performed By User Email', key: 'userEmail', width: 30 },
        { header: 'Target IDs', key: 'targetIds', width: 30 },
        { header: 'Target Types', key: 'targetTypes', width: 20 },
        { header: 'Details', key: 'details', width: 40 },
        { header: 'IP Address', key: 'ipAddress', width: 20 },
        { header: 'User Agent', key: 'userAgent', width: 50 },
        { header: 'Session ID', key: 'sessionId', width: 30 },
    ];

    // Configure default row and cell properties
    worksheet.properties.defaultRowHeight = 20;

    // Add header row with styling if requested
    if (includeHeaders) {
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, size: 12 };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6FA' },
        };
        headerRow.border = {
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } },
        };
        headerRow.alignment = {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true,
        };
        headerRow.height = 25;
    }

    // Track maximum content width for each column
    const maxColumnWidths: { [key: string]: number } = {};

    // Process and add audit log data
    auditLogs.forEach((log, index) => {
        const rowNumber = includeHeaders ? index + 2 : index + 1;

        // Extract target information
        const targetIds = log.targets.map((target) => target.id).join(', ');
        const targetTypes = log.targets.map((target) => target.type).join(', ');

        // Extract user information
        const userName = log.user?.name || 'System';
        const userEmail = log.user?.email || 'N/A';

        // Format details with line breaks
        const detailsString = formatDetails(log.details);

        // Add row data
        const row = worksheet.getRow(rowNumber);
        row.values = {
            id: log.id,
            timestamp: new Date(log.timestamp).toLocaleString(),
            eventType: log.eventType,
            status: log.status,
            userId: log.userId || 'System',
            userName: userName,
            userEmail: userEmail,
            targetIds: targetIds || 'N/A',
            targetTypes: targetTypes || 'N/A',
            details: detailsString,
            ipAddress: log.ipAddress,
            userAgent: log.userAgent,
            sessionId: log.sessionId || 'N/A',
        };

        // Configure cell alignment and wrapping for ALL cells
        row.eachCell((cell, colNumber) => {
            cell.alignment = {
                vertical: 'top',
                horizontal: 'left',
                wrapText: true,
            };

            // Track maximum width for this column
            const columnKey = worksheet.columns[colNumber - 1]?.key || '';
            if (cell.value) {
                const cellWidth = calculateColumnWidth(String(cell.value), 10);
                if (!maxColumnWidths[columnKey] || cellWidth > maxColumnWidths[columnKey]) {
                    maxColumnWidths[columnKey] = cellWidth;
                }
            }

            // Add borders to all cells
            cell.border = {
                bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                right: { style: 'thin', color: { argb: 'FFD3D3D3' } },
            };
        });

        // Special configuration for details column
        const detailsCell = row.getCell('details');
        detailsCell.alignment = {
            vertical: 'top',
            horizontal: 'left',
            wrapText: true,
        };

        // Calculate and set dynamic row height based on content
        const rowHeight = calculateRowHeight(detailsString);
        row.height = rowHeight;

        // Add conditional formatting for status
        if (log.status === 'SUCCESS') {
            row.getCell('status').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF90EE90' }, // Light green
            };
        } else if (log.status === 'FAILURE') {
            row.getCell('status').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFB6C1' }, // Light red
            };
        }
    });

    // Apply auto-fitting to columns based on content
    worksheet.columns.forEach((column) => {
        const columnKey = column.key as string;
        const headerWidth = includeHeaders ? String(column.header).length * 1.5 : 0;
        const contentWidth = maxColumnWidths[columnKey] || 0;
        const finalWidth = Math.max(column.width || 10, headerWidth, contentWidth);

        // Apply reasonable limits
        column.width = Math.min(Math.max(finalWidth, 8), 100);
    });

    // Special handling for details column - make it wider since it has multi-line content
    const detailsColumn = worksheet.getColumn('details');
    detailsColumn.width = Math.max(detailsColumn.width || 40, 50);

    // Auto-filter for the header row
    if (includeHeaders) {
        worksheet.autoFilter = {
            from: { row: 1, column: 1 },
            to: { row: 1, column: worksheet.columnCount },
        };
    }

    // Freeze the header row
    worksheet.views = [
        {
            state: 'frozen',
            xSplit: 0,
            ySplit: includeHeaders ? 1 : 0,
            activeCell: includeHeaders ? 'A2' : 'A1',
        },
    ];

    // Generate and return the Excel buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

/**
 * Enhanced helper function to format details with better structure and line breaks
 */
function formatDetails(details: any): string {
    if (!details || typeof details !== 'object') {
        return String(details || 'N/A');
    }

    const lines: string[] = [];

    // Basic user information
    if (details.email) {
        lines.push(`Email: ${details.email}`);
    }

    if (details.role && typeof details.role === 'string') {
        lines.push(`Role: ${details.role}`);
    }

    if (details.name && typeof details.name === 'string') {
        lines.push(`Name: ${details.name}`);
    }

    // Changes with before/after
    if (details.roles) {
        if (details.roles.before && details.roles.after) {
            lines.push('Roles Changed:');
            lines.push(`  Before: ${details.roles.before.join(', ')}`);
            lines.push(`  After: ${details.roles.after.join(', ')}`);
        }
    }

    if (details.role && typeof details.role === 'object') {
        if (details.role.before && details.role.after) {
            lines.push('Role Changed:');
            lines.push(`  Before: ${details.role.before}`);
            lines.push(`  After: ${details.role.after}`);
        }
    }

    if (details.name && typeof details.name === 'object') {
        if (details.name.before && details.name.after) {
            lines.push('Name Changed:');
            lines.push(`  Before: ${details.name.before}`);
            lines.push(`  After: ${details.name.after}`);
        }
    }

    // Additional information
    if (details.reason) {
        lines.push(`Reason: ${details.reason}`);
    }
    // Handle any other properties not covered above
    const coveredProperties = ['email', 'role', 'name', 'roles', 'reason'];
    const additionalProps = Object.keys(details).filter((key) => !coveredProperties.includes(key));

    if (additionalProps.length > 0) {
        lines.push('Additional Info:');
        additionalProps.forEach((prop) => {
            if (typeof details[prop] === 'object') {
                lines.push(`  ${prop}: ${JSON.stringify(details[prop])}`);
            } else {
                lines.push(`  ${prop}: ${details[prop]}`);
            }
        });
    }

    return lines.length > 0 ? lines.join('\n') : 'No details available';
}
