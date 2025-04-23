
<template>
  <aside class="sidebar">
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/products">Products</router-link></li>
        <li><router-link to="/cart">Cart</router-link></li>
        <li><router-link to="/account">Account</router-link></li>
        <li><router-link to="/orders">Orders</router-link></li>
        <li><router-link to="/chat">Chat</router-link></li>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar'
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: var(--bg-light);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}

.sidebar nav ul {
  list-style: none;
  padding: 0;
}

.sidebar nav ul li {
  margin-bottom: var(--spacing-sm);
}

.sidebar nav ul li a {
  color: var(--text-color);
  text-decoration: none;
}

.sidebar nav ul li a:hover {
  text-decoration: underline;
}
</style>
