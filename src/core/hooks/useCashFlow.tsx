import { Key } from 'antd/lib/table/interface';
import { CashFlow } from 'goodvandro-alganews-sdk';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../store';
import * as ExpensesActions from '../store/Expense.slice';
import * as RevenuesActions from '../store/Revenue.slice';

type CashFlowEntryType = CashFlow.EntrySummary['type'];

export default function useCashFlow(type: CashFlowEntryType) {
  const dispatch = useDispatch<Dispatch<any>>();

  const query = useSelector((s: RootState) =>
    type === 'EXPENSE' ? s.cashFlow.expense.query : s.cashFlow.revenue.query
  );
  const entries = useSelector((s: RootState) =>
    type === 'EXPENSE' ? s.cashFlow.expense.list : s.cashFlow.revenue.list
  );
  const fetching = useSelector((s: RootState) =>
    type === 'EXPENSE'
      ? s.cashFlow.expense.fetching
      : s.cashFlow.revenue.fetching
  );
  const selected = useSelector((s: RootState) =>
    type === 'EXPENSE'
      ? s.cashFlow.expense.selected
      : s.cashFlow.revenue.selected
  );

  const fetchEntries = useCallback(
    () =>
      dispatch(
        type === 'EXPENSE'
          ? ExpensesActions.getExpenses()
          : RevenuesActions.getRevenues()
      ),
    [dispatch, type]
  );

  const removeEntries = useCallback(
    (ids: number[]) =>
      dispatch(
        type === 'EXPENSE'
          ? ExpensesActions.removeEntriesInBatch(ids)
          : RevenuesActions.removeEntriesInBatch(ids)
      ),
    [dispatch, type]
  );

  const setSelected = useCallback(
    (keys: Key[]) =>
      dispatch(
        type === 'EXPENSE'
          ? ExpensesActions.setSelectedExpense(keys)
          : RevenuesActions.setSelectedRevenue(keys)
      ),
    [dispatch, type]
  );

  const setQuery = useCallback(
    (query: Partial<CashFlow.Query>) =>
      dispatch(
        type === 'EXPENSE'
          ? ExpensesActions.setQuery(query)
          : RevenuesActions.setQuery(query)
      ),
    [dispatch, type]
  );

  return {
    entries,
    query,
    selected,
    fetching,
    fetchEntries,
    removeEntries,
    setQuery,
    setSelected,
  };
}
