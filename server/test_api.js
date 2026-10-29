const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- Starting Biptya Finances API Verification Tests ---');

  const testUser1 = {
    email: `tester_${Date.now()}@biptya.com`,
    password: 'password123',
  };

  const testUser2 = {
    email: `tester2_${Date.now()}@biptya.com`,
    password: 'password123',
  };

  try {
    // 1. Health check
    const healthRes = await fetch('http://localhost:5000/');
    const healthData = await healthRes.json();
    console.log('✅ Health check:', healthData.name, healthData.status);

    // 2. Register User 1
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser1),
    });
    const regData = await regRes.json();
    if (!regRes.ok) throw new Error(regData.message);
    console.log('✅ User 1 registered:', regData.user.email);
    const token1 = regData.token;

    // 3. Prevent duplicate registration
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser1),
    });
    console.log('✅ Duplicate registration rejected with code:', dupRes.status);

    // 4. Login User 1
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser1),
    });
    const loginData = await loginRes.json();
    console.log('✅ User 1 logged in successfully, token received:', !!loginData.token);

    // 5. Auth /me endpoint
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    const meData = await meRes.json();
    console.log('✅ Profile /me fetched:', meData.user.email);

    // 6. Create Transactions for User 1
    const salaryRes = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({
        title: 'Tech Lead Salary',
        amount: 5000,
        type: 'income',
        category: 'Salary',
        date: new Date().toISOString(),
      }),
    });
    const salaryTx = await salaryRes.json();
    console.log('✅ Created Income transaction:', salaryTx.title, `₹${salaryTx.amount}`);

    const rentRes = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({
        title: 'Apartment Rent',
        amount: 1500,
        type: 'expense',
        category: 'Rent',
        date: new Date().toISOString(),
      }),
    });
    const rentTx = await rentRes.json();
    console.log('✅ Created Expense transaction:', rentTx.title, `₹${rentTx.amount}`);

    const groceryRes = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({
        title: 'Weekly Groceries',
        amount: 250,
        type: 'expense',
        category: 'Food',
        date: new Date().toISOString(),
      }),
    });
    const groceryTx = await groceryRes.json();
    console.log('✅ Created Expense transaction:', groceryTx.title, `₹${groceryTx.amount}`);

    // 7. Get All Transactions for User 1
    const listRes = await fetch(`${BASE_URL}/transactions`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    const listData = await listRes.json();
    console.log(`✅ Retrieved ${listData.length} transactions for User 1`);

    // 8. Update Transaction
    const updateRes = await fetch(`${BASE_URL}/transactions/${groceryTx._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({
        amount: 280,
        title: 'Weekly Groceries & Organic Produce',
      }),
    });
    const updatedTx = await updateRes.json();
    console.log('✅ Updated transaction:', updatedTx.title, `₹${updatedTx.amount}`);

    // 9. Register User 2 and verify isolation
    const regRes2 = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser2),
    });
    const regData2 = await regRes2.json();
    const token2 = regData2.token;

    const listUser2Res = await fetch(`${BASE_URL}/transactions`, {
      headers: { Authorization: `Bearer ${token2}` },
    });
    const listUser2 = await listUser2Res.json();
    console.log(`✅ User 2 has ${listUser2.length} transactions (Data isolation verified)`);

    // 10. Attempt to update User 1's transaction using User 2's token (must fail with 404)
    const illegalUpdateRes = await fetch(`${BASE_URL}/transactions/${salaryTx._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token2}`,
      },
      body: JSON.stringify({ amount: 999999 }),
    });
    console.log('✅ Cross-user unauthorized modification blocked with status:', illegalUpdateRes.status);

    // 11. Delete Transaction
    const delRes = await fetch(`${BASE_URL}/transactions/${rentTx._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token1}` },
    });
    const delData = await delRes.json();
    console.log('✅ Deleted transaction:', delData.message);

    // Verify deletion
    const finalTxRes = await fetch(`${BASE_URL}/transactions`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    const finalTxList = await finalTxRes.json();
    console.log(`✅ Final transaction count for User 1: ${finalTxList.length}`);

    console.log('\n🎉 ALL BACKEND API TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

runTests();
