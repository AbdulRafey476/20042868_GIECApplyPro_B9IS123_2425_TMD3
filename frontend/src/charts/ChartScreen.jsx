import { BarChart, PieChart } from '@mui/x-charts';
import { useAllStudentsByMonthQuery } from '../slices/studentApiSlice.js';
import { useAllBranchesQuery } from '../slices/branchApiSlice.js';
import { useSpecificUserQuery } from '../slices/usersApiSlice.js';
import { useAllPaymentsQuery } from '../slices/paymentApiSlice.js';
import { useEffect, useState, useMemo } from 'react';
import Loader from '../components/Loader.jsx';

export default function ChartScreen() {
    const [currentPage] = useState(0);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    const { data: user, isLoading: loadingUser } = useSpecificUserQuery();
    const isAdmin = user?.profile?.isAdmin;

    const { data: branchData, isLoading: loadingBranches, error: branchError, refetch: refetchBranches } = useAllBranchesQuery({ page: currentPage + 1, limit: 10 });
    const { data: monthlyData, isLoading: loadingStudents, error: studentError, refetch: refetchStudents } = useAllStudentsByMonthQuery({
        branch_id: selectedBranch,
        month: selectedMonth !== '' ? selectedMonth : undefined,
    });

    const { data: payments, isLoading: loadingPayments, error: paymentsError, refetch: refetchPayments } = useAllPaymentsQuery({
        page: currentPage + 1,
        search: '',
        branch_id: selectedBranch,
        status: '',
    });

    const filteredPayments = useMemo(() => (
        payments?.payments?.filter(payment => {
            const paymentDate = new Date(payment.paidOn);
            const paymentMonth = paymentDate.toLocaleString('default', { month: 'long' });
            return (
                (selectedBranch ? payment.studentId?.branch_id?._id === selectedBranch : true) &&
                (selectedMonth ? paymentMonth === selectedMonth : true)
            );
        }) || []
    ), [payments, selectedBranch, selectedMonth]);

    const totalAmount = useMemo(() => (
        filteredPayments
            .filter(payment => payment.status !== 'Pending')
            .reduce((sum, payment) => sum + payment.amount, 0)
    ), [filteredPayments]);

    const monthlyDataMap = useMemo(() => (
        monthlyData?.reduce((acc, data) => {
            acc[data.month] = data.count;
            return acc;
        }, {}) || {}
    ), [monthlyData]);

    const dataset = useMemo(() => {
        const allMonths = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return allMonths.map((month) => ({
            month,
            students: monthlyDataMap[month] || 0,
        }));
    }, [monthlyDataMap]);

    const paidCount = filteredPayments.filter(payment => payment.paidOn && payment.status !== 'Pending').length;
    const dueCount = filteredPayments.filter(payment => payment.status === 'Pending').length;
    const totalStudents = dataset.reduce((total, item) => total + item.students, 0);
    const scaledTotalAmount = totalAmount / 1000;

    useEffect(() => {
        if (user?.profile?._id) {
            refetchBranches();
            refetchPayments();
            refetchStudents();
        }
    }, [user?.profile?._id, refetchBranches, refetchPayments, refetchStudents]);

    if (loadingUser || loadingBranches || loadingPayments || loadingStudents) return <Loader />;
    if (branchError || paymentsError || studentError) return <div>Error loading data</div>;

    return (
        <div className="chart-container">
            <div className="header-container" style={{ marginBottom: '20px' }}>
                <h2>Total Students: {totalStudents}</h2>
                <h2>Total Amount: ₨ {totalAmount.toLocaleString()}</h2>

                <div className="filter-container" style={{ display: 'flex', gap: '10px' }}>
                    {isAdmin && (
                        <div className="select-group">
                            <select
                                id="branch-select"
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                            >
                                <option value="">Select Branch</option>
                                {branchData?.branches?.map(branch => (
                                    <option key={branch._id} value={branch._id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="select-group">
                        <select
                            id="month-select"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            <option value="">Month</option>
                            {dataset.map(item => (
                                <option key={item.month} value={item.month}>
                                    {item.month}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-between' }}>
                <div style={{ flex: 3 }} className='Charts'>
                    <BarChart
                        dataset={dataset}
                        yAxis={[{ label: 'Total Students' }]}
                        series={[{ dataKey: 'students', label: 'Total Students' }]}
                        height={400}
                        xAxis={[{ scaleType: 'band', dataKey: 'month', min: 0, label: 'Month' }]}
                    />
                </div>

                <div style={{ flex: 1 }} className='Charts'>
                    <PieChart
                        series={[{
                            data: [
                                { label: 'Invoices Paid', value: paidCount },
                                { label: 'Invoices Due', value: dueCount },
                                { label: 'Total Amount', value: scaledTotalAmount },
                            ],
                            highlightScope: { fade: 'global', highlight: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        }]}
                        height={400}
                        width={400}
                    />
                </div>
            </div>
        </div>
    );
}
