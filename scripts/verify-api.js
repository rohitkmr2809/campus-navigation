/**
 * End-to-End API Verification Script
 * Tests all core modules of Campus Navigation System
 */
const BASE_URL = process.env.TEST_URL || 'http://localhost:3005';

async function runVerification() {
  console.log('==================================================');
  console.log('STARTING END-TO-END CAMPUS NAVIGATION TEST SUITE');
  console.log(`Target URL: ${BASE_URL}`);
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  const assertTest = (condition, name, details = '') => {
    if (condition) {
      console.log(` [PASS] ${name} ${details ? '(' + details + ')' : ''}`);
      passed++;
    } else {
      console.error(` [FAIL] ${name} ${details ? '(' + details + ')' : ''}`);
      failed++;
    }
  };

  try {
    // 1. Test Locations API
    console.log('\n--- 1. TESTING CAMPUS LOCATIONS API ---');
    const locRes = await fetch(`${BASE_URL}/api/locations`);
    const locData = await locRes.json();
    assertTest(locRes.ok && locData.success, 'Fetch all locations', `Found ${locData.count} locations`);
    assertTest(locData.count >= 15, 'Minimum 15 campus locations exist');

    const mainGate = locData.data.find((l) => l.name === 'Main Gate');
    const cseBlock = locData.data.find((l) => l.name.includes('Computer Science'));
    assertTest(!!mainGate && !!cseBlock, 'Main Gate & CSE Block exist in database');

    // 2. Test Roads API
    console.log('\n--- 2. TESTING CAMPUS ROADS API ---');
    const roadRes = await fetch(`${BASE_URL}/api/roads`);
    const roadData = await roadRes.json();
    assertTest(roadRes.ok && roadData.success, 'Fetch all roads', `Found ${roadData.count} roads`);
    assertTest(roadData.count >= 20, 'Minimum 20 campus roads exist');

    // 3. Test Dijkstra Shortest Path API
    console.log('\n--- 3. TESTING DIJKSTRA NAVIGATION ROUTING API ---');
    const navRes = await fetch(`${BASE_URL}/api/navigation/shortest-path`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceId: mainGate._id || mainGate.id,
        destinationId: cseBlock._id || cseBlock.id,
      }),
    });
    const navData = await navRes.json();
    assertTest(navRes.ok && navData.success, 'Calculate shortest path from Main Gate to CSE Block');
    assertTest(navData.totalDistance > 0, 'Total distance calculated', `${navData.totalDistance}m`);
    assertTest(navData.walkingTimeMinutes > 0, 'Walking time calculated', `${navData.walkingTimeMinutes} min`);
    assertTest(navData.polylineCoordinates?.length > 1, 'Polyline coordinates generated for Leaflet map');
    assertTest(navData.turnByTurn?.length > 0, 'Turn-by-turn walking directions generated');

    // 4. Test Dijkstra Edge Case: Same start and destination
    console.log('\n--- 4. TESTING DIJKSTRA EDGE CASES ---');
    const sameLocRes = await fetch(`${BASE_URL}/api/navigation/shortest-path`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceId: mainGate._id || mainGate.id,
        destinationId: mainGate._id || mainGate.id,
      }),
    });
    const sameLocData = await sameLocRes.json();
    assertTest(sameLocRes.ok && sameLocData.totalDistance === 0, 'Identical start and destination handled gracefully (0m)');

    // 5. Test Authentication: Admin Login
    console.log('\n--- 5. TESTING AUTHENTICATION ---');
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@campus.edu',
        password: 'Admin@123',
      }),
    });
    const adminData = await adminLoginRes.json();
    assertTest(adminLoginRes.ok && adminData.success, 'Admin login with valid credentials');
    assertTest(adminData.user?.role === 'admin', 'User has admin role');

    // Test Invalid Login
    const invalidLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@campus.edu',
        password: 'WrongPassword999',
      }),
    });
    assertTest(invalidLoginRes.status === 401, 'Invalid password rejected with HTTP 401');

    // 6. Test Registration
    console.log('\n--- 6. TESTING USER REGISTRATION ---');
    const testEmail = `test_student_${Date.now()}@campus.edu`;
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Verification Student',
        email: testEmail,
        password: 'Student@123',
        role: 'student',
      }),
    });
    const regData = await regRes.json();
    assertTest(regRes.status === 201 && regData.success, 'Register new student account', `Email: ${testEmail}`);

    // Duplicate Registration Rejection
    const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Student',
        email: testEmail,
        password: 'Student@123',
        role: 'student',
      }),
    });
    assertTest(dupRes.status === 409, 'Duplicate email registration rejected with HTTP 409');

    // 7. Test Location Search
    console.log('\n--- 7. TESTING LOCATION SEARCH ---');
    const searchRes = await fetch(`${BASE_URL}/api/locations?search=Library`);
    const searchData = await searchRes.json();
    assertTest(searchRes.ok && searchData.data?.length >= 1, 'Search location by keyword "Library"', `Matches: ${searchData.data?.length}`);

    // Summary
    console.log('\n==================================================');
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('==================================================\n');

    if (failed === 0) {
      console.log(' ALL MODULES VERIFIED & WORKING PERFECTLY!');
      process.exit(0);
    } else {
      console.error(' SOME TESTS FAILED. CHECK LOGS.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Verification script error:', error.message);
    process.exit(1);
  }
}

runVerification();
