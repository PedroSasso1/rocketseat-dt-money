import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/axios'
import { createContext } from 'use-context-selector'

interface Transaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  category: string
  price: number
  createdAt: string
}

type CreateTransactionInput = Omit<Transaction, 'id' | 'createdAt'>

interface TransactionContextType {
  transactions: Transaction[]
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (input: CreateTransactionInput) => Promise<void>
}

interface TransactionProviderProps {
  children: React.ReactNode
}

export const TransactionsContext = createContext({} as TransactionContextType)

export function TransactionsProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get('/transactions', {
      params: {
        q: query,
        _sort: 'createdAt',
        _order: 'desc',
      },
    })
    setTransactions(response.data)
  }, [])

  const createTransaction = useCallback(
    async (input: CreateTransactionInput) => {
      const response = await api.post('/transactions', {
        description: input.description,
        price: input.price,
        category: input.category,
        type: input.type,
        createdAt: new Date(),
      })
      const newTransaction = response.data
      setTransactions((state) => [newTransaction, ...state])
    },
    [],
  )

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, createTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
