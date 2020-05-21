import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Create {
  title: string;
  value: number;
  type: 'income' | 'outcome'
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    const transactions = this.transactions;

    return transactions;
  }

  public getBalance(): Balance {
    const balance = this.transactions.reduce((accumulator: Balance, transaction: Transaction) => {
      switch (transaction.type) {
        case 'income':
          accumulator.income += transaction.value;
          break;
        case 'outcome':
          accumulator.outcome += transaction.value;
          break;
        default:
          break;
      }

      return accumulator
    }, {
      income: 0,
      outcome: 0,
      total: 0
    })

    balance.total = balance.income - balance.outcome;

    return balance
  }

  public create({ title, value, type }:Create ): Transaction {
    const transaction = new Transaction({title, value, type});
    const balance = this.getBalance();

    if (transaction.type === 'outcome' && transaction.value >= balance.total) {
      throw new Error('Not enought balance.')
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
