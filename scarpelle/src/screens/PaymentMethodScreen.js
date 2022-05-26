import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import CheckoutSteps from '../components/CheckoutSteps'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';

export default function PaymentMethodScreen() {

    const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'MasterCard'
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);
    
  const submitHandler = (e) => {
        e.preventDefault();
        ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
        localStorage.setItem('paymentMethod', paymentMethodName);
        navigate('/placeorder');
      };


  return (
    <div>
        <CheckoutSteps step1 step2 step3></CheckoutSteps>
    <div  className="container small-container" >
<Helmet>
    <title>Méthode de paiment</title>
</Helmet>
<h1 className="my-3">Méthode de paiement</h1>
<Form onSubmit={submitHandler}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="MasterCard"
              label="MasterCard"
              value="MasterCard"
              checked={paymentMethodName === 'MasterCard'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Aramex"
              label="Aramex"
              value="Aramex"
              checked={paymentMethodName === 'Aramex'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Button type="submit">Suivant</Button>
          </div>
        </Form>
    </div>
    </div>
  )
}
