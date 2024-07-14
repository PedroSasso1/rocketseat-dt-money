import { useContextSelector } from 'use-context-selector'
import { TransactionsContext } from '../contexts/TransactionsContext'
import { useMemo } from 'react'

export function useSummary() {
  const transactions = useContextSelector(TransactionsContext, (ctx) => {
    return ctx.transactions
  })

  const summary = useMemo(
    () =>
      transactions.reduce(
        (acc, transaction) => {
          if (transaction.type === 'income') {
            acc.income += transaction.price
          } else {
            acc.outcome += transaction.price
          }

          acc.balance = acc.income - acc.outcome

          return acc
        },
        {
          income: 0,
          outcome: 0,
          balance: 0,
        },
      ),
    [transactions],
  )

  return summary
}
