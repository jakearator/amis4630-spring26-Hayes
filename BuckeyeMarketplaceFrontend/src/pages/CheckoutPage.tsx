import { CSSProperties, FC, FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';
import Header from '../components/organisms/Header';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../services/api';
import './CheckoutPage.css';

type CheckoutMode = 'account' | 'choice' | 'guest';

interface GuestDeliveryDetails {
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  streetAddress: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
}

type GuestCheckoutField = keyof GuestDeliveryDetails | 'customerEmail';
type GuestValidationErrors = Partial<Record<GuestCheckoutField, string>>;

const defaultGuestDeliveryDetails: GuestDeliveryDetails = {
  firstName: '',
  lastName: '',
  phone: '',
  country: 'United States',
  streetAddress: '',
  apartment: '',
  city: '',
  state: '',
  zipCode: '',
};

const guestRequiredFields: GuestCheckoutField[] = [
  'customerEmail',
  'firstName',
  'lastName',
  'phone',
  'country',
  'streetAddress',
  'city',
  'state',
  'zipCode',
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const buildGuestShippingAddress = (details: GuestDeliveryDetails): string => {
  const streetLine = [details.streetAddress.trim(), details.apartment.trim()]
    .filter(Boolean)
    .join(', ');
  const regionLine = [details.state.trim(), details.zipCode.trim()]
    .filter(Boolean)
    .join(' ');
  const cityLine = [details.city.trim(), regionLine]
    .filter(Boolean)
    .join(', ');

  return [streetLine, cityLine, details.country.trim()]
    .filter(Boolean)
    .join(', ');
};

const getGuestCheckoutErrors = (
  customerEmail: string,
  details: GuestDeliveryDetails,
): GuestValidationErrors => {
  const errors: GuestValidationErrors = {};
  const email = customerEmail.trim();

  if (!email) {
    errors.customerEmail = 'Enter an email for your order confirmation.';
  } else if (!emailPattern.test(email)) {
    errors.customerEmail = 'Enter a valid email address, like buckeye@example.com.';
  }

  if (!details.firstName.trim()) {
    errors.firstName = 'First name is required.';
  }

  if (!details.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  }

  if (!details.phone.trim()) {
    errors.phone = 'Phone number is required.';
  }

  if (!details.country.trim()) {
    errors.country = 'Country or region is required.';
  }

  if (!details.streetAddress.trim()) {
    errors.streetAddress = 'Street address is required.';
  }

  if (!details.city.trim()) {
    errors.city = 'City is required.';
  }

  if (!details.state.trim()) {
    errors.state = 'State is required.';
  }

  if (!details.zipCode.trim()) {
    errors.zipCode = 'ZIP code is required.';
  }

  return errors;
};

const CheckoutPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { items, itemCount, subtotal, finalizeCheckout } = useCart();
  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode>(isAuthenticated ? 'account' : 'choice');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [guestDeliveryDetails, setGuestDeliveryDetails] = useState<GuestDeliveryDetails>(defaultGuestDeliveryDetails);
  const [touchedGuestFields, setTouchedGuestFields] = useState<Partial<Record<GuestCheckoutField, boolean>>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isGuestCheckout = !isAuthenticated && checkoutMode === 'guest';

  useEffect(() => {
    setCheckoutMode(isAuthenticated ? 'account' : 'choice');
  }, [isAuthenticated]);

  const guestShippingAddress = useMemo(
    () => buildGuestShippingAddress(guestDeliveryDetails),
    [guestDeliveryDetails],
  );

  const guestValidationErrors = useMemo(
    () => getGuestCheckoutErrors(customerEmail, guestDeliveryDetails),
    [customerEmail, guestDeliveryDetails],
  );

  const hasGuestValidationErrors = Object.keys(guestValidationErrors).length > 0;

  const canPlaceOrder = useMemo(() => {
    if (items.length === 0 || isSubmitting) {
      return false;
    }

    if (isGuestCheckout) {
      return !hasGuestValidationErrors && guestShippingAddress.length > 0;
    }

    return shippingAddress.trim().length > 0;
  }, [
    guestShippingAddress,
    hasGuestValidationErrors,
    isGuestCheckout,
    items.length,
    shippingAddress,
    isSubmitting,
  ]);

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#f6f6f6',
    },
    container: {
      maxWidth: '1180px',
      margin: '0 auto',
      padding: '36px 20px 56px',
    },
    shell: {
      backgroundColor: '#fff',
      border: '1px solid #e8e8e8',
      borderRadius: '12px',
      boxShadow: '0 8px 28px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
    },
    shellHeader: {
      padding: '28px 32px 24px',
      borderBottom: '1px solid #eeeeee',
      backgroundColor: '#fff',
    },
    progress: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      flexWrap: 'wrap',
      marginBottom: '24px',
    },
    progressStep: {
      border: '1px solid #dedede',
      borderRadius: '999px',
      color: '#555',
      fontSize: '13px',
      fontWeight: 700,
      lineHeight: 1,
      padding: '8px 12px',
      backgroundColor: '#fff',
    },
    progressStepActive: {
      borderColor: '#BB0000',
      backgroundColor: '#BB0000',
      color: '#fff',
      boxShadow: '0 8px 18px rgba(187, 0, 0, 0.2)',
    },
    progressConnector: {
      width: '34px',
      height: '2px',
      backgroundColor: '#dddddd',
    },
    shellHeaderContent: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '18px',
      flexWrap: 'wrap',
    },
    title: {
      margin: 0,
      fontSize: '32px',
      lineHeight: 1.2,
      fontWeight: 700,
      color: '#1a1a1a',
    },
    checkoutMeta: {
      margin: '8px 0 0',
      color: '#666',
      fontSize: '15px',
      lineHeight: 1.5,
    },
    itemPill: {
      borderRadius: '999px',
      border: '1px solid #ead7d7',
      backgroundColor: '#fff7f7',
      color: '#BB0000',
      padding: '8px 14px',
      fontSize: '13px',
      fontWeight: 700,
      whiteSpace: 'nowrap',
      boxShadow: '0 4px 12px rgba(187, 0, 0, 0.08)',
    },
    layout: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
      gap: '28px',
      alignItems: 'start',
      padding: '28px 32px 32px',
    },
    detailsColumn: {
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      border: '1px solid #e8e8e8',
      boxShadow: '0 8px 22px rgba(0, 0, 0, 0.045)',
      padding: '24px',
    },
    optionCard: {
      backgroundColor: '#fff',
    },
    optionHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '18px',
      flexWrap: 'wrap',
    },
    sectionTitle: {
      margin: 0,
      fontSize: '20px',
      lineHeight: 1.3,
      fontWeight: 700,
      color: '#1a1a1a',
    },
    sectionIntro: {
      margin: '8px 0 0',
      color: '#666',
      fontSize: '15px',
      lineHeight: 1.5,
      maxWidth: '720px',
    },
    panelTitleRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      paddingBottom: '16px',
      marginBottom: '20px',
      borderBottom: '1px solid #eeeeee',
    },
    panelKicker: {
      margin: '0 0 4px',
      color: '#BB0000',
      fontSize: '13px',
      fontWeight: 700,
    },
    orderList: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    },
    orderItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '16px',
      borderBottom: '1px solid #eeeeee',
      padding: '14px 0',
      fontSize: '14px',
      color: '#333',
    },
    itemTitle: {
      margin: 0,
      fontWeight: 600,
      color: '#1a1a1a',
      lineHeight: 1.35,
    },
    itemMeta: {
      margin: '4px 0 0',
      color: '#666',
      fontSize: '13px',
    },
    itemPrice: {
      color: '#1a1a1a',
      fontSize: '14px',
      whiteSpace: 'nowrap',
    },
    totals: {
      marginTop: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      color: '#333',
      fontSize: '15px',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '16px',
    },
    divider: {
      height: '1px',
      backgroundColor: '#eeeeee',
      margin: '4px 0 2px',
    },
    grandTotal: {
      fontWeight: 800,
      color: '#BB0000',
      fontSize: '24px',
      alignItems: 'baseline',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: 600,
      color: '#333',
    },
    input: {
      width: '100%',
      borderRadius: '8px',
      border: '1px solid #d6d6d6',
      padding: '13px 14px',
      fontSize: '15px',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
      marginBottom: '18px',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      outline: 'none',
      backgroundColor: '#fff',
    },
    textarea: {
      width: '100%',
      minHeight: '146px',
      borderRadius: '8px',
      border: '1px solid #d6d6d6',
      padding: '13px 14px',
      fontSize: '15px',
      fontFamily: 'inherit',
      resize: 'vertical',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      outline: 'none',
      backgroundColor: '#fff',
    },
    error: {
      margin: '14px 0 0',
      fontSize: '14px',
      color: '#b00020',
      fontWeight: 600,
      backgroundColor: '#fff3f3',
      border: '1px solid #ffd6d6',
      borderRadius: '8px',
      padding: '10px 12px',
    },
    formActions: {
      marginTop: '22px',
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    choiceActions: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginTop: '18px',
    },
    choiceActionWrap: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap',
    },
    activeChoice: {
      borderRadius: '8px',
      boxShadow: '0 0 0 3px rgba(187, 0, 0, 0.12)',
    },
    selectedBadge: {
      borderRadius: '999px',
      backgroundColor: '#fff0f0',
      color: '#BB0000',
      border: '1px solid #f0c7c7',
      padding: '6px 10px',
      fontSize: '12px',
      fontWeight: 700,
    },
    linkButton: {
      textDecoration: 'none',
      display: 'inline-block',
    },
    emptyWrap: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      border: '1px solid #ececec',
      padding: '36px 20px',
      textAlign: 'center',
    },
    emptyText: {
      margin: '0 0 18px',
      color: '#555',
      fontSize: '16px',
    },
    mutedPanel: {
      backgroundColor: '#fafafa',
      border: '1px dashed #dddddd',
      borderRadius: '10px',
      padding: '18px',
      color: '#555',
      fontSize: '15px',
      lineHeight: 1.5,
    },
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const address = isGuestCheckout ? guestShippingAddress : shippingAddress.trim();
    const email = customerEmail.trim();

    if (isGuestCheckout) {
      const validationErrors = getGuestCheckoutErrors(email, guestDeliveryDetails);

      if (Object.keys(validationErrors).length > 0) {
        setTouchedGuestFields(
          guestRequiredFields.reduce<Partial<Record<GuestCheckoutField, boolean>>>((fields, field) => {
            fields[field] = true;
            return fields;
          }, {}),
        );
        setError('Please complete the highlighted guest checkout details.');
        return;
      }
    }

    if (!address) {
      setError('Shipping address is required.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const order = await placeOrder({
        shippingAddress: address,
        customerEmail: isGuestCheckout ? email : undefined,
        items: isGuestCheckout
          ? items.map((item) => ({ productId: item.id, quantity: item.quantity }))
          : undefined,
      });
      await finalizeCheckout();
      navigate('/order-confirmation', { state: { order }, replace: true });
    } catch (submitError) {
      if (submitError instanceof Error && submitError.message.trim().length > 0) {
        setError(submitError.message);
      } else {
        setError('Unable to place order. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.container}>
          <div style={styles.emptyWrap}>
            <p style={styles.emptyText}>Your cart is empty, so checkout is unavailable.</p>
            <Link to="/products" style={styles.linkButton}>
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const authRedirectState = {
    from: {
      pathname: location.pathname,
    },
  };

  const applyFieldFocus = (element: HTMLInputElement | HTMLTextAreaElement): void => {
    element.style.borderColor = '#BB0000';
    element.style.boxShadow = '0 0 0 3px rgba(187, 0, 0, 0.1)';
  };

  const clearFieldFocus = (element: HTMLInputElement | HTMLTextAreaElement): void => {
    element.style.borderColor = '#d6d6d6';
    element.style.boxShadow = 'none';
  };

  const markGuestFieldTouched = (field: GuestCheckoutField): void => {
    setTouchedGuestFields((currentFields) => ({
      ...currentFields,
      [field]: true,
    }));
  };

  const updateGuestDeliveryDetail = (field: keyof GuestDeliveryDetails, value: string): void => {
    setGuestDeliveryDetails((currentDetails) => ({
      ...currentDetails,
      [field]: value,
    }));
    setError(null);
  };

  const updateCustomerEmail = (value: string): void => {
    setCustomerEmail(value);
    setError(null);
  };

  const getGuestFieldError = (field: GuestCheckoutField): string | undefined => (
    touchedGuestFields[field] ? guestValidationErrors[field] : undefined
  );

  const getGuestFieldErrorId = (field: GuestCheckoutField): string => `guest-${field}-error`;

  const renderGuestFieldError = (field: GuestCheckoutField): JSX.Element | null => {
    const fieldError = getGuestFieldError(field);

    if (!fieldError) {
      return null;
    }

    return (
      <p id={getGuestFieldErrorId(field)} className="checkout-field-error">
        {fieldError}
      </p>
    );
  };

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.container}>
        <main style={styles.shell} aria-labelledby="checkout-heading">
          <div style={styles.shellHeader} className="checkout-shell-header">
            <nav style={styles.progress} aria-label="Checkout progress">
              <span style={styles.progressStep}>Cart</span>
              <span style={styles.progressConnector} aria-hidden="true" />
              <span style={{ ...styles.progressStep, ...styles.progressStepActive }} aria-current="step">
                Checkout
              </span>
              <span style={styles.progressConnector} aria-hidden="true" />
              <span style={styles.progressStep}>Confirmation</span>
            </nav>
            <div style={styles.shellHeaderContent}>
              <div>
                <h1 id="checkout-heading" style={styles.title}>Checkout</h1>
                <p style={styles.checkoutMeta}>Review your order and complete your delivery details.</p>
              </div>
              <div style={styles.itemPill}>
                {itemCount} item{itemCount === 1 ? '' : 's'}
              </div>
            </div>
          </div>

          <div className="checkout-layout">
            <div style={styles.detailsColumn}>
              {!isAuthenticated && (
                <section style={{ ...styles.card, ...styles.optionCard }}>
                  <div style={styles.optionHeader}>
                    <div>
                      <h2 style={styles.sectionTitle}>Choose How to Continue</h2>
                      <p style={styles.sectionIntro}>
                        Sign in with an existing account, create a new one, or place this order as a guest.
                      </p>
                    </div>
                  </div>
                  <div className="checkout-choice-grid">
                    <Link
                      to="/login"
                      state={authRedirectState}
                      className="checkout-choice-card"
                      aria-label="Log In"
                    >
                      <span>
                        <span className="checkout-choice-title">Log In</span>
                        <span className="checkout-choice-note">Use saved account details and order history.</span>
                      </span>
                      <span className="checkout-choice-action">Continue</span>
                    </Link>
                    <Link
                      to="/register"
                      state={authRedirectState}
                      className="checkout-choice-card"
                      aria-label="Create Account"
                    >
                      <span>
                        <span className="checkout-choice-title">Create Account</span>
                        <span className="checkout-choice-note">Save your information for future Buckeye orders.</span>
                      </span>
                      <span className="checkout-choice-action">Start</span>
                    </Link>
                    <button
                      type="button"
                      className={`checkout-choice-card${isGuestCheckout ? ' is-selected' : ''}`}
                      onClick={() => setCheckoutMode('guest')}
                      aria-pressed={isGuestCheckout}
                      aria-label="Checkout as Guest"
                    >
                      <span>
                        <span className="checkout-choice-title">Checkout as Guest</span>
                        <span className="checkout-choice-note">Enter an email and delivery address for this order only.</span>
                      </span>
                      <span className="checkout-choice-action">{isGuestCheckout ? 'Selected' : 'Choose'}</span>
                    </button>
                  </div>
                </section>
              )}

              <section style={styles.card}>
                <div style={styles.panelTitleRow}>
                  <div>
                    <p style={styles.panelKicker}>{isGuestCheckout ? 'Guest checkout' : 'Delivery details'}</p>
                    <h2 style={styles.sectionTitle}>
                      {isGuestCheckout ? 'Guest Checkout Details' : 'Shipping Address'}
                    </h2>
                  </div>
                </div>

                {!isAuthenticated && checkoutMode !== 'guest' ? (
                  <div style={styles.mutedPanel}>
                    Select <strong>Log In</strong>, <strong>Create Account</strong>, or <strong>Checkout as Guest</strong> to continue.
                  </div>
                ) : (
                  <form noValidate onSubmit={(event) => { void handleSubmit(event); }}>
                    {isGuestCheckout ? (
                      <div className="checkout-form">
                        <section className="checkout-form-section" aria-labelledby="guest-customer-details-heading">
                          <div className="checkout-form-section-header">
                            <p className="checkout-form-kicker">Customer details</p>
                            <h3 id="guest-customer-details-heading" className="checkout-form-title">
                              Contact information
                            </h3>
                          </div>

                          <div className="checkout-field-grid">
                            <div className="checkout-field">
                              <label htmlFor="customer-email" className="checkout-field-label">
                                Email for order confirmation <span className="checkout-required" aria-hidden="true">*</span>
                              </label>
                              <input
                                id="customer-email"
                                name="customerEmail"
                                type="email"
                                value={customerEmail}
                                onChange={(event) => updateCustomerEmail(event.target.value)}
                                onBlur={() => markGuestFieldTouched('customerEmail')}
                                className={`checkout-field-control${getGuestFieldError('customerEmail') ? ' has-error' : ''}`}
                                placeholder="student@example.com"
                                autoComplete="email"
                                maxLength={256}
                                required
                                aria-invalid={Boolean(getGuestFieldError('customerEmail'))}
                                aria-describedby={getGuestFieldError('customerEmail') ? getGuestFieldErrorId('customerEmail') : undefined}
                              />
                              {renderGuestFieldError('customerEmail')}
                            </div>
                          </div>

                          <div className="checkout-field-grid checkout-field-grid-two">
                            <div className="checkout-field">
                              <label htmlFor="guest-first-name" className="checkout-field-label">
                                First name <span className="checkout-required" aria-hidden="true">*</span>
                              </label>
                              <input
                                id="guest-first-name"
                                name="firstName"
                                type="text"
                                value={guestDeliveryDetails.firstName}
                                onChange={(event) => updateGuestDeliveryDetail('firstName', event.target.value)}
                                onBlur={() => markGuestFieldTouched('firstName')}
                                className={`checkout-field-control${getGuestFieldError('firstName') ? ' has-error' : ''}`}
                                autoComplete="given-name"
                                maxLength={80}
                                required
                                aria-invalid={Boolean(getGuestFieldError('firstName'))}
                                aria-describedby={getGuestFieldError('firstName') ? getGuestFieldErrorId('firstName') : undefined}
                              />
                              {renderGuestFieldError('firstName')}
                            </div>

                            <div className="checkout-field">
                              <label htmlFor="guest-last-name" className="checkout-field-label">
                                Last name <span className="checkout-required" aria-hidden="true">*</span>
                              </label>
                              <input
                                id="guest-last-name"
                                name="lastName"
                                type="text"
                                value={guestDeliveryDetails.lastName}
                                onChange={(event) => updateGuestDeliveryDetail('lastName', event.target.value)}
                                onBlur={() => markGuestFieldTouched('lastName')}
                                className={`checkout-field-control${getGuestFieldError('lastName') ? ' has-error' : ''}`}
                                autoComplete="family-name"
                                maxLength={80}
                                required
                                aria-invalid={Boolean(getGuestFieldError('lastName'))}
                                aria-describedby={getGuestFieldError('lastName') ? getGuestFieldErrorId('lastName') : undefined}
                              />
                              {renderGuestFieldError('lastName')}
                            </div>
                          </div>

                          <div className="checkout-field-grid">
                            <div className="checkout-field">
                              <label htmlFor="guest-phone" className="checkout-field-label">
                                Phone <span className="checkout-required" aria-hidden="true">*</span>
                              </label>
                              <input
                                id="guest-phone"
                                name="phone"
                                type="tel"
                                value={guestDeliveryDetails.phone}
                                onChange={(event) => updateGuestDeliveryDetail('phone', event.target.value)}
                                onBlur={() => markGuestFieldTouched('phone')}
                                className={`checkout-field-control${getGuestFieldError('phone') ? ' has-error' : ''}`}
                                placeholder="(614) 555-0100"
                                autoComplete="tel"
                                maxLength={40}
                                required
                                aria-invalid={Boolean(getGuestFieldError('phone'))}
                                aria-describedby={getGuestFieldError('phone') ? getGuestFieldErrorId('phone') : undefined}
                              />
                              {renderGuestFieldError('phone')}
                            </div>
                          </div>
                        </section>

                        <section className="checkout-form-section" aria-labelledby="guest-delivery-details-heading">
                          <div className="checkout-form-section-header">
                            <p className="checkout-form-kicker">Delivery details</p>
                            <h3 id="guest-delivery-details-heading" className="checkout-form-title">
                              Shipping address
                            </h3>
                          </div>

                          <div className="checkout-field-grid">
                            <div className="checkout-field">
                              <label htmlFor="guest-country" className="checkout-field-label">
                                Country/Region <span className="checkout-required" aria-hidden="true">*</span>
                              </label>
                              <input
                                id="guest-country"
                                name="country"
                                type="text"
                                value={guestDeliveryDetails.country}
                                onChange={(event) => updateGuestDeliveryDetail('country', event.target.value)}
                                onBlur={() => markGuestFieldTouched('country')}
                                className={`checkout-field-control${getGuestFieldError('country') ? ' has-error' : ''}`}
                                autoComplete="shipping country-name"
                                maxLength={80}
                                required
                                aria-invalid={Boolean(getGuestFieldError('country'))}
                                aria-describedby={getGuestFieldError('country') ? getGuestFieldErrorId('country') : undefined}
                              />
                              {renderGuestFieldError('country')}
                            </div>
                          </div>

                          <div className="checkout-field-grid">
                            <div className="checkout-field">
                              <label htmlFor="guest-street-address" className="checkout-field-label">
                                Street address <span className="checkout-required" aria-hidden="true">*</span>
                              </label>
                              <input
                                id="guest-street-address"
                                name="streetAddress"
                                type="text"
                                value={guestDeliveryDetails.streetAddress}
                                onChange={(event) => updateGuestDeliveryDetail('streetAddress', event.target.value)}
                                onBlur={() => markGuestFieldTouched('streetAddress')}
                                className={`checkout-field-control${getGuestFieldError('streetAddress') ? ' has-error' : ''}`}
                                placeholder="123 High St"
                                autoComplete="shipping address-line1"
                                maxLength={160}
                                required
                                aria-invalid={Boolean(getGuestFieldError('streetAddress'))}
                                aria-describedby={getGuestFieldError('streetAddress') ? getGuestFieldErrorId('streetAddress') : undefined}
                              />
                              {renderGuestFieldError('streetAddress')}
                            </div>
                          </div>

                          <div className="checkout-field-grid">
                            <div className="checkout-field">
                              <label htmlFor="guest-apartment" className="checkout-field-label">
                                Apartment, suite, unit, etc. <span className="checkout-optional">optional</span>
                              </label>
                              <input
                                id="guest-apartment"
                                name="apartment"
                                type="text"
                                value={guestDeliveryDetails.apartment}
                                onChange={(event) => updateGuestDeliveryDetail('apartment', event.target.value)}
                                className="checkout-field-control"
                                placeholder="Apt 4B"
                                autoComplete="shipping address-line2"
                                maxLength={80}
                              />
                            </div>
                          </div>

                          <div className="checkout-field-grid checkout-field-grid-three">
                            <div className="checkout-field">
                              <label htmlFor="guest-city" className="checkout-field-label">
                                City <span className="checkout-required" aria-hidden="true">*</span>
                              </label>
                              <input
                                id="guest-city"
                                name="city"
                                type="text"
                                value={guestDeliveryDetails.city}
                                onChange={(event) => updateGuestDeliveryDetail('city', event.target.value)}
                                onBlur={() => markGuestFieldTouched('city')}
                                className={`checkout-field-control${getGuestFieldError('city') ? ' has-error' : ''}`}
                                placeholder="Columbus"
                                autoComplete="shipping address-level2"
                                maxLength={80}
                                required
                                aria-invalid={Boolean(getGuestFieldError('city'))}
                                aria-describedby={getGuestFieldError('city') ? getGuestFieldErrorId('city') : undefined}
                              />
                              {renderGuestFieldError('city')}
                            </div>

                            <div className="checkout-field">
                              <label htmlFor="guest-state" className="checkout-field-label">
                                State <span className="checkout-required" aria-hidden="true">*</span>
                              </label>
                              <input
                                id="guest-state"
                                name="state"
                                type="text"
                                value={guestDeliveryDetails.state}
                                onChange={(event) => updateGuestDeliveryDetail('state', event.target.value)}
                                onBlur={() => markGuestFieldTouched('state')}
                                className={`checkout-field-control${getGuestFieldError('state') ? ' has-error' : ''}`}
                                placeholder="OH"
                                autoComplete="shipping address-level1"
                                maxLength={32}
                                required
                                aria-invalid={Boolean(getGuestFieldError('state'))}
                                aria-describedby={getGuestFieldError('state') ? getGuestFieldErrorId('state') : undefined}
                              />
                              {renderGuestFieldError('state')}
                            </div>

                            <div className="checkout-field">
                              <label htmlFor="guest-zip-code" className="checkout-field-label">
                                ZIP code <span className="checkout-required" aria-hidden="true">*</span>
                              </label>
                              <input
                                id="guest-zip-code"
                                name="zipCode"
                                type="text"
                                value={guestDeliveryDetails.zipCode}
                                onChange={(event) => updateGuestDeliveryDetail('zipCode', event.target.value)}
                                onBlur={() => markGuestFieldTouched('zipCode')}
                                className={`checkout-field-control${getGuestFieldError('zipCode') ? ' has-error' : ''}`}
                                placeholder="43210"
                                autoComplete="shipping postal-code"
                                maxLength={20}
                                required
                                aria-invalid={Boolean(getGuestFieldError('zipCode'))}
                                aria-describedby={getGuestFieldError('zipCode') ? getGuestFieldErrorId('zipCode') : undefined}
                              />
                              {renderGuestFieldError('zipCode')}
                            </div>
                          </div>
                        </section>
                      </div>
                    ) : (
                      <>
                        <label htmlFor="shipping-address" style={styles.label}>Enter full delivery address</label>
                        <textarea
                          id="shipping-address"
                          name="shippingAddress"
                          value={shippingAddress}
                          onChange={(event) => {
                            setShippingAddress(event.target.value);
                            setError(null);
                          }}
                          onFocus={(event) => applyFieldFocus(event.currentTarget)}
                          onBlur={(event) => clearFieldFocus(event.currentTarget)}
                          style={styles.textarea}
                          placeholder="1739 N High St, Columbus, OH 43210"
                          autoComplete="shipping street-address"
                          maxLength={500}
                          required
                        />
                      </>
                    )}

                    {error && <p style={styles.error}>{error}</p>}
                    {isGuestCheckout && !canPlaceOrder && !isSubmitting && (
                      <p className="checkout-submit-note">
                        Complete all required fields and use a valid email to place your guest order.
                      </p>
                    )}

                    <div style={styles.formActions}>
                      <Button type="submit" disabled={!canPlaceOrder}>
                        {isSubmitting
                          ? 'Placing Order...'
                          : isGuestCheckout
                            ? 'Place Guest Order'
                            : 'Place Order'}
                      </Button>
                      <Link to="/cart" style={styles.linkButton}>
                        <Button type="button" disabled={isSubmitting}>Back to Cart</Button>
                      </Link>
                    </div>
                  </form>
                )}
              </section>
            </div>

            <aside style={styles.card} className="checkout-summary-card" aria-labelledby="order-summary-heading">
              <div style={styles.panelTitleRow}>
                <div>
                  <p style={styles.panelKicker}>Your order</p>
                  <h2 id="order-summary-heading" style={styles.sectionTitle}>Order Summary</h2>
                </div>
              </div>
              <ul style={styles.orderList}>
                {items.map((item) => (
                  <li key={item.cartItemId} style={styles.orderItem}>
                    <div>
                      <p style={styles.itemTitle}>{item.title}</p>
                      <p style={styles.itemMeta}>Qty {item.quantity} | ${item.price.toFixed(2)} each</p>
                    </div>
                    <strong style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</strong>
                  </li>
                ))}
              </ul>

              <div style={styles.totals}>
                <div style={styles.totalRow}>
                  <span>Items</span>
                  <span>{itemCount}</span>
                </div>
                <div style={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={styles.totalRow}>
                  <span>Shipping</span>
                  <span>$0.00</span>
                </div>
                <div style={styles.divider} />
                <div style={{ ...styles.totalRow, ...styles.grandTotal }}>
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CheckoutPage;
