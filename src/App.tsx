

import React, { useEffect, useState } from 'react'
import './App.css'

type Expense = {
  id: string
  title: string
  amount: number
  date: string
  category: string
}

const CATEGORIES = ['All', 'Food', 'Utilities', 'Transport', 'Entertainment', 'Other']

function formatCurrency(value: number) {
  return value.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}

function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const raw = localStorage.getItem('expenses')
      return raw ? JSON.parse(raw) : []
    } catch (err) {
      return []
    }
  })

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('Food')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (!title.trim() || Number.isNaN(amt) || !date) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      title: title.trim(),
      amount: Math.round(amt * 100) / 100,
      date,
      category,
    }

    setExpenses(prev => [newExpense, ...prev])
    setTitle('')
    setAmount('')
    setDate('')
    setCategory('Food')
  }

  const filtered = expenses.filter(exp => filter === 'All' ? true : exp.category === filter)
  const total = filtered.reduce((s, e) => s + e.amount, 0)
  const overall = expenses.reduce((s, e) => s + e.amount, 0)

  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Expense Tracker</h1>
        <p className="subtitle">Track your spending — simple, responsive, and fast.</p>
      </header>

      <main className="main-grid">
        <section className="card form-card">
          <h2>Add Expense</h2>
          <form onSubmit={addExpense} className="expense-form">
            <div className="row">
              <label>
                Title
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Coffee" />
              </label>
              <label>
                Amount
                <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" inputMode="decimal" />
              </label>
            </div>

            <div className="row">
              <label>
                Date
                <input value={date} onChange={e => setDate(e.target.value)} type="date" />
              </label>
              <label>
                Category
                <select value={category} onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="row actions">
              <button className="btn primary" type="submit">Add Expense</button>
              <button className="btn" type="button" onClick={() => { setTitle(''); setAmount(''); setDate(''); setCategory('Food') }}>Reset</button>
            </div>
          </form>

          <div className="summary">
            <div><strong>Filtered total:</strong> {formatCurrency(total)}</div>
            <div className="muted">Overall total: {formatCurrency(overall)}</div>
          </div>

          <div className="filter">
            <label>
              Filter by category
              <select value={filter} onChange={e => setFilter(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </div>

          <div className="demo-actions" style={{marginTop: '0.8rem', display:'flex', gap:'.5rem'}}>
            <button className="btn" type="button" onClick={() => {
              const demo = [
                { id: 'd1', title: 'Groceries', amount: 42.35, date: '2026-01-05', category: 'Food' },
                { id: 'd2', title: 'Bus pass', amount: 25.00, date: '2026-01-06', category: 'Transport' },
                { id: 'd3', title: 'Movie', amount: 12.00, date: '2026-01-07', category: 'Entertainment' },
                { id: 'd4', title: 'Electricity', amount: 58.83, date: '2026-01-02', category: 'Utilities' },
              ]
              setExpenses(prev => [...demo, ...prev])
            }}>Load demo data</button>

            <button className="btn" type="button" onClick={() => { if(confirm('Clear ALL expenses?')) setExpenses([]) }}>Clear all</button>
          </div>
        </section>

        <section className="card list-card">
          <h2>Expenses ({filtered.length})</h2>

          {filtered.length === 0 ? (
            <div className="empty">No expenses to show.</div>
          ) : (
            <ul className="expenses">
              {filtered.map(exp => (
                <li key={exp.id} className="expense">
                  <div className="expense-main">
                    <div className="title">{exp.title}</div>
                    <div className="meta">{new Date(exp.date).toLocaleDateString()} • <span className="chip">{exp.category}</span></div>
                  </div>
                  <div className="expense-actions">
                    <div className="amount">{formatCurrency(exp.amount)}</div>
                    <button className="btn small danger" onClick={() => removeExpense(exp.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="footer muted">Built with ♥ — Responsive & modern UI</footer>
    </div>
  )
}

export default App
