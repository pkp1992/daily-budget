import React, { Component } from "react";
import styled from "styled-components";

const Container = styled.article`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const InputLine = styled.div`
  display: flex;
  flex-direction: row;
  line-height: 1.5;
`;

const Input = styled.input`
  background-color: transparent;
  border: none;
  font-size: 15px;
  border-bottom: 1px solid white;
  margin-left: 5px;
  color: #ffffff;
  width: 100%;
  padding: 0;
  margin: 0;
  outline: none;
`;

const LineTitle = styled.dt`
  width: 150px;
`;

const LineInput = styled.dd`
  width: 150px;
  margin: 0;
`;

const Button = styled.button`
  color: #ffffff;
  border: 1px solid white;
  border-radius: 12px;
  background-color: transparent;
  margin: 3px;
  cursor: pointer;
  text-align: center;
  padding: 5px 20px;
  :hover {
      background-color: #fff;
      color: #000;
  }
`;

export default class Payment extends Component {
                 state = {
                   category: null,
                   transaction: null
                 };

                 handleChangeInput = event => {
                   this.setState({
                     [event.target.name]: event.target.value
                   });
                 };
                 handleEnter = () => {
                   const { onSubmit } = this.props;
                   const { transaction, category } = this.state;

                   onSubmit(
                     this.props.sign *
                       Math.abs(parseFloat(transaction)),
                     category
                   );
                   this.setState({
                     transaction: null,
                     category: null
                   });
                 };
                 render() {
                   const { category, transaction } = this.state;
                   return (
                     <Container>
                       <dl>
                         <InputLine>
                           <LineTitle>
                             {this.props.title}{" "}
                           </LineTitle>
                           <LineInput>
                             <Input
                               name="transaction"
                               onChange={this.handleChangeInput}
                               value={transaction || ""}
                             />
                           </LineInput>
                         </InputLine>
                         <InputLine>
                           <LineTitle>Категории: </LineTitle>
                           <LineInput>
                             <Input
                               name="category"
                               onChange={this.handleChangeInput}
                               value={category || ""}
                             />
                           </LineInput>
                         </InputLine>
                       </dl>
                       <Button onClick={this.handleEnter}>
                         Внести
                       </Button>
                     </Container>
                   );
                 }
               }

