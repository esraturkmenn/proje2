import React, { Component } from "react";
import Navi from './Navi';
import CategoryList from './CategoryList';
import ProductList from './ProductList';
import { Container, Row, Col } from 'reactstrap'
import alertify from "alertifyjs";
import { Route } from 'react-router-dom'
import { Switch } from 'react-router-dom'
import NotFound from "./NotFound";
import CartList from "./CartList";

export default class App extends Component {
  state = { currentCategory: "", products: [], cart: [] };


  componentDidMount() {
    this.getProducts();
  }
  changeCategory = category => {
    this.setState({ currentCategory: category.categoryName });
    this.getProducts(category.id);
  };

  getProducts = categoryId => {
    let url = "http://localhost:3000/products";
    if (categoryId) {
      url += "?categoryId=" + categoryId;
    }
    fetch(url)
      .then(response => response.json())
      .then(data => this.setState({ products: data }));;
  }

  addToCard = (product) => {
    let newCart = this.state.cart;
    var addItem = newCart.find(c => c.product.id == product.id)
    if (addItem) {
      addItem.quantity += 1;
    }
    else {
      newCart.push({ product: product, quantity: 1 })
    }
    this.setState({ cart: newCart });
    alertify.success(product.productName + "  added to card! ", 2)
  }
  removeFromCart = (product) => {
    let newCart = this.state.cart.filter(c => c.product.id !== product.id)
    this.setState({ cart: newCart })
  }

  render() {
    let productInfo = { title: "ProductList" }
    let categoryInfo = { title: "CategoryList" }
    return (
      <div>
        <Container>
          <Navi removeFromCart={this.removeFromCart} cart={this.state.cart} />
          <Row>
            <Col xs="3">
              <CategoryList
                currentCategory={this.state.currentCategory}
                changeCategory={this.changeCategory}
                info={categoryInfo}
              />
            </Col>
            <Col xs="9">
              <Switch>
                <Route
                  exact 
                  path="/"
                  render={props => (
                    <ProductList
                      {...props}
                      products={this.state.products}
                      addToCard={this.addToCard}
                      currentCategory={this.state.currentCategory}
                      info={productInfo}
                    />
                  )} ></Route>
                <Route exact path="/cart" component={CartList} />
                <Route component={NotFound}></Route>
              </Switch>

            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

