import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import CheckoutSteps from '../components/CheckoutSteps'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Store } from '../Store';
import {Link,  useNavigate } from 'react-router-dom';
import { getError } from '../components/utils';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import Axios from 'axios';

const reducer = (state, action) => {
    switch (action.type) {
      case 'CREATE_REQUEST':
        return { ...state, loading: true };
      case 'CREATE_SUCCESS':
        return { ...state, loading: false };
      case 'CREATE_FAIL':
        return { ...state, loading: false };
      default:
        return state;
    }
  };


export default function PlaceOrderScreen () {

    const navigate = useNavigate();

const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });


    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;
  
    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
    cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    );
    cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(7);
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice ;
  
    
    
    
    
    const placeOrderHandler = async () => {
        try {
          dispatch({ type: 'CREATE_REQUEST' });
    
          const { data } = await Axios.post(
            '/api/orders',
            {
              orderItems: cart.cartItems,
              shippingAddress: cart.shippingAddress,
              paymentMethod: cart.paymentMethod,
              itemsPrice: cart.itemsPrice,
              shippingPrice: cart.shippingPrice,
              totalPrice: cart.totalPrice,
            },
            {
              headers: {
                authorization: `Bearer ${userInfo.token}`,
              },
            }
          );
          ctxDispatch({ type: 'CART_CLEAR' });
          dispatch({ type: 'CREATE_SUCCESS' });
          localStorage.removeItem('cartItems');
          navigate(`/order/${data.order._id}`);
        } catch (err) {
          dispatch({ type: 'CREATE_FAIL' });
          toast.error(getError(err));
        }
      };


  
    useEffect(() => {
      if (!cart.paymentMethod) {
        navigate('/payment');
      }
    }, [cart, navigate]);
  



  return (
    <div> 
        <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
    
        <div  className="container small-container" >
<Helmet>
    <title>Livraison</title>
</Helmet>
<h1 className="my-3">Livraison</h1>
<Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Information sur le client</Card.Title>
              <Card.Text>
                <strong>Nom:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Adresse: </strong> {cart.shippingAddress.address},
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                {cart.shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">Modifier</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Paiment</Card.Title>
              <Card.Text>
                <strong>Methode de Paiement:</strong> {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">Modifier</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Les articles commandés</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Modifier</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Prix des articles </Col>
                    <Col>{cart.itemsPrice.toFixed(2)} DT</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Frais de Livraison</Col>
                    <Col>{cart.shippingPrice.toFixed(2)} DT</Col>
                  </Row>

                </ListGroup.Item>
                <ListGroup.Item>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Total</strong>
                    </Col>
                    <Col>
                      <strong>{cart.totalPrice.toFixed(2)} DT</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                     Finaliser la commande 
                    </Button>
                  </div>
                  {loading && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>


</div>
    
     </div>
  )
}
