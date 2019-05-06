import React, { Component } from "react";
import styled from "styled-components";
import moment from "moment";
import Payment from "./component/Payment";

const Container = styled.div`
  background: linear-gradient(45deg, red, blue);
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const DateButton = styled.button`
  color: #fff;
  border: 1px solid white;
  background-color: transparent;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin: 3px;
  cursor: pointer;
  text-align: center;
  outline: none;
`;

const DateLine = styled.div`
  display: flex;
  align-items: center;
  p {
    margin-right: 10px;
  }
`;
const Link = styled.span`
  cursor: pointer;
  color: #fff;
  margin: 0px 8px;
  border-bottom: ${({ selected }) => (selected ? "2px solid white" : "none")};
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  font-size: 25px;
  padding: 40px 0px 15px;
`;

const Table = styled.table`
  width: 450px;
  text-align: left;
  font-size: 18px;
  margin-left: 0;
`;

class App extends Component {
  constructor(props) {
    super(props);
    let storageState = localStorage.getItem("state");
    let initState;

    if (storageState !== null) {
      storageState = JSON.parse(storageState);
      initState = { ...storageState, date: moment(storageState.date) };
    } else {
      initState = {
        date: moment(),
        navSelected: "expense",
        transactions: []
      };
    }
    this.state = initState;
  }

  handleSubtractDay = () => {
    this.setState({ date: this.state.date.subtract(1, "day") });
  };
  handleAddDay = () => {
    this.setState({ date: this.state.date.add(1, "day") });
  };

  handleNavClick = event => {
    this.setState({ navSelected: event.target.getAttribute("name") });
  };

  handleSubmitTransaction = (sum, category) => {
    const { date: TodayDate, transactions } = this.state;
    const newTransaction = {
      date: TodayDate.format("DD.MM.YYYY"),
      category,
      sum
    };

    const newTransactions = [...transactions, newTransaction];

    newTransactions.sort((a, b) => {
      const aDate = moment(a.date, "DD.MM.YYYY");
      const bDate = moment(b.date, "DD.MM.YYYY");
      if (aDate > bDate) {
        return 1;
      }
      if (aDate < bDate) {
        return -1;
      }
      return 0;
    });
    this.setState({ transactions: newTransactions });
  };

  componentDidUpdate() {
    const { date } = this.state;
    localStorage.setItem(
      "state",
      JSON.stringify({ ...this.state, date: date.format() })
    );
  }

  onToday = () => {
    const { transactions, date } = this.state;

    const currentMonthTransactions = transactions.filter(
      ({ date: transactionDate }) =>
        moment(transactionDate, "DD.MM.YYYY").isSame(date, "month")
    );

    const dailyMoney =
      currentMonthTransactions.reduce((acc, transaction) => {
        return transaction.sum > 0 ? transaction.sum + acc : acc;
      }, 0) / moment(date).daysInMonth()

    const transactionsOnToDay = currentMonthTransactions.filter(
      ({ date: transactionDate }) =>
        moment(transactionDate, "DD.MM.YYYY").isBefore(date, "date") ||
        moment(transactionDate, "DD.MM.YYYY").isSame(date, "date")
    );

    const expenseForToDay = transactionsOnToDay.reduce(
      (acc, { sum }) => (sum < 0 ? acc + sum : acc),
      0
    );

    const incomeBeforToday = date.date() * dailyMoney;

    return incomeBeforToday + expenseForToDay;
  };

  render() {
    const { date, navSelected, transactions } = this.state;
    return (
      <Container>
        <section>
          <header>
            <h1>Реактивный бюджет</h1>
            <DateLine>
              <p>{date.format("DD.MM.YYYY")}</p>
              <DateButton onClick={this.handleSubtractDay}>-</DateButton>
              <DateButton onClick={this.handleAddDay}>+</DateButton>
            </DateLine>
            <p>На сегодня: {this.onToday()} рублей</p>
          </header>
          <main>
            <Nav>
              <Link
                name="expense"
                onClick={this.handleNavClick}
                selected={navSelected === "expense"}
              >
                Расходы сегодня
              </Link>
              <Link
                name="incomes"
                onClick={this.handleNavClick}
                selected={navSelected === "incomes"}
              >
                Доходы
              </Link>
            </Nav>

            {navSelected === "expense" ? (
              <Payment
                sign={-1}
                title="Внести рассходы:"
                onSubmit={this.handleSubmitTransaction}
              />
            ) : (
              <Payment
                sign={1}
                title="Внести доходы: "
                onSubmit={this.handleSubmitTransaction}
              />
            )}

            <Table>
              <tbody>
                {transactions
                  .filter(({ date: transactionDate }) =>
                    moment(transactionDate, "DD.MM.YYYY").isSame(
                      date,
                      "month"
                    )
                  )
                  .map(({ date, sum, category }, index) => (
                    <tr key={index}>
                      <td>{date}</td>
                      <td>{sum} p</td>
                      <td>{category}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </main>
        </section>
      </Container>
    );
  }
}

export default App;
