import { CSSProperties, FC, FormEvent, useEffect, useMemo, useState } from 'react';
import Header from '../components/organisms/Header';
import {
  createProduct,
  deleteProduct,
  getAllOrdersForAdmin,
  getProducts,
  updateOrderStatus,
  updateProduct,
} from '../services/api';
import { Order, Product, ProductUpsertRequest } from '../types';

interface ProductFormState {
  title: string;
  description: string;
  price: string;
  category: string;
  brand: string;
  imageUrl: string;
  stockQuantity: string;
  isAvailable: boolean;
}

const ORDER_STATUSES = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const;

const emptyProductForm: ProductFormState = {
  title: '',
  description: '',
  price: '0',
  category: '',
  brand: '',
  imageUrl: '',
  stockQuantity: '0',
  isAvailable: true,
};

const AdminDashboardPage: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStatuses, setOrderStatuses] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyProductForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#f7f7f8',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px 20px 50px',
      display: 'grid',
      gap: '20px',
    },
    title: {
      margin: 0,
      fontSize: '30px',
      fontWeight: 800,
      color: '#1a1a1a',
    },
    subtitle: {
      margin: '6px 0 0',
      color: '#555',
      fontSize: '14px',
    },
    section: {
      backgroundColor: '#fff',
      border: '1px solid #e9e9e9',
      borderRadius: '12px',
      padding: '20px',
    },
    sectionTitle: {
      margin: '0 0 16px',
      fontSize: '20px',
      fontWeight: 700,
      color: '#1a1a1a',
    },
    messageError: {
      border: '1px solid #f3bbbb',
      backgroundColor: '#fff3f3',
      color: '#9f1111',
      padding: '10px 12px',
      borderRadius: '8px',
      fontSize: '14px',
    },
    messageSuccess: {
      border: '1px solid #c6e9ce',
      backgroundColor: '#f2fff4',
      color: '#106b2d',
      padding: '10px 12px',
      borderRadius: '8px',
      fontSize: '14px',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '12px',
      marginBottom: '12px',
    },
    field: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      fontSize: '13px',
      color: '#333',
      fontWeight: 600,
    },
    input: {
      border: '1px solid #dadada',
      borderRadius: '7px',
      padding: '9px 10px',
      fontSize: '14px',
      fontFamily: 'inherit',
    },
    checkboxRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: 600,
      color: '#333',
    },
    actions: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
    },
    buttonPrimary: {
      backgroundColor: '#BB0000',
      border: 'none',
      borderRadius: '7px',
      color: '#fff',
      padding: '10px 14px',
      fontSize: '14px',
      fontWeight: 700,
      cursor: 'pointer',
    },
    buttonSecondary: {
      backgroundColor: '#fff',
      border: '1px solid #dadada',
      borderRadius: '7px',
      color: '#333',
      padding: '10px 14px',
      fontSize: '14px',
      fontWeight: 700,
      cursor: 'pointer',
    },
    buttonDanger: {
      backgroundColor: '#fff4f4',
      border: '1px solid #f2b4b4',
      borderRadius: '7px',
      color: '#9a0b0b',
      padding: '8px 12px',
      fontSize: '13px',
      fontWeight: 700,
      cursor: 'pointer',
    },
    tableWrap: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px',
    },
    th: {
      textAlign: 'left',
      borderBottom: '1px solid #ececec',
      padding: '10px 8px',
      color: '#444',
      fontWeight: 700,
      whiteSpace: 'nowrap',
    },
    td: {
      borderBottom: '1px solid #f2f2f2',
      padding: '10px 8px',
      color: '#2f2f2f',
      verticalAlign: 'top',
    },
    smallText: {
      fontSize: '12px',
      color: '#666',
    },
    statusSelect: {
      border: '1px solid #d6d6d6',
      borderRadius: '6px',
      padding: '6px 8px',
      fontSize: '13px',
      marginRight: '8px',
    },
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.id - b.id);
  }, [products]);

  const loadAdminData = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const [productData, orderData] = await Promise.all([
        getProducts(),
        getAllOrdersForAdmin(),
      ]);

      setProducts(productData);
      setOrders(orderData);
      setOrderStatuses(
        orderData.reduce<Record<number, string>>((accumulator, order) => {
          accumulator[order.id] = order.status;
          return accumulator;
        }, {}),
      );
    } catch (loadError) {
      if (loadError instanceof Error && loadError.message.trim().length > 0) {
        setError(loadError.message);
      } else {
        setError('Unable to load admin dashboard data.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAdminData();
  }, []);

  const buildProductPayload = (): ProductUpsertRequest => {
    return {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      brand: form.brand.trim() || undefined,
      imageUrl: form.imageUrl.trim(),
      isAvailable: form.isAvailable,
      stockQuantity: Number(form.stockQuantity),
      postedDate: new Date().toISOString(),
    };
  };

  const resetProductForm = (): void => {
    setEditingProductId(null);
    setForm(emptyProductForm);
  };

  const handleProductSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = buildProductPayload();

    if (!payload.title || Number.isNaN(payload.price) || Number.isNaN(payload.stockQuantity)) {
      setError('Title, price, and stock quantity are required.');
      return;
    }

    if (payload.price < 0 || payload.stockQuantity < 0) {
      setError('Price and stock quantity must be non-negative values.');
      return;
    }

    setIsSavingProduct(true);

    try {
      if (editingProductId === null) {
        const created = await createProduct(payload);
        setProducts((current) => [...current, created]);
        setSuccess('Product created successfully.');
      } else {
        const updated = await updateProduct(editingProductId, payload);
        setProducts((current) => current.map((item) => (item.id === updated.id ? updated : item)));
        setSuccess(`Product #${updated.id} updated successfully.`);
      }

      resetProductForm();
    } catch (saveError) {
      if (saveError instanceof Error && saveError.message.trim().length > 0) {
        setError(saveError.message);
      } else {
        setError('Unable to save product.');
      }
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleEditProduct = (product: Product): void => {
    setEditingProductId(product.id);
    setForm({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      brand: product.brand ?? '',
      imageUrl: product.imageUrl,
      stockQuantity: product.stockQuantity.toString(),
      isAvailable: product.isAvailable,
    });
  };

  const handleDeleteProduct = async (productId: number): Promise<void> => {
    setError(null);
    setSuccess(null);

    const confirmed = window.confirm(`Delete product #${productId}?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(productId);
      setProducts((current) => current.filter((item) => item.id !== productId));
      if (editingProductId === productId) {
        resetProductForm();
      }
      setSuccess(`Product #${productId} deleted successfully.`);
    } catch (deleteError) {
      if (deleteError instanceof Error && deleteError.message.trim().length > 0) {
        setError(deleteError.message);
      } else {
        setError('Unable to delete product.');
      }
    }
  };

  const handleOrderStatusChange = (orderId: number, status: string): void => {
    setOrderStatuses((current) => ({
      ...current,
      [orderId]: status,
    }));
  };

  const handleOrderStatusUpdate = async (orderId: number): Promise<void> => {
    const nextStatus = orderStatuses[orderId];
    if (!nextStatus) {
      return;
    }

    setError(null);
    setSuccess(null);
    setUpdatingOrderId(orderId);

    try {
      const updatedOrder = await updateOrderStatus(orderId, { status: nextStatus });
      setOrders((current) => current.map((order) => (order.id === orderId ? updatedOrder : order)));
      setSuccess(`Order #${orderId} updated to ${updatedOrder.status}.`);
    } catch (updateError) {
      if (updateError instanceof Error && updateError.message.trim().length > 0) {
        setError(updateError.message);
      } else {
        setError('Unable to update order status.');
      }
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.container}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Manage products and monitor all customer orders.</p>
        </div>

        {error && <div style={styles.messageError}>{error}</div>}
        {success && <div style={styles.messageSuccess}>{success}</div>}

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>{editingProductId === null ? 'Add Product' : `Edit Product #${editingProductId}`}</h2>
          <form onSubmit={(event) => { void handleProductSubmit(event); }}>
            <div style={styles.formGrid}>
              <label style={styles.field}>
                Title
                <input
                  style={styles.input}
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  required
                />
              </label>

              <label style={styles.field}>
                Category
                <input
                  style={styles.input}
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                />
              </label>

              <label style={styles.field}>
                Price
                <input
                  style={styles.input}
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                  required
                />
              </label>

              <label style={styles.field}>
                Stock Quantity
                <input
                  style={styles.input}
                  type="number"
                  min="0"
                  step="1"
                  value={form.stockQuantity}
                  onChange={(event) => setForm((current) => ({ ...current, stockQuantity: event.target.value }))}
                  required
                />
              </label>

              <label style={styles.field}>
                Brand
                <input
                  style={styles.input}
                  value={form.brand}
                  onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))}
                />
              </label>

              <label style={styles.field}>
                Image URL
                <input
                  style={styles.input}
                  value={form.imageUrl}
                  onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
                />
              </label>

              <label style={{ ...styles.field, gridColumn: '1 / -1' }}>
                Description
                <textarea
                  style={styles.input}
                  rows={3}
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                />
              </label>
            </div>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(event) => setForm((current) => ({ ...current, isAvailable: event.target.checked }))}
              />
              Product is available
            </label>

            <div style={styles.actions}>
              <button style={styles.buttonPrimary} type="submit" disabled={isSavingProduct}>
                {isSavingProduct
                  ? 'Saving...'
                  : editingProductId === null
                    ? 'Create Product'
                    : 'Save Product Changes'}
              </button>
              {editingProductId !== null && (
                <button
                  style={styles.buttonSecondary}
                  type="button"
                  onClick={resetProductForm}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Product Management</h2>
          {isLoading ? (
            <p style={styles.smallText}>Loading products...</p>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Title</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Available</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.map((product) => (
                    <tr key={product.id}>
                      <td style={styles.td}>{product.id}</td>
                      <td style={styles.td}>{product.title}</td>
                      <td style={styles.td}>${product.price.toFixed(2)}</td>
                      <td style={styles.td}>{product.stockQuantity}</td>
                      <td style={styles.td}>{product.isAvailable ? 'Yes' : 'No'}</td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button
                            style={styles.buttonSecondary}
                            type="button"
                            onClick={() => handleEditProduct(product)}
                          >
                            Edit
                          </button>
                          <button
                            style={styles.buttonDanger}
                            type="button"
                            onClick={() => { void handleDeleteProduct(product.id); }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>All Orders</h2>
          {isLoading ? (
            <p style={styles.smallText}>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p style={styles.smallText}>No orders found.</p>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Order</th>
                    <th style={styles.th}>User</th>
                    <th style={styles.th}>Placed</th>
                    <th style={styles.th}>Total</th>
                    <th style={styles.th}>Address</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td style={styles.td}>
                        <div>{order.confirmationNumber}</div>
                        <div style={styles.smallText}>#{order.id}</div>
                      </td>
                      <td style={styles.td}>
                        <div>{order.userId ?? 'Guest'}</div>
                        {order.customerEmail && <div style={styles.smallText}>{order.customerEmail}</div>}
                      </td>
                      <td style={styles.td}>{new Date(order.orderDate).toLocaleString()}</td>
                      <td style={styles.td}>${order.total.toFixed(2)}</td>
                      <td style={styles.td}>{order.shippingAddress}</td>
                      <td style={styles.td}>
                        <select
                          style={styles.statusSelect}
                          value={orderStatuses[order.id] ?? order.status}
                          onChange={(event) => handleOrderStatusChange(order.id, event.target.value)}
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          style={styles.buttonSecondary}
                          onClick={() => { void handleOrderStatusUpdate(order.id); }}
                          disabled={updatingOrderId === order.id}
                        >
                          {updatingOrderId === order.id ? 'Updating...' : 'Update'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
