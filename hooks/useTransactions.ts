import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface Transaction {
  id: string;
  amount: number;
}

export function useTransactions() {
  // Transactions slice not implemented yet - returns empty array
  const transactions: Transaction[] = [];

  const getTotal = () => {
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  return {
    transactions,
    getTotal,
  };
}
